'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

// --- Auth Store Types ---
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: Partial<User>) => void;
  logout: () => void;
  setHasHydrated: (val: boolean) => void;
}

// --- Auth Store ---
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      // --- Hydration Flag ---
      setHasHydrated: (val) => set({ _hasHydrated: val }),

      // --- Set Auth ---
      setAuth: (token, user) => {
        set({ token, user, isAuthenticated: true });
      },

      // --- Update User ---
      setUser: (user) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...user } : (user as User),
        })),

      // --- Logout ---
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'foody_auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
