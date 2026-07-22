import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import * as authApi from '@/lib/api/auth';
import { queryKeys } from './keys';

export function useProfile() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: queryKeys.profile(),
    queryFn: authApi.getProfile,
    staleTime: 1000 * 60 * 10,
    enabled: isAuthenticated,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.profile() }),
  });
}
