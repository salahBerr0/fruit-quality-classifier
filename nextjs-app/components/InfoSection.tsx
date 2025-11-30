export function InfoSection() {
  return (
    <div className='bg-white rounded-2xl border border-slate-200 p-8'>
      <h3 className='text-lg font-semibold text-slate-900 mb-4'>
        How It Works
      </h3>
      <div className='grid md:grid-cols-3 gap-6'>
        <div className='flex gap-4'>
          <div className='w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0'>
            <span className='text-emerald-700 font-bold'>1</span>
          </div>
          <div>
            <p className='font-medium text-slate-900 mb-1'>Upload Image</p>
            <p className='text-sm text-slate-600'>
              Drag and drop or click to select your fruit image
            </p>
          </div>
        </div>
        <div className='flex gap-4'>
          <div className='w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0'>
            <span className='text-emerald-700 font-bold'>2</span>
          </div>
          <div>
            <p className='font-medium text-slate-900 mb-1'>AI Analysis</p>
            <p className='text-sm text-slate-600'>
              Our model processes and evaluates quality indicators
            </p>
          </div>
        </div>
        <div className='flex gap-4'>
          <div className='w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0'>
            <span className='text-emerald-700 font-bold'>3</span>
          </div>
          <div>
            <p className='font-medium text-slate-900 mb-1'>Get Results</p>
            <p className='text-sm text-slate-600'>
              Receive instant classification with confidence score
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
