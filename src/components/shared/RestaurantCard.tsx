import Link from 'next/link';
import Image from 'next/image';
import StarIcon from '@/assets/icons/star.png';
import LocationIcon from '@/assets/icons/location.png';
import { getDummyDistance } from '@/lib/utils';
import type { Restaurant } from '@/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const rating = restaurant.star ?? restaurant.rating;
  const location = restaurant.place ?? restaurant.location;
  const distance = restaurant.distance ?? getDummyDistance(restaurant.id);

  return (
    <Link
      href={`/resto/${restaurant.id}`}
      className='flex items-center gap-2 md:gap-3 rounded-2xl bg-white shadow-card transition-all hover-scale-105 p-3 md:p-4'
    >
      {/* Logo */}
      <div
        className='shrink-0 overflow-hidden rounded-xl bg-amber-100 flex items-center justify-center'
        style={{
          width: 'clamp(90px, 8.333vw, 120px)',
          height: 'clamp(90px, 8.333vw, 120px)',
        }}
      >
        {restaurant.logo ? (
          <Image
            src={restaurant.logo}
            alt={restaurant.name}
            width={120}
            height={120}
            className='w-full h-full object-cover'
            unoptimized
          />
        ) : (
          <span className='text-4xl'>🍔</span>
        )}
      </div>

      {/* Info */}
      <div className='flex flex-col gap-0.5 flex-1' style={{ minWidth: 0 }}>
        {/* Name */}
        <p className='h-7.5 md:h-8 text-md md:text-lg font-extrabold text-neutral-950 md:tracking-tight-2 line-clamp-1'>
          {restaurant.name}
        </p>

        {/* Rating */}
        <div className='h-7 md:h-7.5 flex items-center gap-1'>
          <Image src={StarIcon} alt='Star' width={24} height={24} />
          <span className='text-sm md:text-md font-medium text-neutral-950 md:tracking-tight-3'>
            {rating?.toFixed(1)}
          </span>
        </div>

        {/* Location + Distance */}
        <div className='h-7 md:h-7.5 flex items-center gap-1.5'>
          <p className='text-sm md:text-md text-neutral-950 tracking-tight-2 line-clamp-1'>
            {location} · {distance.toFixed(1)} km
          </p>
        </div>
      </div>
    </Link>
  );
}
