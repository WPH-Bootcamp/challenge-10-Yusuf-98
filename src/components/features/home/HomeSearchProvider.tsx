'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

// --- Home Search Context ---
interface HomeSearchContextValue {
  query: string;
  setQuery: (value: string) => void;
}

const HomeSearchContext = createContext<HomeSearchContextValue | null>(null);

// --- Provider ---
export function HomeSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  return (
    <HomeSearchContext.Provider value={{ query, setQuery }}>
      {children}
    </HomeSearchContext.Provider>
  );
}

// --- Hook ---
export function useHomeSearch() {
  const ctx = useContext(HomeSearchContext);
  if (!ctx) {
    throw new Error('useHomeSearch must be used within HomeSearchProvider');
  }
  return ctx;
}
