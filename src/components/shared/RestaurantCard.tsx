import Link from 'next/link';
import Image from 'next/image';
import StarIcon from '@/assets/icons/star.png';
import LocationIcon from '@/assets/icons/location.png';
import type { Restaurant } from '@/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const rating = restaurant.star ?? restaurant.rating;
  const location = restaurant.place ?? restaurant.location;

  return (
    <Link
      href={`/resto/${restaurant.id}`}
      className='flex items-center gap-3 md:gap-4 rounded-2xl bg-white shadow-card transition-all hover-scale-105'
      style={{ padding: '16px' }}
    >
      {/* Logo */}
      <div
        className='shrink-0 overflow-hidden rounded-xl bg-orange-50 flex items-center justify-center'
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
        <p className='text-md md:text-lg font-extrabold text-neutral-950 md:tracking-tight-2 line-clamp-1'>
          {restaurant.name}
        </p>

        {/* Rating */}
        <div className='flex items-center gap-1'>
          <Image src={StarIcon} alt='Star' width={24} height={24} />
          <span className='text-sm md:text-md font-medium text-neutral-950 md:tracking-tight-3'>
            {rating?.toFixed(1)}
          </span>
        </div>

        {/* Location + Distance */}
        <div className='flex items-center gap-1.5'>
          <p className='text-sm md:text-md text-neutral-950 tracking-tight-2 line-clamp-1'>
            {location}
            {restaurant.distance != null &&
              ` · ${restaurant.distance.toFixed(1)} km`}
          </p>
        </div>
      </div>
    </Link>
  );
}
