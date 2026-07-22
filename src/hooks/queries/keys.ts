import type { RestaurantFilter } from '@/types';

export const queryKeys = {
  restaurants: (params?: RestaurantFilter) => ['restaurants', params] as const,
  restaurantDetail: (id: string) => ['restaurant', id] as const,
  restaurantSearch: (q: string) => ['restaurants', 'search', q] as const,
  bestSellers: (params?: object) =>
    ['restaurants', 'best-sellers', params] as const,
  recommended: (params?: object) =>
    ['restaurants', 'recommended', params] as const,
  nearby: (params?: object) => ['restaurants', 'nearby', params] as const,
  cart: () => ['cart'] as const,
  orders: (params?: object) => ['orders', params] as const,
  myReviews: () => ['reviews', 'mine'] as const,
  profile: () => ['profile'] as const,
} as const;
