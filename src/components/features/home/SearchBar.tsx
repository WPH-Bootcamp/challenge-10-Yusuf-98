'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SearchIcon from '@/assets/icons/search.png';
import { useHomeSearch } from './HomeSearchProvider';

// --- Search Bar ---
export function SearchBar() {
  const router = useRouter();
  const { query, setQuery } = useHomeSearch();

  // --- Submit Handler ---
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/category?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className='relative flex gap-6 mx-auto max-w-151 w-full h-12 md:h-14 items-center'
    >
      <Image
        src={SearchIcon}
        alt='Search'
        width={20}
        height={20}
        className='absolute left-4 md:left-6 top-1/2 -translate-y-1/2'
      />
      <input
        type='search'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search restaurants, food and drink'
        className='w-full h-full rounded-full bg-white py-2 pl-10.5 md:pl-12.5 pr-4 md:pr-6 text-sm md:text-md text-neutral-950 tracking-tight-2 placeholder:text-neutral-600 focus:outline-none'
      />
    </form>
  );
}
