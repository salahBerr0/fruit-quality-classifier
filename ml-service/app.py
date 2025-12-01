from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import io
import time
import os
from PIL import Image
import numpy as np
import tensorflow as tf
from typing import Tuple
import json
import traceback

# Initialize FastAPI
app = FastAPI(
    title="Fruit Quality Classifier API",
    version="1.0.0",
    description="AI-powered fruit quality classification service powered by Hugging Face"
)

# CORS middleware (HF Spaces needs this)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# MODEL CONFIGURATION
# ==============================

MODEL_PATH = os.getenv("MODEL_PATH", "./models/model_final.keras")
CLASS_INDICES_PATH = "./models/class_indices.json"
IMAGE_SIZE = 128

# Load class indices (Good/Bad)
if os.path.exists(CLASS_INDICES_PATH):
    with open(CLASS_INDICES_PATH, "r") as f:
        CLASS_NAMES = json.load(f)
    print(f"✓ Class names loaded: {CLASS_NAMES}")
else:
    CLASS_NAMES = {"0": "Bad", "1": "Good"}  # Default mapping
    print(f"⚠ Using default class names: {CLASS_NAMES}")

model = None


def load_model():
    """Load the trained Keras model from /models/."""
    global model
    try:
        if os.path.exists(MODEL_PATH):
            model = tf.keras.models.load_model(MODEL_PATH)
            print(f"✓ Model loaded from {MODEL_PATH}")
            print(f"✓ Input: {model.input_shape}, Output: {model.output_shape}")
            return True
        else:
            print(f"⚠ Model not found at {MODEL_PATH}. Running in demo mode.")
            model = None
            return False

    except Exception as e:
        print(f"✗ Failed to load model: {str(e)}")
        traceback.print_exc()
        model = None
        return False


@app.on_event("startup")
async def startup_event():
    success = load_model()
    if success:
        print("🚀 Model ready!")
    else:
        print("⚠️ Running in demo mode. Upload the model to enable predictions.")


# ==============================
# IMAGE PROCESSING
# ==============================

def preprocess_image(image: Image.Image) -> np.ndarray:
    """Preprocess image to 128x128 RGB normalized array."""
    try:
        # Resize to 128x128
        image = image.resize((IMAGE_SIZE, IMAGE_SIZE), Image.LANCZOS)

        # Convert to RGB
        if image.mode != "RGB":
            image = image.convert("RGB")

        # Normalize to [0, 1]
        arr = np.array(image, dtype=np.float32) / 255.0
        
        # Add batch dimension
        arr = np.expand_dims(arr, axis=0)
        
        print(f"✓ Preprocessed image shape: {arr.shape}")
        return arr
        
    except Exception as e:
        print(f"✗ Preprocessing error: {str(e)}")
        raise ValueError(f"Image preprocessing failed: {str(e)}")


def predict_quality(image_array: np.ndarray) -> Tuple[str, float]:
    """Make prediction using the model."""
    if model is None:
        # Demo mode - random prediction
        import random
        confidence = random.uniform(0.75, 0.99)
        result = random.choice(["Bad", "Good"])
        print(f"⚠ Demo mode: {result} ({confidence:.2%})")
        return result, confidence

    try:
        preds = model.predict(image_array, verbose=0)
        print(f"✓ Model prediction shape: {preds.shape}, values: {preds}")

        if preds.shape[-1] == 1:
            # Binary classification with sigmoid
            prob = float(preds[0][0])
            result = "Good" if prob > 0.5 else "Bad"
            confidence = prob if result == "Good" else 1 - prob

        else:
            # Multi-class with softmax (2 outputs)
            class_idx = int(np.argmax(preds[0]))
            result = CLASS_NAMES[str(class_idx)]
            confidence = float(preds[0][class_idx])

        print(f"✓ Prediction: {result} ({confidence:.2%})")
        return result, confidence

    except Exception as e:
        print(f"✗ Prediction error: {str(e)}")
        traceback.print_exc()
        raise RuntimeError(f"Prediction failed: {str(e)}")


# ==============================
# API MODELS
# ==============================

class ImageRequest(BaseModel):
    image: str  # Base64 string


class PredictionResponse(BaseModel):
    result: str
    confidence: float
    processing_time: float
    demo_mode: bool = False


# ==============================
# ROUTES
# ==============================

@app.get("/")
async def root():
    return {
        "message": "🍎 Fruit Quality Classifier API",
        "status": "online",
        "model_loaded": model is not None,
        "expected_input": f"{IMAGE_SIZE}x{IMAGE_SIZE}",
        "class_names": CLASS_NAMES,
        "endpoints": {
            "predict": "/predict (POST)",
            "predict_file": "/predict-file (POST)",
            "health": "/health (GET)",
            "docs": "/docs"
        }
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "image_size": IMAGE_SIZE,
        "tensorflow_version": tf.__version__,
        "timestamp": time.time()
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict_base64(request: ImageRequest):
    """Predict from base64 encoded image."""
    start = time.time()
    
    print(f"\n{'='*50}")
    print(f"New prediction request received")
    print(f"{'='*50}")

    try:
        # Log incoming data info
        image_data = request.image
        print(f"✓ Received base64 string length: {len(image_data)}")
        
        # Check if it has data URI prefix and remove it
        if image_data.startswith('data:image'):
            print("✓ Removing data URI prefix...")
            # Split by comma and take the base64 part
            image_data = image_data.split(',', 1)[1]
            print(f"✓ Base64 length after prefix removal: {len(image_data)}")
        
        # Decode base64
        try:
            img_bytes = base64.b64decode(image_data)
            print(f"✓ Decoded to {len(img_bytes)} bytes")
        except Exception as e:
            print(f"✗ Base64 decode error: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Invalid base64 encoding: {str(e)}"
            )
        
        # Open image
        try:
            image = Image.open(io.BytesIO(img_bytes))
            print(f"✓ Opened image: size={image.size}, mode={image.mode}")
        except Exception as e:
            print(f"✗ Image open error: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Invalid image data: {str(e)}"
            )
        
        # Preprocess
        img_array = preprocess_image(image)
        
        # Predict
        result, confidence = predict_quality(img_array)
        
        processing_time = time.time() - start
        print(f"✓ Total processing time: {processing_time:.3f}s")
        print(f"{'='*50}\n")

        return PredictionResponse(
            result=result,
            confidence=confidence,
            processing_time=processing_time,
            demo_mode=(model is None),
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"✗ Unexpected error: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@app.post("/predict-file", response_model=PredictionResponse)
async def predict_file(file: UploadFile = File(...)):
    """Predict from uploaded file."""
    start = time.time()
    
    print(f"\n{'='*50}")
    print(f"File upload prediction request")
    print(f"{'='*50}")
    
    # Validate content type
    if not file.content_type.startswith("image/"):
        print(f"✗ Invalid content type: {file.content_type}")
        raise HTTPException(
            status_code=400,
            detail=f"File must be an image, got: {file.content_type}"
        )

    try:
        # Read file
        contents = await file.read()
        print(f"✓ Read {len(contents)} bytes from file: {file.filename}")
        
        # Open image
        image = Image.open(io.BytesIO(contents))
        print(f"✓ Opened image: size={image.size}, mode={image.mode}")
        
        # Preprocess
        img_array = preprocess_image(image)
        
        # Predict
        result, confidence = predict_quality(img_array)
        
        processing_time = time.time() - start
        print(f"✓ Total processing time: {processing_time:.3f}s")
        print(f"{'='*50}\n")

        return PredictionResponse(
            result=result,
            confidence=confidence,
            processing_time=processing_time,
            demo_mode=(model is None),
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"✗ Unexpected error: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )