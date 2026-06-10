'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [_hasHydrated, isAuthenticated, router, redirectTo]);

  return { isAuthenticated, hasHydrated: _hasHydrated };
}
