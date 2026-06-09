import apiClient from './axios';
import type { Restaurant, RestaurantDetail, RestaurantFilter } from '@/types';

interface ListResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export async function getRestaurants(
  params?: RestaurantFilter
): Promise<ListResponse<Restaurant>> {
  const { data } = await apiClient.get<ListResponse<Restaurant>>('/api/resto', {
    params,
  });
  return data;
}

export async function getRestaurantById(
  id: string,
  params?: { limitMenu?: number; limitReview?: number }
): Promise<RestaurantDetail> {
  const { data } = await apiClient.get<{ data: RestaurantDetail }>(
    `/api/resto/${id}`,
    { params }
  );
  return data.data ?? (data as unknown as RestaurantDetail);
}

export async function searchRestaurants(
  q: string,
  params?: { page?: number; limit?: number }
): Promise<ListResponse<Restaurant>> {
  const { data } = await apiClient.get<ListResponse<Restaurant>>(
    '/api/resto/search',
    { params: { q, ...params } }
  );
  return data;
}

export async function getBestSellers(params?: {
  page?: number;
  limit?: number;
}): Promise<ListResponse<Restaurant>> {
  const { data } = await apiClient.get<ListResponse<Restaurant>>(
    '/api/resto/best-seller',
    { params }
  );
  return data;
}

export async function getRecommended(params?: {
  page?: number;
  limit?: number;
}): Promise<ListResponse<Restaurant>> {
  const { data } = await apiClient.get<ListResponse<Restaurant>>(
    '/api/resto/recommended',
    { params }
  );
  return data;
}

export async function getNearby(params?: {
  range?: number;
  limit?: number;
}): Promise<ListResponse<Restaurant>> {
  const { data } = await apiClient.get<ListResponse<Restaurant>>(
    '/api/resto/nearby',
    { params }
  );
  return data;
}
