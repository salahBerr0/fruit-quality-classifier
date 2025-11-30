export function FeatureCards() {
  return (
    <div className='grid md:grid-cols-3 gap-6 mt-8'>
      <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-green-200'>
        <div className='text-4xl mb-3 text-center'>🎯</div>
        <h3 className='font-bold text-gray-800 text-lg mb-2 text-center'>
          Accurate Detection
        </h3>
        <p className='text-gray-600 text-sm text-center'>
          Advanced AI analyzes your fruit with high precision
        </p>
      </div>

      <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-yellow-200'>
        <div className='text-4xl mb-3 text-center'>⚡</div>
        <h3 className='font-bold text-gray-800 text-lg mb-2 text-center'>
          Lightning Fast
        </h3>
        <p className='text-gray-600 text-sm text-center'>
          Get results in seconds with our optimized models
        </p>
      </div>

      <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-orange-200'>
        <div className='text-4xl mb-3 text-center'>🔒</div>
        <h3 className='font-bold text-gray-800 text-lg mb-2 text-center'>
          Private & Secure
        </h3>
        <p className='text-gray-600 text-sm text-center'>
          Your images are processed securely and not stored
        </p>
      </div>
    </div>
  );
}
