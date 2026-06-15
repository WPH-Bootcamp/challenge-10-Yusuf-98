// --- Loading Skeleton (Main Layout) ---
export default function MainLoading() {
  return (
    <div className='custom-container pt-20 md:pt-22 lg:pt-32 pb-12'>
      <div className='h-8 w-48 animate-pulse rounded-xl bg-neutral-200 mb-8' />
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className='h-64 animate-pulse rounded-2xl bg-neutral-200'
          />
        ))}
      </div>
    </div>
  );
}
