// --- Loading Skeleton (Resto Detail) ---
export default function RestoDetailLoading() {
  return (
    <div className='custom-container pt-20 md:pt-22 lg:pt-32 pb-24'>
      {/* --- Hero Skeleton --- */}
      <div className='h-70 lg:h-117.5 animate-pulse rounded-2xl bg-neutral-200 mb-6' />

      {/* --- Restaurant Info Skeleton --- */}
      <div className='flex items-center gap-4 mb-6'>
        <div className='h-22.5 w-22.5 lg:h-30 lg:w-30 animate-pulse rounded-full bg-neutral-200' />
        <div className='flex flex-col gap-2'>
          <div className='h-7 w-48 animate-pulse rounded-lg bg-neutral-200' />
          <div className='h-5 w-24 animate-pulse rounded-lg bg-neutral-200' />
          <div className='h-5 w-32 animate-pulse rounded-lg bg-neutral-200' />
        </div>
      </div>

      <div className='h-px bg-neutral-200 mb-6' />

      {/* --- Menu Skeleton --- */}
      <div className='h-8 w-24 animate-pulse rounded-lg bg-neutral-200 mb-5' />
      <div className='grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className='h-56 animate-pulse rounded-2xl bg-neutral-200'
          />
        ))}
      </div>
    </div>
  );
}
