'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, User, MapPin, ClipboardList, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCart } from '@/lib/query/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { data: cartGroups } = useCart();
  const queryClient = useQueryClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalCartItems =
    cartGroups?.reduce(
      (sum, g) => sum + g.items.reduce((s, i) => s + i.quantity, 0),
      0
    ) ?? 0;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleLogout() {
    logout();
    queryClient.clear();
    setDropdownOpen(false);
    router.push('/');
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b border-[#F5F5F5] bg-white/95 backdrop-blur-sm'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <span className='text-2xl leading-none'>✳️</span>
          <span className='text-xl font-extrabold tracking-tight text-[#1B1D27]'>
            Foody
          </span>
        </Link>

        {/* Right */}
        <div className='flex items-center gap-2'>
          {isAuthenticated ? (
            <>
              {/* Cart icon */}
              <Link
                href='/cart'
                aria-label={`Cart (${totalCartItems} items)`}
                className='relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#F5F5F5]'
              >
                <ShoppingBag className='h-5 w-5 text-[#414651]' />
                {totalCartItems > 0 && (
                  <span className='absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#C12116] text-[10px] font-bold text-white leading-none'>
                    {totalCartItems > 99 ? '99+' : totalCartItems}
                  </span>
                )}
              </Link>

              {/* User dropdown */}
              <div className='relative' ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className='flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-[#F5F5F5]'
                  aria-expanded={dropdownOpen}
                  aria-haspopup='true'
                >
                  <div className='flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#E9EAEB] ring-2 ring-[#F5F5F5]'>
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name ?? 'User'}
                        width={32}
                        height={32}
                        className='h-full w-full object-cover'
                      />
                    ) : (
                      <User className='h-4 w-4 text-[#535862]' />
                    )}
                  </div>
                  <span className='hidden text-sm font-semibold text-[#252837] sm:block max-w-[120px] truncate'>
                    {user?.name}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className='absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-[#F5F5F5] bg-white shadow-2xl'>
                    {/* Header */}
                    <div className='flex items-center gap-3 border-b border-[#F5F5F5] px-4 py-3'>
                      <div className='flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E9EAEB]'>
                        {user?.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name ?? ''}
                            width={40}
                            height={40}
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <User className='h-5 w-5 text-[#535862]' />
                        )}
                      </div>
                      <span className='text-sm font-bold text-[#1B1D27] truncate'>
                        {user?.name}
                      </span>
                    </div>
                    {/* Menu items */}
                    <div className='p-1.5'>
                      <Link
                        href='/profile'
                        onClick={() => setDropdownOpen(false)}
                        className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#414651] transition-colors hover:bg-[#FAFAFA]'
                      >
                        <MapPin className='h-4 w-4 text-[#535862]' /> Delivery
                        Address
                      </Link>
                      <Link
                        href='/orders'
                        onClick={() => setDropdownOpen(false)}
                        className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#C12116] transition-colors hover:bg-[#fef2f2]'
                      >
                        <ClipboardList className='h-4 w-4' /> My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#414651] transition-colors hover:bg-[#FAFAFA]'
                      >
                        <LogOut className='h-4 w-4 text-[#535862]' /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className='flex items-center gap-2'>
              <Link
                href='/login'
                className='rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-[#414651] transition-colors hover:bg-[#FAFAFA]'
              >
                Sign In
              </Link>
              <Link
                href='/register'
                className='rounded-full bg-[#C12116] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a61e14] shadow-sm'
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
