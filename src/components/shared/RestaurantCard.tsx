import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import type { Restaurant } from '@/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      href={`/resto/${restaurant.id}`}
      className='flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md'
    >
      <div className='flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50'>
        {restaurant.logo ? (
          <Image
            src={restaurant.logo}
            alt={restaurant.name}
            width={56}
            height={56}
            className='h-full w-full object-cover'
            unoptimized
          />
        ) : (
          <span className='text-2xl'>🍔</span>
        )}
      </div>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-semibold text-neutral-900'>
          {restaurant.name}
        </p>
        <div className='mt-0.5 flex items-center gap-1'>
          <Star className='h-3 w-3 fill-star text-star' />
          <span className='text-xs font-medium text-neutral-700'>
            {restaurant.rating?.toFixed(1)}
          </span>
        </div>
        <div className='mt-0.5 flex items-center gap-1 text-xs text-neutral-500'>
          <MapPin className='h-3 w-3 shrink-0' />
          <span className='truncate'>
            {restaurant.location}
            {restaurant.distance != null &&
              ` · ${restaurant.distance.toFixed(1)} km`}
          </span>
        </div>
      </div>
    </Link>
  );
}
