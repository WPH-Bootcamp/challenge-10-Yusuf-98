import apiClient from './axios';
import type { Restaurant, RestaurantDetail, RestaurantFilter } from '@/types';

export type { Restaurant };

function toArray(data: unknown): Restaurant[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as Restaurant[];
  const d = data as Record<string, unknown>;
  // { data: { recommendations: [] } }
  if (d.data && typeof d.data === 'object') {
    const inner = d.data as Record<string, unknown>;
    if (Array.isArray(inner.recommendations))
      return inner.recommendations as Restaurant[];
    if (Array.isArray(inner.restaurants))
      return inner.restaurants as Restaurant[];
  }
  if (Array.isArray(d.data)) return d.data as Restaurant[];
  if (Array.isArray(d.restaurants)) return d.restaurants as Restaurant[];
  if (Array.isArray(d.recommendations))
    return d.recommendations as Restaurant[];
  if (Array.isArray(d.items)) return d.items as Restaurant[];
  return [];
}

export async function getRestaurants(
  params?: RestaurantFilter
): Promise<Restaurant[]> {
  const { data } = await apiClient.get('/api/resto', { params });
  return toArray(data);
}

export async function getRestaurantById(
  id: string,
  params?: { limitMenu?: number; limitReview?: number }
): Promise<RestaurantDetail> {
  const { data } = await apiClient.get(`/api/resto/${id}`, { params });
  return (
    (data as { data: RestaurantDetail }).data ?? (data as RestaurantDetail)
  );
}

export async function searchRestaurants(
  q: string,
  params?: { page?: number; limit?: number }
): Promise<Restaurant[]> {
  const { data } = await apiClient.get('/api/resto/search', {
    params: { q, ...params },
  });
  return toArray(data);
}

export async function getBestSellers(params?: {
  page?: number;
  limit?: number;
}): Promise<Restaurant[]> {
  const { data } = await apiClient.get('/api/resto/best-seller', { params });
  return toArray(data);
}

export async function getRecommended(params?: {
  page?: number;
  limit?: number;
}): Promise<Restaurant[]> {
  const { data } = await apiClient.get('/api/resto/recommended', { params });
  return toArray(data);
}

export async function getNearby(params?: {
  range?: number;
  limit?: number;
}): Promise<Restaurant[]> {
  const { data } = await apiClient.get('/api/resto/nearby', { params });
  return toArray(data);
}
