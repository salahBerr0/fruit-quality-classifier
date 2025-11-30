"use client";

import { useState } from "react";
import { ImageUploader } from "./components/ImageUploader";
import { ResultDisplay } from "./components/ResultDisplay";
import { ErrorMessage } from "./components/ErrorMessage";
import { ClassificationResponse } from "@/types";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [result, setResult] = useState<ClassificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const handleImageProcessed = async (
    base64Image: string,
    originalFile: File
  ) => {
    setError(null);
    setResult(null);
    setCurrentImage(base64Image);
    setIsClassifying(true);

    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Classification failed");
      }

      const data: ClassificationResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsClassifying(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setCurrentImage(null);
    setIsClassifying(false);
  };

  const handleRetry = () => {
    if (currentImage) {
      handleImageProcessed(currentImage, new File([], "retry"));
    }
  };

  return (
    <main className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4'>
      <div className='max-w-4xl mx-auto space-y-8'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h1 className='text-4xl font-bold text-gray-900'>
            Fruit Quality Classifier
          </h1>
          <p className='text-gray-600'>
            Upload an image to check if your fruit is good or bad
          </p>
        </div>

        {/* Main Content */}
        <div className='bg-white rounded-xl shadow-lg p-8 space-y-6'>
          {!result && !isClassifying && (
            <ImageUploader
              onImageProcessed={handleImageProcessed}
              onError={setError}
              disabled={isClassifying}
            />
          )}

          {isClassifying && (
            <div className='flex flex-col items-center gap-4 py-12'>
              <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600'></div>
              <p className='text-lg text-gray-600'>Classifying your fruit...</p>
            </div>
          )}

          {error && (
            <ErrorMessage
              error={error}
              onRetry={currentImage ? handleRetry : undefined}
            />
          )}

          {result && currentImage && (
            <div className='space-y-4'>
              <ResultDisplay result={result} imageUrl={currentImage} />
              <Button onClick={handleReset} className='w-full'>
                Classify Another Fruit
              </Button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className='text-center text-sm text-gray-500'>
          <p>Powered by machine learning • Fast and accurate classification</p>
        </div>
      </div>
    </main>
  );
}
