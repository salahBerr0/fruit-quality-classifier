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
      // Remove data URI prefix if present
      let base64Data = imageBase64;
      if (imageBase64.includes(",")) {
        base64Data = imageBase64.split(",")[1];
      }

      console.log("Sending prediction request to:", this.baseUrl);
      console.log("Base64 data length:", base64Data.length);

      const response = await fetch(`${this.baseUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Data,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        throw new MLServiceError(
          errorData.detail ||
            errorData.message ||
            `ML service error: ${response.status}`,
          `HTTP_${response.status}`
        );
      }

      const data = await response.json();
      console.log("Prediction result:", data);

      // Return data as-is, matching Python response format
      return {
        result: data.result,
        confidence: data.confidence,
        processing_time: data.processing_time,
        demo_mode: data.demo_mode,
      };
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
            "Cannot connect to ML service. Please check if the service is running.",
            "CONNECTION_ERROR"
          );
        }
      }

      throw error;
    }
  }
}

export class MLServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "MLServiceError";
  }
}
