// --- Server-Side Fetch Utilities ---
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://be-restaurant-production.up.railway.app';

// --- Normalize API Response to Array ---
function toArray(data: unknown): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const d = data as Record<string, unknown>;
  if (d.data && typeof d.data === 'object') {
    const inner = d.data as Record<string, unknown>;
    if (Array.isArray(inner.recommendations)) return inner.recommendations;
    if (Array.isArray(inner.restaurants)) return inner.restaurants;
  }
  if (Array.isArray(d.data)) return d.data;
  if (Array.isArray(d.restaurants)) return d.restaurants;
  if (Array.isArray(d.recommendations)) return d.recommendations;
  if (Array.isArray(d.items)) return d.items;
  return [];
}

// --- Build Query String ---
function buildQuery(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== '') search.set(key, String(val));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

// --- Get Restaurant Detail (Server) ---
export async function getRestaurantByIdServer(id: string) {
  const res = await fetch(
    `${BASE_URL}/api/resto/${id}?limitMenu=20&limitReview=10`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) throw new Error('Restaurant not found');

  const json = await res.json();
  return json.data ?? json;
}

// --- Get Restaurants List (Server) ---
export async function getRestaurantsServer(params?: {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  range?: number;
  limit?: number;
}) {
  const res = await fetch(`${BASE_URL}/api/resto${buildQuery(params ?? {})}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch restaurants');
  const json = await res.json();
  return toArray(json);
}

// --- Search Restaurants (Server) ---
export async function searchRestaurantsServer(
  q: string,
  params?: { page?: number; limit?: number }
) {
  const res = await fetch(
    `${BASE_URL}/api/resto/search${buildQuery({ q, ...params })}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to search restaurants');
  const json = await res.json();
  return toArray(json);
}

// --- Get Best Sellers (Server) ---
export async function getBestSellersServer(params?: {
  page?: number;
  limit?: number;
}) {
  const res = await fetch(
    `${BASE_URL}/api/resto/best-seller${buildQuery(params ?? {})}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error('Failed to fetch best sellers');
  const json = await res.json();
  return toArray(json);
}
