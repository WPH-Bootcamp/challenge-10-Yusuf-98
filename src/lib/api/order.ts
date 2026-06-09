import apiClient from './axios';
import type { CheckoutPayload, Order, OrderStatus } from '@/types';

export async function checkout(payload: CheckoutPayload): Promise<Order> {
  const { data } = await apiClient.post<{ data: Order } | Order>(
    '/api/order/checkout',
    payload
  );
  return (data as { data: Order }).data ?? (data as Order);
}

export async function getMyOrders(params?: {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}): Promise<{ data: Order[]; total?: number }> {
  const { data } = await apiClient.get<{ data: Order[]; total?: number }>(
    '/api/order/my-order',
    { params }
  );
  return data;
}
