import apiClient from './axios';
import type { CheckoutPayload, Order, OrderStatus } from '@/types';

export async function checkout(payload: CheckoutPayload): Promise<Order> {
  const { data } = await apiClient.post('/api/order/checkout', payload);
  const d = data as { data?: { transaction?: Order } };
  return d.data?.transaction ?? (data as Order);
}

export async function getMyOrders(params?: {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}): Promise<Order[]> {
  const cleanParams: Record<string, unknown> = {};
  if (params?.status) cleanParams.status = params.status;
  if (params?.page) cleanParams.page = params.page;
  if (params?.limit) cleanParams.limit = params.limit;

  const { data } = await apiClient.get('/api/order/my-order', {
    params: cleanParams,
  });

  if (Array.isArray(data)) return data as Order[];
  const d = data as Record<string, unknown>;
  if (d.data && typeof d.data === 'object') {
    const inner = d.data as Record<string, unknown>;
    if (Array.isArray(inner.orders)) return inner.orders as Order[];
  }
  if (Array.isArray(d.data)) return d.data as Order[];
  return [];
}
