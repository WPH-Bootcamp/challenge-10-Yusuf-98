'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchIcon from '@/assets/icons/search.png';
import {
  useRestaurants,
  useRecommended,
  useRestaurantSearch,
} from '@/lib/query/hooks';
import { useAuthStore } from '@/store/auth.store';
import { RestaurantCard } from '@/components/shared/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/shared/Skeletons';
import HeroImage from '@/assets/images/hero-image.png';
import Image from 'next/image';
import RestaurantIcon from '@/assets/icons/all-restaurants.png';
import NearbyIcon from '@/assets/icons/location.png';
import DiscountIcon from '@/assets/icons/discount.png';
import BestSellerIcon from '@/assets/icons/best-seller.png';
import DeliveryIcon from '@/assets/icons/delivery.png';
import LunchIcon from '@/assets/icons/lunch.png';
import { Button } from '@/components/ui/button';
import { FadeInStagger, FadeInItem } from '@/components/shared/FadeInStagger';

// --- Category List ---
const CATEGORIES = [
  { label: 'All Restaurant', icon: RestaurantIcon, href: '/category' },
  { label: 'Nearby', icon: NearbyIcon, href: '/category?filter=nearby' },
  { label: 'Discount', icon: DiscountIcon, href: '/category?filter=discount' },
  {
    label: 'Best Seller',
    icon: BestSellerIcon,
    href: '/category?filter=best-seller',
  },
  { label: 'Delivery', icon: DeliveryIcon, href: '/category?filter=delivery' },
  { label: 'Lunch', icon: LunchIcon, href: '/category?category=lunch' },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  // --- UI State ---
  const [query, setQuery] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // --- Data Fetching ---
  const { data: allRestos, isLoading: loadingAll } = useRestaurants({
    limit: 24,
  });
  const { data: recommended, isLoading: loadingRec } = useRecommended({
    limit: 12,
  });
  const { data: searchResults, isLoading: loadingSearch } =
    useRestaurantSearch(query);

  // --- Derived State ---
  const isSearching = query.length >= 2;
  const mainList = isSearching
    ? (searchResults ?? [])
    : !_hasHydrated || showAll || !isAuthenticated
      ? (allRestos ?? [])
      : (recommended ?? []);
  const isLoadingMain = isSearching
    ? loadingSearch
    : showAll || !isAuthenticated
      ? loadingAll
      : loadingRec;
  const visibleMain = showMore ? mainList : mainList.slice(0, 12);

  // --- Handlers ---
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/category?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div className='mb-13'>
      {/* --- Hero Section --- */}
      <FadeInItem index={0}>
        <section
          className='relative flex items-center justify-center'
          style={{
            height:
              'clamp(648px, 648px + (827px - 648px) * ((100vw - 393px) / (1440px - 393px)), 827px)',
            backgroundImage: `url(${HeroImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className='absolute inset-0 bg-black/35' />
          <div className='flex flex-col gap-6 md:gap-10 z-10 w-full md:mt-5 md:w-186 px-4 text-center'>
            {/* --- Hero Title --- */}
            <FadeInItem index={1}>
              <div className='flex flex-col gap-1 md:gap-2'>
                <h1 className='text-display-lg-track md:text-display-2xl-track font-extrabold text-white text-center'>
                  Explore Culinary Experiences
                </h1>
                <p className='font-bold text-lg tracking-tight-3 md:text-display-xs md:tracking-none text-white'>
                  Search and refine your choice to discover the perfect
                  restaurant.
                </p>
              </div>
            </FadeInItem>

            {/* --- Search Bar --- */}
            <FadeInItem index={2}>
              <form
                onSubmit={handleSearch}
                className='relative flex gap-6 mx-auto max-w-151 w-full h-12 md:h-14 items-center'
              >
                <Image
                  src={SearchIcon}
                  alt='Search'
                  width={20}
                  height={20}
                  className='absolute left-4 md:left-6 top-1/2 -translate-y-1/2'
                />
                <input
                  type='search'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Search restaurants, food and drink'
                  className='w-full h-full rounded-full bg-white py-2 pl-10.5 md:pl-12.5 pr-4 md:pr-6 text-sm md:text-md text-neutral-950 tracking-tight-2 placeholder:text-neutral-600 focus:outline-none'
                />
              </form>
            </FadeInItem>
          </div>
        </section>
      </FadeInItem>

      {/* --- Categories Section --- */}
      <section className='mx-auto w-full max-w-360 px-4 py-6 md:px-30 md:py-12'>
        <FadeInStagger className='grid grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-5 md:gap-x-5'>
          {CATEGORIES.map((cat, idx) => (
            <FadeInItem key={cat.label} index={idx}>
              <Link
                href={cat.href}
                className='flex flex-col gap-1 md:gap-2 items-center justify-center bg-white transition-all duration-500 ease-in-out hover-scale-105'
              >
                <div className='w-full h-25 flex justify-center items-center p-2 rounded-2xl shadow-card'>
                  <Image
                    src={cat.icon}
                    alt={cat.label}
                    className='w-12 h-12 md:w-16.25 md:h-16.25 object-contain'
                  />
                </div>
                <span className='w-full h-7 md:h-8 flex items-center justify-center text-sm tracking-tight-2 md:text-lg md:tracking-tight-3 font-bold text-neutral-950 text-center'>
                  {cat.label}
                </span>
              </Link>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </section>

      {/* --- Restaurant List Section --- */}
      <section className='mx-auto w-full max-w-360 flex flex-col px-4 pb-12 gap-4 md:gap-6 lg:gap-8 md:px-10 lg:px-30'>
        {/* --- Section Header --- */}
        <FadeInItem index={0}>
          <div className='flex items-center justify-between'>
            <h2 className='text-display-xs md:text-display-md font-extrabold text-neutral-950'>
              {isSearching
                ? `Results for "${query}"`
                : showAll || !isAuthenticated
                  ? 'All Restaurant'
                  : 'Recommended'}
            </h2>
            {!isSearching && !showAll && isAuthenticated && (
              <button
                onClick={() => setShowAll(true)}
                className='text-md md:text-lg font-extrabold text-primary-100 md:tracking-tight-2 hover-scale-105 transition-all duration-500 ease-in-out cursor-pointer'
              >
                See All
              </button>
            )}
          </div>
        </FadeInItem>

        {/* --- Loading State --- */}
        <div>
          {isLoadingMain ? (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5'>
              {Array.from({ length: 9 }).map((_, i) => (
                <RestaurantCardSkeleton key={i} />
              ))}
            </div>
          ) : mainList.length === 0 ? (
            // --- Empty State ---
            <div className='flex flex-col items-center py-16 text-center'>
              <span className='mb-3 text-5xl'>🍽️</span>
              <p className='text-lg font-semibold text-neutral-700'>
                {isSearching ? 'No restaurants found' : 'No restaurants yet'}
              </p>
              <p className='mt-1 text-sm text-neutral-500'>
                {isSearching ? 'Try a different keyword' : 'Check back later'}
              </p>
            </div>
          ) : (
            // --- Restaurant Grid ---
            <>
              <FadeInStagger className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5'>
                {visibleMain.map((r, idx) => (
                  <FadeInItem key={idx} index={idx}>
                    <RestaurantCard restaurant={r} />
                  </FadeInItem>
                ))}
              </FadeInStagger>

              {/* --- Show More Button --- */}
              {mainList.length > 12 && !showMore && (
                <div className='mt-8 flex justify-center'>
                  <Button
                    variant={'outline'}
                    size={'lg'}
                    onClick={() => setShowMore(true)}
                    className='w-40 rounded-full border border-neutral-300 text-sm md:text-md font-bold text-neutral-950 tracking-tight-2 transition-all duration-500 ease-in-out hover-scale-105'
                  >
                    Show More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
