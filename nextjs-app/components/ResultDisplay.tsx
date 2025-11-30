import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClassificationResponse } from "@/types";

interface ResultDisplayProps {
  result: ClassificationResponse;
  imageUrl: string;
}

export function ResultDisplay({ result, imageUrl }: ResultDisplayProps) {
  const isGood = result.result === "Good";

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          {isGood ? (
            <CheckCircle2 className='h-6 w-6 text-green-600' />
          ) : (
            <XCircle className='h-6 w-6 text-red-600' />
          )}
          Classification Result
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='relative aspect-square w-full overflow-hidden rounded-lg'>
          <img
            src={imageUrl}
            alt='Classified fruit'
            className='object-cover w-full h-full'
          />
        </div>

        <div className='space-y-2'>
          <div className='flex justify-between items-center'>
            <span className='text-sm font-medium'>Quality:</span>
            <span
              className={`text-lg font-bold ${
                isGood ? "text-green-600" : "text-red-600"
              }`}
            >
              {result.result}
            </span>
          </div>

          <div className='flex justify-between items-center'>
            <span className='text-sm font-medium'>Confidence:</span>
            <span className='text-sm'>
              {(result.confidence * 100).toFixed(1)}%
            </span>
          </div>

          {result.processingTime && (
            <div className='flex justify-between items-center text-xs text-gray-500'>
              <span>Processing time:</span>
              <span>{result.processingTime.toFixed(2)}s</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
