'use client';

import { useState } from 'react';
import {
  useRestaurants,
  useRecommended,
  useRestaurantSearch,
} from '@/hooks/queries/resto';
import { useAuthStore } from '@/store/auth.store';
import { RestaurantCard } from '@/components/shared/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/shared/Skeletons';
import { Button } from '@/components/ui/button';
import { FadeInStagger, FadeInItem } from '@/components/shared/FadeInStagger';
import { useHomeSearch } from './HomeSearchProvider';

// --- Restaurant List Section ---
export function RestaurantListSection() {
  const { query } = useHomeSearch();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  // --- UI State ---
  const [showMore, setShowMore] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // --- Data Fetching ---
  const { data: allRestos, isLoading: loadingAll } = useRestaurants({
    limit: 24,
  });
  const { data: recommended, isLoading: loadingRec } = useRecommended(
    { limit: 12 },
    isAuthenticated
  );
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

  return (
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

      {/* --- Loading / Empty / Grid State --- */}
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
  );
}
