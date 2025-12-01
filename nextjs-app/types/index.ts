export interface ClassificationRequest {
  image: string; // base64 encoded image
}

export interface ClassificationResponse {
  result: "Good" | "Bad";
  confidence: number;
  processing_time: number; // Changed from processingTime to match Python
  demo_mode?: boolean; // Optional, matches Python response
}

export interface MLServiceError {
  message: string;
  code: string;
}

export interface ImageConfig {
  width: number;
  height: number;
  quality: number;
}
