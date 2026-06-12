'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useCart } from '@/lib/query/hooks';
import { useQueryClient } from '@tanstack/react-query';
import Logo from '@/assets/images/logo.png';
import LogoColor from '@/assets/images/logo-color.png';
import IconLogo from '@/assets/images/icon-logo.png';
import IconLogoColor from '@/assets/images/icon-logo-color.png';
import JohnDoe36 from '@/assets/images/john-doe-36.png';
import JohnDoe48 from '@/assets/images/john-doe-48.png';
import MarkerPin from '@/assets/icons/marker-pin.png';
import FileMyOrder from '@/assets/icons/file-myorder.png';
import LogoutIcon from '@/assets/icons/arrow-circle-broken-left.png';
import BagWhite from '@/assets/icons/bag-white.png';
import BagBlack from '@/assets/icons/bag-black.png';

export function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { data: cartGroups } = useCart();
  const qc = useQueryClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalCartItems =
    cartGroups?.reduce(
      (sum, g) => sum + g.items.reduce((s, i) => s + i.quantity, 0),
      0
    ) ?? 0;

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    qc.clear();
    setDropdownOpen(false);
    router.push('/');
  }

  return (
    <header
      className='fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300'
      style={{
        backgroundColor: scrolled ? 'var(--color-white)' : 'transparent',
        boxShadow: scrolled ? '0px 0px 20px rgba(203, 202, 202, 0.25)' : 'none',
      }}
    >
      <div className='mx-auto flex h-16 w-full max-w-360 items-center justify-between px-4 md:h-20 md:px-30'>
        {/* Logo */}
        <Link href='/'>
          <Image
            src={scrolled ? IconLogoColor : IconLogo}
            alt='Foody'
            className='block w-auto h-10 md:h-10.5 md:hidden'
            priority
          />
          <Image
            src={scrolled ? LogoColor : Logo}
            alt='Foody'
            className='hidden w-auto h-10 md:h-10.5 md:block'
            priority
          />
        </Link>

        {/* Right */}
        <div className='flex items-center gap-4 md:gap-6'>
          {isAuthenticated ? (
            <>
              {/* Cart */}
              <Link
                href='/cart'
                aria-label='Cart'
                className='relative flex h-7 w-7 md:h-10 md:w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10'
              >
                <Image
                  src={scrolled ? BagBlack : BagWhite}
                  alt='Cart'
                  className='w-full h-full transition-all duration-300'
                />
                {totalCartItems > 0 && (
                  <span className='absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5 items-center justify-center rounded-full bg-primary-100 text-[12px] font-bold text-white'>
                    {totalCartItems > 99 ? '99+' : totalCartItems}
                  </span>
                )}
              </Link>

              {/* User dropdown */}
              <div className='relative' ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className='flex items-center gap-4 rounded-full transition-colors cursor-pointer hover:bg-white/10'
                  aria-expanded={dropdownOpen}
                >
                  {/* Avatar */}
                  <div className='h-auto w-10 md:w-12 overflow-hidden rounded-full'>
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name ?? 'User'}
                        className='h-full w-full object-cover'
                        unoptimized
                      />
                    ) : (
                      <Image
                        src={JohnDoe36}
                        alt='User'
                        className='h-full w-full object-cover'
                      />
                    )}
                  </div>
                  {/* Name — desktop only */}
                  <span
                    className='hidden max-w-30 truncate text-lg font-semibold transition-colors duration-300 md:block'
                    style={{
                      color: scrolled
                        ? 'var(--color-neutral-950)'
                        : 'var(--color-white)',
                    }}
                  >
                    {user?.name}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className='absolute right-0 mt-3 md:mt-4 p-4 w-49.25 overflow-hidden rounded-2xl bg-white shadow-2xl'>
                    {/* Dropdown header */}
                    <div className='flex items-center gap-2'>
                      <div className='h-auto w-9 md:w-10 shrink-0 overflow-hidden rounded-full'>
                        {user?.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name ?? ''}
                            className='h-full w-full object-cover'
                            unoptimized
                          />
                        ) : (
                          <Image
                            src={JohnDoe48}
                            alt='User'
                            className='h-full w-full object-cover'
                          />
                        )}
                      </div>
                      <span className='truncate text-md font-bold text-neutral-950 tracking-tight-2'>
                        {user?.name}
                      </span>
                    </div>
                    <hr className='border-neutral-200 mt-3 mb-4' />
                    {/* Dropdown menu items */}
                    <div className='flex flex-col items-start gap-5'>
                      <Link
                        href='/profile'
                        onClick={() => setDropdownOpen(false)}
                        className='flex items-center gap-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-500'
                      >
                        <Image
                          src={MarkerPin}
                          alt='Delivery Address'
                          className='w-5 h-5'
                        />
                        Delivery Address
                      </Link>
                      <Link
                        href='/orders'
                        onClick={() => setDropdownOpen(false)}
                        className='flex items-center gap-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-500'
                      >
                        <Image
                          src={FileMyOrder}
                          alt='My Orders'
                          className='w-5 h-5'
                        />
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className='flex w-full items-center gap-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-500'
                      >
                        <Image
                          src={LogoutIcon}
                          alt='Logout'
                          className='w-5 h-5'
                        />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className='flex items-center gap-3 md:gap-4'>
              <Link
                href='/login'
                className={`flex items-center justify-center h-10 md:h-12 w-30 md:w-40.75 bg-transparent rounded-full border-2 p-2 text-sm md:text-md tracking-tight-2 font-bold text-center transition-all duration-300 md:px-5 ${scrolled ? 'hover-dark' : 'hover-light'}`}
                style={{
                  borderColor: scrolled
                    ? 'var(--color-neutral-300)'
                    : 'var(--color-white)',
                  color: scrolled
                    ? 'var(--color-neutral-700)'
                    : 'var(--color-white)',
                }}
              >
                Sign In
              </Link>
              <Link
                href='/register'
                className='flex items-center justify-center h-10 md:h-12 w-30 md:w-40.75 rounded-full p-2 gap-2 text-sm md:text-md tracking-tight-2 font-bold text-center transition-all duration-300 md:px-5 hover-dim'
                style={{
                  backgroundColor: scrolled
                    ? 'var(--color-primary-100)'
                    : 'var(--color-white)',
                  color: scrolled
                    ? 'var(--color-white)'
                    : 'var(--color-neutral-950)',
                }}
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
