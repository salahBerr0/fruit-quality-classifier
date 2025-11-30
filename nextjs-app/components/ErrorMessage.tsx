import { AlertCircle, XCircle } from "lucide-react";

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <div className='bg-red-100 border-4 border-red-400 rounded-2xl p-6 flex items-center gap-4'>
      <XCircle className='h-8 w-8 text-red-600 flex-shrink-0' />
      <div className='flex-1'>
        <p className='font-bold text-red-800 text-lg'>
          Oops! Something went wrong
        </p>
        <p className='text-red-600'>{error}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors'
        >
          Try Again
        </button>
      )}
    </div>
  );
}
