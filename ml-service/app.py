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

# Initialize FastAPI
app = FastAPI(
    title="Fruit Quality Classifier API",
    version="1.0.0",
    description="AI-powered fruit quality classification service powered by Hugging Face"
)

# CORS middleware - Allow all origins for HF Spaces
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # HF Spaces needs this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model configuration
MODEL_PATH = os.getenv("MODEL_PATH", "./model/fruit_classifier.h5")
IMAGE_SIZE = 128
CLASS_NAMES = ["Bad", "Good"]

# Global model variable
model = None

def load_model():
    """Load the trained Keras model"""
    global model
    try:
        if os.path.exists(MODEL_PATH):
            model = tf.keras.models.load_model(MODEL_PATH)
            print(f"✓ Model loaded successfully from {MODEL_PATH}")
            print(f"✓ Model input shape: {model.input_shape}")
            print(f"✓ Model output shape: {model.output_shape}")
            return True
        else:
            print(f"⚠ Model file not found at {MODEL_PATH}")
            print(f"⚠ Running in demo mode without actual model")
            model = None
            return False
    except Exception as e:
        print(f"✗ Error loading model: {str(e)}")
        model = None
        return False

@app.on_event("startup")
async def startup_event():
    """Initialize model on application startup"""
    success = load_model()
    if success:
        print("🚀 Model loaded successfully - Ready for predictions!")
    else:
        print("⚠️  Running in demo mode - Upload your model to enable predictions")

def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Preprocess image for Keras model input
    Resize to 128x128 as expected by the model
    """
    try:
        # Resize to 128x128
        image = image.resize((IMAGE_SIZE, IMAGE_SIZE), Image.LANCZOS)
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array
        img_array = np.array(image, dtype=np.float32)
        
        # Normalize pixel values to [0, 1]
        img_array = img_array / 255.0
        
        # Add batch dimension: (128, 128, 3) -> (1, 128, 128, 3)
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    
    except Exception as e:
        raise ValueError(f"Image preprocessing failed: {str(e)}")

def predict_quality(image_array: np.ndarray) -> Tuple[str, float]:
    """
    Make prediction using the loaded Keras model
    Returns: (result, confidence)
    """
    if model is None:
        # Demo mode - return random prediction
        import random
        confidence = random.uniform(0.75, 0.99)
        result = "Good" if random.random() > 0.5 else "Bad"
        return result, confidence
    
    try:
        # Get model prediction
        prediction = model.predict(image_array, verbose=0)
        
        # Handle different model output formats
        if prediction.shape[-1] == 1:
            # Binary classification with single output (sigmoid)
            confidence = float(prediction[0][0])
            result = "Good" if confidence > 0.5 else "Bad"
        elif prediction.shape[-1] == 2:
            # Binary classification with two outputs (softmax)
            confidence = float(np.max(prediction[0]))
            class_idx = int(np.argmax(prediction[0]))
            result = CLASS_NAMES[class_idx]
        else:
            raise ValueError(f"Unexpected model output shape: {prediction.shape}")
        
        # Ensure confidence is between 0 and 1
        confidence = max(0.0, min(1.0, confidence))
        
        return result, confidence
    
    except Exception as e:
        raise RuntimeError(f"Model prediction failed: {str(e)}")

# Pydantic models
class ImageRequest(BaseModel):
    image: str  # Base64 encoded image

class PredictionResponse(BaseModel):
    result: str
    confidence: float
    processing_time: float
    demo_mode: bool = False

@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "message": "🍎 Fruit Quality Classifier API",
        "status": "online",
        "version": "1.0.0",
        "model_loaded": model is not None,
        "expected_input_size": f"{IMAGE_SIZE}x{IMAGE_SIZE}",
        "endpoints": {
            "health": "/health",
            "model_info": "/model-info",
            "predict": "/predict (POST)",
            "predict_file": "/predict-file (POST)",
            "docs": "/docs"
        },
        "powered_by": "Hugging Face Spaces"
    }

@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "expected_input_size": IMAGE_SIZE,
        "tensorflow_version": tf.__version__,
        "demo_mode": model is None,
        "timestamp": time.time()
    }

@app.get("/model-info")
async def model_info():
    """Get model information"""
    if model is None:
        return {
            "status": "demo_mode",
            "message": "No model loaded - running in demo mode",
            "instructions": "Upload fruit_classifier.h5 to enable real predictions"
        }
    
    return {
        "input_shape": str(model.input_shape),
        "output_shape": str(model.output_shape),
        "layers": len(model.layers),
        "parameters": model.count_params(),
        "class_names": CLASS_NAMES
    }

@app.post("/predict", response_model=PredictionResponse)
async def classify_fruit(request: ImageRequest):
    """
    Classify fruit quality from base64 encoded image
    Expected input: 128x128 RGB image
    """
    start_time = time.time()
    
    try:
        # Decode base64 image
        try:
            image_data = base64.b64decode(request.image)
            image = Image.open(io.BytesIO(image_data))
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid image data: {str(e)}"
            )
        
        # Validate image
        if image.size[0] == 0 or image.size[1] == 0:
            raise HTTPException(
                status_code=400,
                detail="Image has invalid dimensions"
            )
        
        # Preprocess image
        try:
            processed_image = preprocess_image(image)
        except ValueError as e:
            raise HTTPException(
                status_code=400,
                detail=str(e)
            )
        
        # Make prediction
        try:
            result, confidence = predict_quality(processed_image)
        except RuntimeError as e:
            raise HTTPException(
                status_code=500,
                detail=str(e)
            )
        
        processing_time = time.time() - start_time
        
        return PredictionResponse(
            result=result,
            confidence=confidence,
            processing_time=processing_time,
            demo_mode=(model is None)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )

@app.post("/predict-file", response_model=PredictionResponse)
async def classify_fruit_file(file: UploadFile = File(...)):
    """
    Alternative endpoint that accepts direct file upload
    """
    start_time = time.time()
    
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="File must be an image"
            )
        
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Preprocess and predict
        processed_image = preprocess_image(image)
        result, confidence = predict_quality(processed_image)
        
        processing_time = time.time() - start_time
        
        return PredictionResponse(
            result=result,
            confidence=confidence,
            processing_time=processing_time,
            demo_mode=(model is None)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )