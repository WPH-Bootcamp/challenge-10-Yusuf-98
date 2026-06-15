// --- Loading Skeleton (Orders) ---
export default function OrdersLoading() {
  return (
    <div className='custom-container pt-20 md:pt-32 pb-8 md:pb-25'>
      <div className='h-8 w-36 animate-pulse rounded-xl bg-neutral-200 mb-6' />
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className='h-24 animate-pulse rounded-2xl bg-neutral-200'
          />
        ))}
      </div>
    </div>
  );
}
