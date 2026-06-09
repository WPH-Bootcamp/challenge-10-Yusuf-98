import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import type { Restaurant } from '@/types';
import { formatDistance } from '@/lib/utils';

interface RestaurantCardProps {
  restaurant: Restaurant;
  compact?: boolean;
}

export function RestaurantCard({
  restaurant,
  compact = false,
}: RestaurantCardProps) {
  return (
    <Link
      href={`/resto/${restaurant.id}`}
      className={`flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm border border-[#F5F5F5] transition-all hover:shadow-md hover:border-[#E9EAEB] hover:-translate-y-0.5 ${
        compact ? 'p-2.5' : 'p-3'
      }`}
    >
      {/* Logo */}
      <div className='flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50'>
        {restaurant.logo ? (
          <Image
            src={restaurant.logo}
            alt={restaurant.name}
            width={56}
            height={56}
            className='h-full w-full object-cover'
          />
        ) : (
          <span className='text-2xl'>🍔</span>
        )}
      </div>

      {/* Info */}
      <div className='min-w-0 flex-1'>
        <h3 className='truncate text-sm font-semibold text-[#1B1D27]'>
          {restaurant.name}
        </h3>
        <div className='mt-0.5 flex items-center gap-1'>
          <Star className='h-3 w-3 fill-[#FDB022] text-[#FDB022]' />
          <span className='text-xs font-medium text-[#414651]'>
            {restaurant.rating?.toFixed(1)}
          </span>
        </div>
        <div className='mt-0.5 flex items-center gap-1 text-xs text-[#535862]'>
          <MapPin className='h-3 w-3 shrink-0' />
          <span className='truncate'>
            {restaurant.location}
            {restaurant.distance != null &&
              ` · ${formatDistance(restaurant.distance)}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
