'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight } from 'lucide-react';
import {
  useRecommended,
  useBestSellers,
  useRestaurants,
  useRestaurantSearch,
} from '@/lib/query/hooks';
import { useAuthStore } from '@/store/auth.store';
import { RestaurantCard } from '@/components/shared/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/shared/Skeletons';

const CATEGORIES = [
  { label: 'All Restaurant', icon: '🍔', href: '/category' },
  { label: 'Nearby', icon: '📍', href: '/category?filter=nearby' },
  { label: 'Discount', icon: '🏷️', href: '/category?filter=discount' },
  { label: 'Best Seller', icon: '🏆', href: '/category?filter=best-seller' },
  { label: 'Delivery', icon: '🛵', href: '/category?filter=delivery' },
  { label: 'Lunch', icon: '🍱', href: '/category?category=lunch' },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [query, setQuery] = useState('');
  const [showMore, setShowMore] = useState(false);

  const { data: recommended, isLoading: loadingRec } = useRecommended({
    limit: 12,
  });
  const { data: bestSellers, isLoading: loadingBest } = useBestSellers({
    limit: 6,
  });
  const { data: allRestos, isLoading: loadingAll } = useRestaurants({
    limit: 12,
  });
  const { data: searchResults, isLoading: loadingSearch } =
    useRestaurantSearch(query);

  const isSearching = query.length >= 2;

  const mainList = isSearching
    ? (searchResults ?? [])
    : isAuthenticated
      ? (recommended ?? [])
      : (allRestos ?? []);

  const bestList = bestSellers ?? [];

  const isLoadingMain = isSearching
    ? loadingSearch
    : isAuthenticated
      ? loadingRec
      : loadingAll;

  const visibleMain = showMore ? mainList : mainList.slice(0, 12);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/category?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div className='min-h-screen'>
      {/* Hero */}
      <section className='relative flex h-[400px] items-center justify-center sm:h-[480px] lg:h-[520px]'>
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&q=80')",
          }}
        />
        <div className='absolute inset-0 bg-black/55' />
        <div className='relative z-10 w-full max-w-xl px-4 text-center'>
          <h1 className='mb-2 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-[2.75rem]'>
            Explore Culinary Experiences
          </h1>
          <p className='mb-7 text-sm text-white/80 sm:text-base'>
            Search and refine your choice to discover the perfect restaurant.
          </p>
          <form onSubmit={handleSearch} className='relative mx-auto max-w-lg'>
            <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400' />
            <input
              type='search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search restaurants, food and drink'
              className='w-full rounded-full bg-white py-3.5 pl-12 pr-5 text-sm text-neutral-900 shadow-xl placeholder:text-neutral-400 focus:outline-none'
            />
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6'>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className='flex flex-col items-center gap-2 rounded-2xl border border-neutral-100 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95'
            >
              <span className='text-2xl'>{cat.icon}</span>
              <span className='text-xs font-medium leading-tight text-neutral-700'>
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      {!isSearching && (
        <section className='mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-xl font-bold text-neutral-900'>Best Seller</h2>
            <Link
              href='/category?filter=best-seller'
              className='flex items-center gap-0.5 text-sm font-semibold text-primary-100 hover:underline'
            >
              See All <ChevronRight className='h-4 w-4' />
            </Link>
          </div>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {loadingBest
              ? Array.from({ length: 3 }).map((_, i) => (
                  <RestaurantCardSkeleton key={i} />
                ))
              : bestList
                  .slice(0, 6)
                  .map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        </section>
      )}

      {/* Recommended / All / Search */}
      <section className='mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-bold text-neutral-900'>
            {isSearching
              ? `Results for "${query}"`
              : isAuthenticated
                ? 'Recommended'
                : 'All Restaurant'}
          </h2>
          {!isSearching && (
            <Link
              href='/category'
              className='flex items-center gap-0.5 text-sm font-semibold text-primary-100 hover:underline'
            >
              See All <ChevronRight className='h-4 w-4' />
            </Link>
          )}
        </div>

        {isLoadingMain ? (
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 9 }).map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        ) : mainList.length === 0 ? (
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
          <>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {visibleMain.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
            {mainList.length > 12 && !showMore && (
              <div className='mt-8 flex justify-center'>
                <button
                  onClick={() => setShowMore(true)}
                  className='rounded-full border border-neutral-300 px-8 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50'
                >
                  Show More
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
