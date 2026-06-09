import { cn } from '@/lib/utils';

function Skeleton({ className }: { className?: string }) {
  return <div className={cn('shimmer rounded-lg bg-[#E9EAEB]', className)} />;
}

export function RestaurantCardSkeleton() {
  return (
    <div className='flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3'>
      <Skeleton className='h-14 w-14 shrink-0 rounded-xl' />
      <div className='flex-1 space-y-2'>
        <Skeleton className='h-4 w-3/4 rounded' />
        <Skeleton className='h-3 w-1/4 rounded' />
        <Skeleton className='h-3 w-1/2 rounded' />
      </div>
    </div>
  );
}

export function MenuCardSkeleton() {
  return (
    <div className='rounded-2xl border border-gray-100 bg-white overflow-hidden'>
      <Skeleton className='h-40 w-full' />
      <div className='p-3 space-y-2'>
        <Skeleton className='h-4 w-3/4 rounded' />
        <Skeleton className='h-4 w-1/2 rounded' />
        <Skeleton className='h-8 w-full rounded-full' />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className='space-y-4 p-4'>
      <Skeleton className='h-8 w-1/3 rounded' />
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <RestaurantCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export { Skeleton };
