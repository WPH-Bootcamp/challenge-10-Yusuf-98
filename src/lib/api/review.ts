import apiClient from './axios';
import type { Review, ReviewPayload } from '@/types';

export async function createReview(payload: ReviewPayload): Promise<Review> {
  const { data } = await apiClient.post<{ data: Review } | Review>(
    '/api/review',
    payload
  );
  return (data as { data: Review }).data ?? (data as Review);
}

export async function getMyReviews(): Promise<Review[]> {
  const { data } = await apiClient.get<{ data: Review[] } | Review[]>(
    '/api/review/my-reviews'
  );
  return (data as { data: Review[] }).data ?? (data as Review[]);
}

export async function getRestaurantReviews(
  restaurantId: string
): Promise<Review[]> {
  const { data } = await apiClient.get<{ data: Review[] } | Review[]>(
    `/api/review/restaurant/${restaurantId}`
  );
  return (data as { data: Review[] }).data ?? (data as Review[]);
}

export async function updateReview(
  id: string,
  payload: Partial<ReviewPayload>
): Promise<Review> {
  const { data } = await apiClient.put<{ data: Review } | Review>(
    `/api/review/${id}`,
    payload
  );
  return (data as { data: Review }).data ?? (data as Review);
}

export async function deleteReview(id: string): Promise<void> {
  await apiClient.delete(`/api/review/${id}`);
}
