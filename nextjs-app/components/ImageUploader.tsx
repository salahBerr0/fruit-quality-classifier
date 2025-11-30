"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resizeImage, validateImageFile } from "@/lib/imageProcessor";

interface ImageUploaderProps {
  onImageProcessed: (base64Image: string, originalFile: File) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export function ImageUploader({
  onImageProcessed,
  onError,
  disabled,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setIsProcessing(true);

    try {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        onError(validation.error!);
        setIsProcessing(false);
        return;
      }

      // Resize image
      const resizedImage = await resizeImage(file);
      onImageProcessed(resizedImage, file);
    } catch (error) {
      onError(
        error instanceof Error ? error.message : "Failed to process image"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || isProcessing) return;

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled && !isProcessing) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() =>
        !disabled && !isProcessing && fileInputRef.current?.click()
      }
    >
      <input
        ref={fileInputRef}
        type='file'
        accept='image/jpeg,image/png,image/jpg'
        onChange={handleChange}
        className='hidden'
        disabled={disabled || isProcessing}
      />

      {isProcessing ? (
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-12 w-12 animate-spin text-blue-500' />
          <p className='text-sm text-gray-600'>Processing image...</p>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-2'>
          <Upload className='h-12 w-12 text-gray-400' />
          <p className='text-lg font-medium'>Drop an image here</p>
          <p className='text-sm text-gray-500'>or click to browse</p>
          <p className='text-xs text-gray-400 mt-2'>
            Supports: JPEG, PNG (max 10MB)
          </p>
        </div>
      )}
    </div>
  );
}
