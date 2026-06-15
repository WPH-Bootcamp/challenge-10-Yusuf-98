// --- Loading Skeleton (Cart) ---
export default function CartLoading() {
  return (
    <div className='custom-container min-h-screen flex justify-center pt-20 md:pt-22 lg:pt-32'>
      <div className='w-full md:w-114 lg:w-200 flex flex-col gap-4 md:gap-8'>
        <div className='h-8 w-32 animate-pulse rounded-xl bg-neutral-200' />
        <div className='space-y-4'>
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className='rounded-2xl bg-white p-5 shadow-card space-y-4'
            >
              <div className='h-5 w-32 animate-pulse rounded bg-neutral-200' />
              <div className='h-16 w-full animate-pulse rounded-xl bg-neutral-200' />
              <div className='h-16 w-full animate-pulse rounded-xl bg-neutral-200' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
