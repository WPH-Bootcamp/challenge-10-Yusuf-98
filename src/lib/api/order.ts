import apiClient from './axios';
import type { CheckoutPayload, Order, OrderStatus } from '@/types';

export async function checkout(payload: CheckoutPayload): Promise<Order> {
  const { data } = await apiClient.post('/api/order/checkout', payload);
  return (data as { data: Order }).data ?? (data as Order);
}

export async function getMyOrders(params?: {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}): Promise<Order[]> {
  const { data } = await apiClient.get('/api/order/my-order', { params });
  if (Array.isArray(data)) return data as Order[];
  const d = data as Record<string, unknown>;
  if (Array.isArray(d.data)) return d.data as Order[];
  return [];
}
