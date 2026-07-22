import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import * as cartApi from '@/lib/api/cart';
import { queryKeys } from './keys';

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
