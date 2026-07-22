import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as reviewApi from '@/lib/api/review';
import type { ReviewPayload } from '@/types';
import { queryKeys } from './keys';

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReviewPayload) => reviewApi.createReview(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.myReviews() });
      qc.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
}

export function useMyReviews() {
  return useQuery({
    queryKey: queryKeys.myReviews(),
    queryFn: reviewApi.getMyReviews,
  });
}
