import apiClient from './axios';
import type { CartGroup } from '@/types';

export async function getCart(): Promise<CartGroup[]> {
  const { data } = await apiClient.get('/api/cart');
  if (Array.isArray(data)) return data as CartGroup[];
  const d = data as Record<string, unknown>;
  // { data: { cart: [] } }
  if (d.data && typeof d.data === 'object') {
    const inner = d.data as Record<string, unknown>;
    if (Array.isArray(inner.cart)) return inner.cart as CartGroup[];
  }
  if (Array.isArray(d.data)) return d.data as CartGroup[];
  if (Array.isArray(d.cart)) return d.cart as CartGroup[];
  return [];
}

export async function addToCart(payload: {
  restaurantId: string | number;
  menuId: string | number;
  quantity: number;
}): Promise<void> {
  await apiClient.post('/api/cart', {
    restaurantId: Number(payload.restaurantId),
    menuId: Number(payload.menuId),
    quantity: payload.quantity,
  });
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
