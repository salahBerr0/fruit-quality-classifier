export interface ClassificationRequest {
  image: string;
}

export interface ClassificationResponse {
  result: "Good" | "Bad";
  confidence: number;
  processingTime?: number;
}

export interface MLServiceError {
  message: string;
  code: string;
}
