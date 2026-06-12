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
    <div className='flex min-h-screen w-full justify-center'>
      <div className='flex w-full max-w-360'>
        {/* Left — hero image */}
        <div
          className='hidden md:block md:w-1/2 overflow-hidden'
          style={{ aspectRatio: '720/1024' }}
        >
          <Image
            src={CBP}
            alt='Cheese Burger With Fries'
            width={720}
            height={1024}
            className='w-full h-full object-cover'
            priority
          />
        </div>

        {/* Right — form */}
        <div className='flex w-full md:w-1/2 items-center justify-center bg-white py-16'>
          <div
            className='flex w-full flex-col max-w-93.5'
            style={{
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
