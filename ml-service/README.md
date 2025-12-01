---
title: Fruit Quality Classifier
emoji: 🍎
colorFrom: green
colorTo: yellow
sdk: docker
pinned: false
license: mit
---

# Fruit Quality Classifier 🍎

AI-powered fruit quality classification using TensorFlow Keras.

## Features

- 🤖 TensorFlow 2.15 Keras model
- 🖼️ Automatic 128x128 image preprocessing
- ⚡ FastAPI for high-performance inference
- 📊 Processing time tracking
- 🔒 Input validation and error handling

## API Endpoints

- `GET /` - Service information
- `GET /health` - Health check
- `GET /model-info` - Model metadata
- `POST /predict` - Classify from base64 image
- `POST /predict-file` - Classify from file upload
- `GET /docs` - Interactive API documentation

## Usage

### Using the API

```python
import requests
import base64

# Read image
with open("fruit.jpg", "rb") as f:
    image_b64 = base64.b64encode(f.read()).decode()

# Make prediction
response = requests.post(
    "https://YOUR-SPACE-URL/predict",
    json={"image": image_b64}
)

result = response.json()
print(f"Quality: {result['result']}")
print(f"Confidence: {result['confidence']:.2%}")
```

### Try in Browser

Visit `/docs` for interactive Swagger UI to test the API.

## Model Requirements

- Input: `(128, 128, 3)` RGB images
- Output: Binary classification (Good/Bad)
- Format: `.h5` Keras model file

## Deployment

This Space is ready to use! Upload your `fruit_classifier.h5` model to the `model/` directory to enable predictions.

Currently running in **demo mode** with random predictions until model is uploaded.
