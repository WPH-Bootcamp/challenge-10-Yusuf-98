'use client';

import { useCallback, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import FilterLine from '@/assets/icons/filter-lines.png';
import CloseFilter from '@/assets/icons/close-filter.png';
import {
  useRestaurants,
  useBestSellers,
  useRestaurantSearch,
} from '@/lib/query/hooks';
import { RestaurantCard } from '@/components/shared/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/shared/Skeletons';
import { FilterPanel } from '@/components/shared/FilterPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeInStagger, FadeInItem } from '@/components/shared/FadeInStagger';
import type { RestaurantFilter } from '@/types';

function CategoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- URL Params ---
  const filter = searchParams.get('filter');
  const category = searchParams.get('category');
  const q = searchParams.get('q') ?? '';
  const priceMin = searchParams.get('priceMin') ?? '';
  const priceMax = searchParams.get('priceMax') ?? '';
  const selectedRange = searchParams.get('range') ?? '';
  const selectedRatings =
    searchParams.get('ratings')?.split(',').filter(Boolean).map(Number) ?? [];

  // --- UI State ---
  const [showFilter, setShowFilter] = useState(false);

  // --- URL Updater ---
  const updateParam = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val) params.set(key, val);
        else params.delete(key);
      });
      router.replace(`/category?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // --- Filter Setters ---
  const setPriceMin = (val: string) => updateParam({ priceMin: val });
  const setPriceMax = (val: string) => updateParam({ priceMax: val });
  const setSelectedRange = (val: string) => updateParam({ range: val });
  const toggleRating = (r: number) => {
    const next = selectedRatings.includes(r)
      ? selectedRatings.filter((x) => x !== r)
      : [...selectedRatings, r];
    updateParam({ ratings: next.join(',') });
  };

  // --- API Params ---
  const apiParams: RestaurantFilter = {
    ...(category && category !== 'lunch' && { category }),
    ...(priceMin && { priceMin: Number(priceMin) }),
    ...(priceMax && { priceMax: Number(priceMax) }),
    ...(selectedRatings.length > 0 && {
      rating: Math.min(...selectedRatings),
    }),
    ...(selectedRange &&
      selectedRange !== 'nearby' && {
        range: Number(selectedRange),
      }),
    limit: 24,
  };

  // --- Data Fetching ---
  const { data: allData, isLoading: loadingAll } = useRestaurants(apiParams);
  const { data: bestData, isLoading: loadingBest } = useBestSellers({
    limit: 24,
  });
  const { data: searchData, isLoading: loadingSearch } = useRestaurantSearch(q);

  const restaurants =
    q.length >= 2
      ? (searchData ?? [])
      : filter === 'best-seller'
        ? (bestData ?? [])
        : (allData ?? []);

  const isLoading =
    q.length >= 2
      ? loadingSearch
      : filter === 'best-seller'
        ? loadingBest
        : loadingAll;

  // --- Page Title ---
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

  const filterProps = {
    selectedRange,
    setSelectedRange,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    selectedRatings,
    toggleRating,
  };

  return (
    <div className='custom-container pt-20 md:pt-22 lg:pt-32 pb-12 bg-white'>
      <div className='mx-auto max-w-7xl'>
        {/* --- Page Title --- */}
        <FadeInItem index={0}>
          <h1 className='mb-5 md:mb-8 text-display-xs lg:text-display-md-track font-extrabold text-neutral-950'>
            {title}
          </h1>
        </FadeInItem>

        <div className='flex flex-col gap-5 lg:flex-row lg:gap-8'>
          {/* --- Filter Sidebar (Desktop) --- */}
          <FadeInItem index={1}>
            <aside className='hidden w-66.5 shrink-0 rounded-xl lg:block'>
              <div className='sticky top-32 rounded-xl bg-white shadow-card'>
                <FilterPanel {...filterProps} />
              </div>
            </aside>
          </FadeInItem>

          {/* --- Filter Button (Mobile) --- */}
          <FadeInItem index={1}>
            <button
              onClick={() => setShowFilter(true)}
              className='flex w-full items-center justify-between rounded-xl px-3 md:px-5 py-3 text-sm md:text-md font-extrabold md:tracking-tight-2 text-neutral-950 lg:hidden shadow-card'
            >
              FILTER
              <Image src={FilterLine} alt='' width={20} height={20} />
            </button>
          </FadeInItem>

          {/* --- Restaurant List --- */}
          <div className='flex-1 min-w-0'>
            {isLoading ? (
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                {Array.from({ length: 8 }).map((_, i) => (
                  <RestaurantCardSkeleton key={i} />
                ))}
              </div>
            ) : restaurants.length === 0 ? (
              // --- Empty State ---
              <FadeInItem index={2}>
                <div className='flex flex-col items-center justify-center py-24 text-center'>
                  <span className='mb-3 text-5xl'>🍽️</span>
                  <p className='text-lg font-bold text-neutral-700'>
                    No restaurants found
                  </p>
                  <p className='mt-1 text-sm text-neutral-500'>
                    Try adjusting your filters
                  </p>
                </div>
              </FadeInItem>
            ) : (
              <FadeInStagger className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                {restaurants.map((r, idx) => (
                  <FadeInItem key={r.id} index={idx % 4}>
                    <RestaurantCard restaurant={r} />
                  </FadeInItem>
                ))}
              </FadeInStagger>
            )}
          </div>
        </div>
      </div>

      {/* --- Filter Drawer (Mobile) --- */}
      <AnimatePresence>
        {showFilter && (
          <div className='fixed inset-0 z-50 lg:hidden'>
            <motion.div
              className='absolute inset-0 bg-black/50'
              onClick={() => setShowFilter(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.div
              className='absolute inset-y-0 left-0 w-[76%] max-w-sm overflow-y-auto py-4 bg-white'
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <FilterPanel {...filterProps} />
            </motion.div>
            <motion.button
              onClick={() => setShowFilter(false)}
              aria-label='Close filter'
              className='absolute left-[calc(76%+8px)] top-4 z-50'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Image src={CloseFilter} alt='' width={32} height={32} />
            </motion.button>
          </div>
        )}
      </AnimatePresence>
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
