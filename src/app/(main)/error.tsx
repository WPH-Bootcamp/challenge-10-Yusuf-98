'use client';

// --- Error Boundary (Main Layout) ---
export default function MainError({
  error,
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
        Something went wrong
      </h2>
      <p className='text-md text-neutral-500'>{error.message}</p>

      {/* --- Retry Button --- */}
      <button
        onClick={reset}
        className='mt-2 rounded-full bg-primary-100 px-8 py-2.5 text-sm font-bold text-white transition-all duration-500 ease-in-out hover-dim'
      >
        Try again
      </button>
    </div>
  );
}
