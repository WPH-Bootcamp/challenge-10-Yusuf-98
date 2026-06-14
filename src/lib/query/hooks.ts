import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import * as restoApi from '@/lib/api/resto';
import * as cartApi from '@/lib/api/cart';
import * as orderApi from '@/lib/api/order';
import * as reviewApi from '@/lib/api/review';
import * as authApi from '@/lib/api/auth';
import type {
  RestaurantFilter,
  OrderStatus,
  ReviewPayload,
  CheckoutPayload,
} from '@/types';

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

// ── Restaurants ───────────────────────────────────────────────────────────────
export function useRestaurants(params?: RestaurantFilter) {
  return useQuery({
    queryKey: queryKeys.restaurants(params),
    queryFn: () => restoApi.getRestaurants(params),
    staleTime: 1000 * 60 * 5,
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

// ── Cart ──────────────────────────────────────────────────────────────────────
export function useCart() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: queryKeys.cart(),
    queryFn: cartApi.getCart,
    staleTime: 0,
    enabled: isAuthenticated,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      cartApi.updateCartItem(id, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
}

export function useDeleteCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cartApi.deleteCartItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
}

// ── Orders ────────────────────────────────────────────────────────────────────
export function useMyOrders(params?: {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: queryKeys.orders(params),
    queryFn: () => orderApi.getMyOrders(params),
    staleTime: 1000 * 30,
  });
}

export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => orderApi.checkout(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cart() });
      qc.invalidateQueries({ queryKey: queryKeys.orders() });
    },
  });
}

// ── Reviews ───────────────────────────────────────────────────────────────────
export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReviewPayload) => reviewApi.createReview(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.myReviews() });
      qc.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
}

export function useMyReviews() {
  return useQuery({
    queryKey: queryKeys.myReviews(),
    queryFn: reviewApi.getMyReviews,
  });
}

// ── Profile ───────────────────────────────────────────────────────────────────
export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile(),
    queryFn: authApi.getProfile,
    staleTime: 1000 * 60 * 10,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.profile() }),
  });
}
