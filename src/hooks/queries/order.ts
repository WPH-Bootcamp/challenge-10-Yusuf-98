import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as orderApi from '@/lib/api/order';
import type { OrderStatus, CheckoutPayload } from '@/types';
import { queryKeys } from './keys';

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
