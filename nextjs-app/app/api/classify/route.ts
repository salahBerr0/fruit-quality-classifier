import { NextRequest, NextResponse } from "next/server";
import { MLServiceClient, MLServiceError } from "@/lib/mlService";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    if (!body.image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Initialize ML service client
    const mlClient = new MLServiceClient();

    // Call ML service
    const result = await mlClient.classify(body.image);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Classification error:", error);

    if (error instanceof MLServiceError) {
      const statusCode = error.code === "TIMEOUT" ? 504 : 503;
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", service: "classification-api" });
}
