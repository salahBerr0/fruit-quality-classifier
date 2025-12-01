"use client";

import { useState, useRef } from "react";
import { Upload, Zap, Shield, Camera } from "lucide-react";
import { resizeImage, validateImageFile } from "@/lib/imageProcessor";

interface UploadSectionProps {
  onImageProcessed: (base64Image: string, originalFile: File) => void;
  onError: (error: string) => void;
  preview: string | null;
  isProcessing: boolean;
  onReset: () => void;
}

export function UploadSection({
  onImageProcessed,
  onError,
  preview,
  isProcessing,
  onReset,
}: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    try {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        onError(validation.error!);
        return;
      }

      // Resize image for API (128x128)
      const resizedImage = await resizeImage(file);

      // Pass the resized image to parent
      onImageProcessed(resizedImage, file);
    } catch (error) {
      onError(
        error instanceof Error ? error.message : "Failed to process image"
      );
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className='space-y-6'>
      {!preview ? (
        <>
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-200 ${
              isDragging
                ? "border-emerald-500 bg-emerald-50/50"
                : "border-slate-300 hover:border-slate-400 bg-white"
            } cursor-pointer group`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type='file'
              accept='image/jpeg,image/png,image/jpg'
              onChange={handleChange}
              className='hidden'
            />

            <div className='flex flex-col items-center gap-4 text-center'>
              <div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-emerald-50 transition-colors'>
                <Upload className='w-8 h-8 text-slate-400 group-hover:text-emerald-600 transition-colors' />
              </div>
              <div>
                <p className='text-lg font-medium text-slate-900 mb-1'>
                  Drop your image here
                </p>
                <p className='text-sm text-slate-500'>
                  or click to browse files
                </p>
              </div>
              <div className='flex items-center gap-2 text-xs text-slate-400'>
                <span>Supports: JPG, PNG</span>
                <span>•</span>
                <span>Max 10MB</span>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div className='bg-white rounded-xl p-4 border border-slate-200'>
              <Zap className='w-6 h-6 text-emerald-600 mb-2' />
              <p className='text-xs font-medium text-slate-900'>
                Fast Analysis
              </p>
              <p className='text-xs text-slate-500 mt-1'>Results in seconds</p>
            </div>
            <div className='bg-white rounded-xl p-4 border border-slate-200'>
              <Shield className='w-6 h-6 text-emerald-600 mb-2' />
              <p className='text-xs font-medium text-slate-900'>Secure</p>
              <p className='text-xs text-slate-500 mt-1'>Data protected</p>
            </div>
            <div className='bg-white rounded-xl p-4 border border-slate-200'>
              <Camera className='w-6 h-6 text-emerald-600 mb-2' />
              <p className='text-xs font-medium text-slate-900'>
                High Accuracy
              </p>
              <p className='text-xs text-slate-500 mt-1'>AI-powered</p>
            </div>
          </div>
        </>
      ) : (
        <div className='bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm'>
          <div className='aspect-square relative'>
            <img
              src={preview}
              alt='Preview'
              className='w-full h-full object-cover'
            />
            {isProcessing && (
              <div className='absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center'>
                <div className='text-center'>
                  <div className='w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3'></div>
                  <p className='text-white font-medium'>Analyzing image...</p>
                </div>
              </div>
            )}
          </div>
          <div className='p-4 border-t border-slate-200'>
            <button
              onClick={onReset}
              disabled={isProcessing}
              className='text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              ← Upload different image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
