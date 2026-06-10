'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CBP from '@/assets/images/image-8.png';
import LogoColor from '@/assets/images/logo-color.png';
import { LoginForm } from '@/components/features/auth/LoginForm';
import { RegisterForm } from '@/components/features/auth/RegisterForm';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';

function RegisterContent() {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup');

  useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      router.replace('/');
    }
  }, [_hasHydrated, isAuthenticated, router]);

  if (!_hasHydrated) return null;
  if (isAuthenticated) return null;

  return (
    <div className='flex min-h-screen w-full'>
      {/* Left — hero image */}
      <div className='relative hidden w-1/2 md:block'>
        <Image
          src={CBP}
          alt='Cheese Burger With Fries'
          fill
          className='object-cover'
          priority
        />
      </div>

      {/* Right — form */}
      <div
        className='flex w-full items-start justify-center md:w-1/2'
        style={{ paddingTop: 'clamp(204px, 6.471vw + 178.569px, 272px)' }}
      >
        <div
          className='flex w-full flex-col px-6'
          style={{
            maxWidth: 'clamp(345px, 2.787vw + 334.051px, 374px)',
            gap: 'clamp(16px, 1.569vw + 9.804px, 20px)',
          }}
        >
          {/* Logo */}
          <Link href='/'>
            <Image
              src={LogoColor}
              alt='Foody'
              className='w-auto object-contain'
              style={{ height: 'clamp(32px, 2.923vw + 20.518px, 42px)' }}
            />
          </Link>

          {/* Title */}
          <div className='flex flex-col gap-1'>
            <h1 className='text-display-sm font-extrabold text-neutral-950'>
              Welcome Back
            </h1>
            <p
              className='text-md font-medium text-neutral-950'
              style={{ letterSpacing: '-0.03em' }}
            >
              Good to see you again! Let&apos;s eat
            </p>
          </div>

          {/* Tab switcher */}
          <div className='flex rounded-2xl bg-neutral-100 p-1 gap-1'>
            <Button
              type='button'
              variant={activeTab === 'signin' ? 'outline' : 'ghost'}
              size='sm'
              onClick={() => setActiveTab('signin')}
              className='flex-1'
            >
              Sign in
            </Button>
            <Button
              type='button'
              variant={activeTab === 'signup' ? 'outline' : 'ghost'}
              size='sm'
              onClick={() => setActiveTab('signup')}
              className='flex-1'
            >
              Sign up
            </Button>
          </div>

          {/* Form */}
          {activeTab === 'signin' ? (
            <LoginForm onSwitchTab={() => setActiveTab('signup')} />
          ) : (
            <RegisterForm onSwitchTab={() => setActiveTab('signin')} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  );
}
