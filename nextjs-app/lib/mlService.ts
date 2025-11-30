import { ClassificationResponse } from "@/types";

export class MLServiceClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl?: string, timeout: number = 30000) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_ML_SERVICE_URL || "";
    this.timeout = timeout;
  }

  async classify(imageBase64: string): Promise<ClassificationResponse> {
    if (!this.baseUrl) {
      throw new Error("ML service URL not configured");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageBase64.split(",")[1], // Remove data:image/jpeg;base64, prefix
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new MLServiceError(
          errorData.message || `ML service error: ${response.status}`,
          `HTTP_${response.status}`
        );
      }

      const data = await response.json();
      return this.parseMLResponse(data);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new MLServiceError(
            "Request timeout - ML service took too long to respond",
            "TIMEOUT"
          );
        }

        if (error.message.includes("fetch")) {
          throw new MLServiceError(
            "Cannot connect to ML service",
            "CONNECTION_ERROR"
          );
        }
      }

      throw error;
    }
  }

  private parseMLResponse(data: any): ClassificationResponse {
    // Adjust this based on your actual ML API response format
    if (!data.result || !["Good", "Bad"].includes(data.result)) {
      throw new MLServiceError(
        "Invalid response from ML service",
        "INVALID_RESPONSE"
      );
    }

    return {
      result: data.result,
      confidence: data.confidence || 0,
      processingTime: data.processing_time,
    };
  }
}

export class MLServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "MLServiceError";
  }
}
