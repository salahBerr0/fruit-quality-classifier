import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <Alert variant='destructive'>
      <AlertCircle className='h-4 w-4' />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className='flex items-center justify-between'>
        <span>{error}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className='ml-4 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-800 rounded'
          >
            Retry
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}
