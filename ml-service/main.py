# Add these imports at the top
from pydantic import BaseModel
import base64
import io
import time
from PIL import Image
from fastapi import HTTPException, File, UploadFile
from utils import preprocess_image, predict_quality

# Add after app initialization
class ImageRequest(BaseModel):
    image: str  # Base64 encoded image

class PredictionResponse(BaseModel):
    result: str  # "Good" or "Bad"
    confidence: float
    processing_time: float

@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "expected_input_size": IMAGE_SIZE,
        "tensorflow_version": tf.__version__,
        "timestamp": time.time()
    }

@app.get("/model-info")
async def model_info():
    """Get model information"""
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded"
        )
    
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
            result, confidence = predict_quality(model, processed_image, CLASS_NAMES)
        except RuntimeError as e:
            raise HTTPException(
                status_code=500,
                detail=str(e)
            )
        
        processing_time = time.time() - start_time
        
        return PredictionResponse(
            result=result,
            confidence=confidence,
            processing_time=processing_time
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
        result, confidence = predict_quality(model, processed_image, CLASS_NAMES)
        
        processing_time = time.time() - start_time
        
        return PredictionResponse(
            result=result,
            confidence=confidence,
            processing_time=processing_time
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )