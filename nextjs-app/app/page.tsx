"use client";

import { useState } from "react";
import { ClassificationResponse } from "@/types";
import { Header } from "@/components/Header";
import { UploadSection } from "@/components/UploadSection";
import { ResultSection } from "@/components/ResultSection";
import { InfoSection } from "@/components/InfoSection";
import { Footer } from "@/components/Footer";

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

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col'>
      <Header />

      <main className='flex-1 max-w-7xl mx-auto px-6 py-12 w-full'>
        {!currentImage && (
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-slate-900 mb-4'>
              AI-Powered Quality Assessment
            </h2>
            <p className='text-lg text-slate-600 max-w-2xl mx-auto'>
              Upload an image for instant quality analysis using advanced
              machine learning technology
            </p>
          </div>
        )}

        <div className='grid lg:grid-cols-2 gap-8 mb-12'>
          <UploadSection
            onImageProcessed={handleImageProcessed}
            onError={setError}
            preview={currentImage}
            isProcessing={isClassifying}
            onReset={handleReset}
          />

          <ResultSection
            result={result}
            isClassifying={isClassifying}
            error={error}
            preview={currentImage}
            onReset={handleReset}
          />
        </div>

        <InfoSection />
      </main>

      <Footer />
    </div>
  );
}
