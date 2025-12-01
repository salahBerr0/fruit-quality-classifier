from PIL import Image
import numpy as np
from typing import Tuple

IMAGE_SIZE = 128

def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Preprocess image for Keras model input
    Resize to 128x128 as expected by the model
    
    Args:
        image: PIL Image object
        
    Returns:
        Preprocessed numpy array ready for model input
        
    Raises:
        ValueError: If image preprocessing fails
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


def predict_quality(model, image_array: np.ndarray, class_names: list) -> Tuple[str, float]:
    """
    Make prediction using the loaded Keras model
    
    Args:
        model: Loaded Keras model
        image_array: Preprocessed image array
        class_names: List of class names ["Bad", "Good"]
        
    Returns:
        Tuple of (result, confidence)
        
    Raises:
        RuntimeError: If prediction fails
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
            result = class_names[class_idx]
        else:
            raise ValueError(f"Unexpected model output shape: {prediction.shape}")
        
        # Ensure confidence is between 0 and 1
        confidence = max(0.0, min(1.0, confidence))
        
        return result, confidence
    
    except Exception as e:
        raise RuntimeError(f"Model prediction failed: {str(e)}")