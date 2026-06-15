'use client';

import Link from 'next/link';

// --- Error Boundary (Resto Detail) ---
export default function RestoDetailError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className='custom-container min-h-screen flex flex-col items-center justify-center text-center gap-4'>
      {/* --- Error Icon --- */}
      <span className='text-5xl'>😕</span>

      {/* --- Error Message --- */}
      <h2 className='text-display-xs font-extrabold text-neutral-950'>
        Restaurant not found
      </h2>
      <p className='text-md text-neutral-500'>
        The restaurant you're looking for doesn't exist or failed to load.
      </p>

      {/* --- Actions --- */}
      <div className='flex gap-3 mt-2'>
        <button
          onClick={reset}
          className='rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-bold text-neutral-950 transition-all duration-500 ease-in-out hover-dark'
        >
          Try again
        </button>
        <Link
          href='/'
          className='rounded-full bg-primary-100 px-6 py-2.5 text-sm font-bold text-white transition-all duration-500 ease-in-out hover-dim'
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
