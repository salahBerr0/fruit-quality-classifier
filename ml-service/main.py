from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import tensorflow as tf

app = FastAPI(
    title="Fruit Quality Classifier API",
    version="1.0.0",
    description="AI-powered fruit quality classification service"
)

# Model configuration
MODEL_PATH = os.getenv("MODEL_PATH", "../models/model_final.keras")
IMAGE_SIZE = 128
CLASS_NAMES = ["Bad", "Good"]

# Global model variable
model = None

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-nextjs-app.vercel.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_model():
    """Load the trained Keras model"""
    global model
    try:
        if os.path.exists(MODEL_PATH):
            model = tf.keras.models.load_model(MODEL_PATH)
            print(f"✓ Model loaded successfully from {MODEL_PATH}")
            print(f"✓ Model input shape: {model.input_shape}")
            print(f"✓ Model output shape: {model.output_shape}")
        else:
            print(f"⚠ Model file not found at {MODEL_PATH}")
            print(f"⚠ Running in demo mode without actual model")
            model = None
    except Exception as e:
        print(f"✗ Error loading model: {str(e)}")
        model = None

@app.on_event("startup")
async def startup_event():
    """Initialize model on application startup"""
    load_model()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "Fruit Quality Classifier API",
        "version": "1.0.0",
        "model_loaded": model is not None,
        "expected_input_size": f"{IMAGE_SIZE}x{IMAGE_SIZE}"
    }