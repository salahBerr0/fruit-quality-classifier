import { Loader2, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { ClassificationResponse } from "@/types";

interface ResultSectionProps {
  result: ClassificationResponse | null;
  isClassifying: boolean;
  error: string | null;
  preview: string | null;
  onReset: () => void;
}

export function ResultSection({
  result,
  isClassifying,
  error,
  preview,
  onReset,
}: ResultSectionProps) {
  if (!result && !isClassifying && !preview) {
    return (
      <div className='bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-12 flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4'>
            <ArrowRight className='w-8 h-8 text-slate-400' />
          </div>
          <p className='text-slate-500 font-medium'>
            Upload an image to see results
          </p>
        </div>
      </div>
    );
  }

  if (isClassifying) {
    return (
      <div className='bg-white rounded-2xl border border-slate-200 p-8 min-h-[400px] flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Loader2 className='w-8 h-8 text-emerald-600 animate-spin' />
          </div>
          <p className='text-lg font-semibold text-slate-900 mb-2'>
            Processing Image
          </p>
          <p className='text-sm text-slate-500'>
            Analyzing quality parameters...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-2xl p-6'>
        <div className='flex items-start gap-3'>
          <XCircle className='w-6 h-6 text-red-600 flex-shrink-0 mt-0.5' />
          <div>
            <p className='font-semibold text-red-900'>Error</p>
            <p className='text-sm text-red-700 mt-1'>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const isGood = result.result === "Good";

  return (
    <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn'>
      <div
        className={`p-6 ${
          isGood
            ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200"
            : "bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-200"
        }`}
      >
        <div className='flex items-center gap-3 mb-4'>
          <div
            className={`w-12 h-12 ${
              isGood ? "bg-emerald-500" : "bg-red-500"
            } rounded-full flex items-center justify-center`}
          >
            {isGood ? (
              <CheckCircle2 className='w-7 h-7 text-white' />
            ) : (
              <XCircle className='w-7 h-7 text-white' />
            )}
          </div>
          <div>
            <p className='text-sm font-medium text-slate-600'>
              Classification Result
            </p>
            <h3
              className={`text-2xl font-bold ${
                isGood ? "text-emerald-900" : "text-red-900"
              }`}
            >
              Quality: {result.result}
            </h3>
          </div>
        </div>
      </div>

      <div className='p-6 space-y-6'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='bg-slate-50 rounded-xl p-4'>
            <p className='text-xs font-medium text-slate-500 mb-1'>
              Confidence Score
            </p>
            <p className='text-2xl font-bold text-slate-900'>
              {(result.confidence * 100).toFixed(1)}%
            </p>
            <div className='mt-2 h-2 bg-slate-200 rounded-full overflow-hidden'>
              <div
                className='h-full bg-emerald-500 rounded-full transition-all duration-1000'
                style={{ width: `${result.confidence * 100}%` }}
              ></div>
            </div>
          </div>
          <div className='bg-slate-50 rounded-xl p-4'>
            <p className='text-xs font-medium text-slate-500 mb-1'>
              Processing Time
            </p>
            <p className='text-2xl font-bold text-slate-900'>
              {result.processing_time.toFixed(2)}s
            </p>
            {result.demo_mode && (
              <p className='text-xs text-amber-600 mt-2'>⚠️ Demo Mode</p>
            )}
          </div>
        </div>

        <button
          onClick={onReset}
          className='w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-xl transition-colors'
        >
          Analyze Another Image
        </button>
      </div>
    </div>
  );
}
