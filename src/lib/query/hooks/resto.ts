import { useQuery } from '@tanstack/react-query';
import * as restoApi from '@/lib/api/resto';
import type { RestaurantFilter } from '@/types';
import { queryKeys } from '../keys';

export function useRestaurants(
  params?: RestaurantFilter,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.restaurants(params),
    queryFn: () => restoApi.getRestaurants(params),
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled ?? true,
  });
}

export function useRestaurantDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.restaurantDetail(id),
    queryFn: () =>
      restoApi.getRestaurantById(id, { limitMenu: 20, limitReview: 10 }),
    enabled: !!id,
    staleTime: 1000 * 60 * 3,
  });
}

export function useRestaurantSearch(q: string) {
  return useQuery({
    queryKey: queryKeys.restaurantSearch(q),
    queryFn: () => restoApi.searchRestaurants(q),
    enabled: q.length >= 2,
    staleTime: 1000 * 60,
  });
}

export function useBestSellers(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.bestSellers(params),
    queryFn: () => restoApi.getBestSellers(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRecommended(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.recommended(params),
    queryFn: () => restoApi.getRecommended(params),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useNearby(
  params?: { range?: number; limit?: number },
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.nearby(params),
    queryFn: () => restoApi.getNearby(params),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled,
  });
}
