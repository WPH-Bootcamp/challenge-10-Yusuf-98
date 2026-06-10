import apiClient from './axios';
import type { Review, ReviewPayload } from '@/types';

export async function createReview(payload: ReviewPayload): Promise<Review> {
  const { data } = await apiClient.post('/api/review', payload);
  return (data as { data: Review }).data ?? (data as Review);
}

export async function getMyReviews(): Promise<Review[]> {
  const { data } = await apiClient.get('/api/review/my-reviews');
  if (Array.isArray(data)) return data as Review[];
  const d = data as Record<string, unknown>;
  if (Array.isArray(d.data)) return d.data as Review[];
  return [];
}

export async function getRestaurantReviews(
  restaurantId: string
): Promise<Review[]> {
  const { data } = await apiClient.get(
    `/api/review/restaurant/${restaurantId}`
  );
  if (Array.isArray(data)) return data as Review[];
  const d = data as Record<string, unknown>;
  if (Array.isArray(d.data)) return d.data as Review[];
  return [];
}
