'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useRestaurants,
  useBestSellers,
  useNearby,
  useRestaurantSearch,
} from '@/lib/query/hooks';
import { RestaurantCard } from '@/components/shared/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/shared/Skeletons';
import type { RestaurantFilter } from '@/types';

function CategoryContent() {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  const category = searchParams.get('category');
  const q = searchParams.get('q') ?? '';

  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedRange, setSelectedRange] = useState('');

  const distances = [
    { label: 'Nearby', value: 'nearby' },
    { label: 'Within 1 km', value: '1' },
    { label: 'Within 3 km', value: '3' },
    { label: 'Within 5 km', value: '5' },
  ];

  const apiParams: RestaurantFilter = {
    ...(category && { category }),
    ...(priceMin && { priceMin: Number(priceMin) }),
    ...(priceMax && { priceMax: Number(priceMax) }),
    ...(selectedRatings.length > 0 && {
      rating: Math.min(...selectedRatings),
    }),
    ...(selectedRange &&
      selectedRange !== 'nearby' && { range: Number(selectedRange) }),
    limit: 24,
  };

  const { data: allData, isLoading: loadingAll } = useRestaurants(apiParams);
  const { data: bestData, isLoading: loadingBest } = useBestSellers({
    limit: 24,
  });
  const { data: nearbyData, isLoading: loadingNearby } = useNearby({
    limit: 24,
  });
  const { data: searchData, isLoading: loadingSearch } = useRestaurantSearch(q);

  const restaurants =
    q.length >= 2
      ? (searchData ?? [])
      : filter === 'best-seller'
        ? (bestData ?? [])
        : filter === 'nearby' || selectedRange === 'nearby'
          ? (nearbyData ?? [])
          : (allData ?? []);

  const isLoading =
    q.length >= 2
      ? loadingSearch
      : filter === 'best-seller'
        ? loadingBest
        : filter === 'nearby'
          ? loadingNearby
          : loadingAll;

  const title = q
    ? `Results for "${q}"`
    : filter === 'best-seller'
      ? 'Best Seller'
      : filter === 'nearby'
        ? 'Nearby'
        : filter === 'discount'
          ? 'Discount'
          : category
            ? category.charAt(0).toUpperCase() + category.slice(1)
            : 'All Restaurant';

  function toggleRating(r: number) {
    setSelectedRatings((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  }

  return (
    <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
      <h1 className='mb-6 text-2xl font-bold text-neutral-900'>{title}</h1>
      <div className='flex gap-8'>
        {/* Filter sidebar */}
        <aside className='hidden w-64 shrink-0 lg:block'>
          <div className='sticky top-24 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm'>
            <p className='mb-4 text-xs font-extrabold uppercase tracking-wider text-neutral-400'>
              FILTER
            </p>

            {/* Distance */}
            <div className='mb-6'>
              <p className='mb-3 text-sm font-bold text-neutral-900'>
                Distance
              </p>
              <div className='space-y-2'>
                {distances.map((d) => (
                  <label
                    key={d.value}
                    className='flex cursor-pointer items-center gap-2.5'
                  >
                    <input
                      type='checkbox'
                      checked={selectedRange === d.value}
                      onChange={() =>
                        setSelectedRange(
                          selectedRange === d.value ? '' : d.value
                        )
                      }
                      className='h-4 w-4 rounded border-neutral-300 text-primary-100 focus:ring-primary-100'
                    />
                    <span className='text-sm text-neutral-700'>{d.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className='mb-6'>
              <p className='mb-3 text-sm font-bold text-neutral-900'>Price</p>
              <div className='space-y-2'>
                <div className='flex items-center gap-1 rounded-xl border border-neutral-200 px-3 py-2 focus-within:border-primary-100 transition-colors'>
                  <span className='text-xs font-medium text-neutral-500'>
                    Rp
                  </span>
                  <input
                    type='number'
                    placeholder='Minimum Price'
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className='w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none'
                  />
                </div>
                <div className='flex items-center gap-1 rounded-xl border border-neutral-200 px-3 py-2 focus-within:border-primary-100 transition-colors'>
                  <span className='text-xs font-medium text-neutral-500'>
                    Rp
                  </span>
                  <input
                    type='number'
                    placeholder='Maximum Price'
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className='w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none'
                  />
                </div>
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className='mb-3 text-sm font-bold text-neutral-900'>Rating</p>
              <div className='space-y-2'>
                {[5, 4, 3, 2, 1].map((r) => (
                  <label
                    key={r}
                    className='flex cursor-pointer items-center gap-2.5'
                  >
                    <input
                      type='checkbox'
                      checked={selectedRatings.includes(r)}
                      onChange={() => toggleRating(r)}
                      className='h-4 w-4 rounded border-neutral-300 text-primary-100 focus:ring-primary-100'
                    />
                    <span className='flex items-center gap-1 text-sm text-neutral-700'>
                      {'⭐'.repeat(r)}
                      <span className='text-neutral-500'>{r}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className='flex-1 min-w-0'>
          {isLoading ? (
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {Array.from({ length: 8 }).map((_, i) => (
                <RestaurantCardSkeleton key={i} />
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-24 text-center'>
              <span className='mb-3 text-5xl'>🍽️</span>
              <p className='text-lg font-bold text-neutral-700'>
                No restaurants found
              </p>
              <p className='mt-1 text-sm text-neutral-500'>
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {restaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense>
      <CategoryContent />
    </Suspense>
  );
}
