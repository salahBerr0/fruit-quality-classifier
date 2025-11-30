import { Camera } from "lucide-react";

export function Header() {
  return (
    <header className='border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center'>
              <Camera className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-xl font-semibold text-slate-900'>
                Fruit Quality AI
              </h1>
              <p className='text-xs text-slate-500'>
                Professional Classification System
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2 text-sm text-slate-600'>
            <div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse'></div>
            <span>System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
