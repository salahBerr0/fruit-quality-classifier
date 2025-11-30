"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
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
      className={`relative border-4 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
        isDragging
          ? "border-green-500 bg-green-50 scale-105"
          : "border-orange-300 hover:border-orange-400 hover:bg-orange-50/30"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer group"}`}
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
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='h-20 w-20 animate-spin text-orange-500' />
          <p className='text-lg text-gray-600'>Processing image...</p>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-4'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-green-400 to-orange-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity'></div>
            <Upload className='relative h-20 w-20 text-orange-500 group-hover:scale-110 transition-transform' />
          </div>
          <div className='space-y-2'>
            <p className='text-2xl font-bold text-gray-800'>
              Drop your fruit image here
            </p>
            <p className='text-lg text-gray-600'>or click to browse</p>
            <div className='flex gap-2 justify-center text-3xl mt-4'>
              🍎 🍊 🍌 🍇 🍓 🍑
            </div>
            <p className='text-sm text-gray-500 mt-4'>
              Supports: JPEG, PNG (max 10MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
