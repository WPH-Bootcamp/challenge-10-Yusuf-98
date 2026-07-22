import {
  getRestaurantsServer,
  searchRestaurantsServer,
  getBestSellersServer,
} from '@/lib/api/server';
import { CategoryClient } from '@/components/features/category/CategoryClient';

interface CategoryPageProps {
  searchParams: Promise<{
    filter?: string;
    category?: string;
    q?: string;
    priceMin?: string;
    priceMax?: string;
    range?: string;
    ratings?: string;
  }>;
}

export default async function CategoryPage({
  searchParams,
}: CategoryPageProps) {
  const sp = await searchParams;

  // --- Parse URL Params ---
  const filter = sp.filter ?? null;
  const category = sp.category ?? null;
  const q = sp.q ?? '';
  const priceMin = sp.priceMin ?? '';
  const priceMax = sp.priceMax ?? '';
  const selectedRange = sp.range ?? '';
  const selectedRatings =
    sp.ratings?.split(',').filter(Boolean).map(Number) ?? [];

  // --- API Params ---
  const apiParams = {
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

  // --- Server-Side Data Fetch ---
  const restaurants =
    q.length >= 2
      ? await searchRestaurantsServer(q)
      : filter === 'best-seller'
        ? await getBestSellersServer({ limit: 24 })
        : await getRestaurantsServer(apiParams);

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

  return (
    <CategoryClient
      title={title}
      restaurants={restaurants}
      selectedRange={selectedRange}
      priceMin={priceMin}
      priceMax={priceMax}
      selectedRatings={selectedRatings}
    />
  );
}
