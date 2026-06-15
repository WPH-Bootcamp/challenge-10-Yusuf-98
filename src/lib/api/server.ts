// --- Server-Side Fetch Utilities ---
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://be-restaurant-production.up.railway.app';

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
