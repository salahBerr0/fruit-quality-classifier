# Fruit Quality Classifier

A Next.js web application that classifies fruits as Good or Bad using machine learning.

## Features

- 🖼️ Image upload with drag-and-drop
- 🔄 Automatic image resizing to ML model requirements
- ⚡ Real-time classification results
- 🛡️ Comprehensive error handling
- 📱 Responsive design

## Setup

1. Install dependencies:

```bash
   npm install
```

2. Configure environment variables:

```env
   NEXT_PUBLIC_ML_SERVICE_URL=http://your-ml-service-url
```

3. Run development server:

```bash
   npm run dev
```

## Architecture

- **Frontend**: Next.js 15 + React + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes
- **ML Service**: External Python service (separate deployment)

## API Endpoints

### POST `/api/classify`

Classifies a fruit image.

**Request:**

```json
{
  "image": "base64-encoded-image"
}
```

**Response:**

```json
{
  "result": "Good" | "Bad",
  "confidence": 0.95,
  "processingTime": 1.23
}
```

## Error Handling

- Image validation (type, size)
- Network errors
- Timeout handling
- ML service errors
- Invalid responses
