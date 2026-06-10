import apiClient from './axios';
import type { CartGroup } from '@/types';

export async function getCart(): Promise<CartGroup[]> {
  const { data } = await apiClient.get('/api/cart');
  if (Array.isArray(data)) return data as CartGroup[];
  const d = data as Record<string, unknown>;
  if (Array.isArray(d.data)) return d.data as CartGroup[];
  return [];
}

export async function addToCart(payload: {
  restaurantId: string;
  menuId: string;
  quantity: number;
}): Promise<void> {
  await apiClient.post('/api/cart', payload);
}

export async function updateCartItem(
  id: string,
  quantity: number
): Promise<void> {
  await apiClient.put(`/api/cart/${id}`, { quantity });
}

export async function deleteCartItem(id: string): Promise<void> {
  await apiClient.delete(`/api/cart/${id}`);
}

export async function clearCart(): Promise<void> {
  await apiClient.delete('/api/cart');
}
