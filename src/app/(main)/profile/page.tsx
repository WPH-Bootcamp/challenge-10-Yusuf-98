'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin, ClipboardList, LogOut, User } from 'lucide-react';
import { useProfile, useUpdateProfile } from '@/lib/query/hooks';
import { useAuthStore } from '@/store/auth.store';
import { useRequireAuth } from '@/hooks/use-auth-guard';
import { useQueryClient } from '@tanstack/react-query';
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { isAuthenticated, hasHydrated } = useRequireAuth();
  const { user: storeUser, logout, setUser } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();
  const { data: profileData, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (profileData) {
      reset({ name: profileData.name, phone: profileData.phone });
      setUser(profileData);
    }
  }, [profileData, reset, setUser]);

  function handleLogout() {
    logout();
    qc.clear();
    router.push('/');
  }

  async function onSubmit(values: UpdateProfileFormValues) {
    try {
      const updated = await updateProfile.mutateAsync(values);
      setUser(updated);
      toast({ title: 'Profile updated!', variant: 'success' });
    } catch {
      toast({ title: 'Failed to update profile', variant: 'error' });
    }
  }

  if (!hasHydrated) return null;
  if (!isAuthenticated) return null;

  const user = profileData ?? storeUser;

  return (
    <div className='min-h-screen bg-neutral-50'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-6 lg:flex-row'>
          {/* Sidebar */}
          <aside className='hidden w-64 shrink-0 lg:block'>
            <div className='sticky top-24 rounded-2xl bg-white p-5 shadow-sm'>
              <div className='mb-4 flex items-center gap-3 border-b border-neutral-100 pb-4'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-200'>
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name ?? ''}
                      width={40}
                      height={40}
                      className='h-full w-full object-cover rounded-full'
                      unoptimized
                    />
                  ) : (
                    <User className='h-5 w-5 text-neutral-500' />
                  )}
                </div>
                <span className='truncate font-bold text-neutral-900'>
                  {user?.name}
                </span>
              </div>
              <nav className='space-y-0.5'>
                <Link
                  href='/profile'
                  className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50'
                >
                  <MapPin className='h-4 w-4 shrink-0 text-neutral-400' />
                  Delivery Address
                </Link>
                <Link
                  href='/orders'
                  className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50'
                >
                  <ClipboardList className='h-4 w-4 shrink-0 text-neutral-400' />
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50'
                >
                  <LogOut className='h-4 w-4 shrink-0 text-neutral-400' />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main */}
          <div className='flex-1'>
            <h1 className='mb-6 text-2xl font-bold text-neutral-900'>
              Profile
            </h1>
            <div className='w-full max-w-lg rounded-2xl bg-white p-6 shadow-sm'>
              {/* Avatar */}
              <div className='mb-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-neutral-200 ring-2 ring-neutral-100'>
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name ?? ''}
                    width={64}
                    height={64}
                    className='h-full w-full object-cover'
                    unoptimized
                  />
                ) : (
                  <User className='h-8 w-8 text-neutral-400' />
                )}
              </div>

              {isLoading ? (
                <div className='space-y-4'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className='h-10 animate-pulse rounded-xl bg-neutral-100'
                    />
                  ))}
                </div>
              ) : (
                <>
                  {/* Read-only info */}
                  <div className='mb-6 space-y-3'>
                    {[
                      { label: 'Name', value: user?.name },
                      { label: 'Email', value: user?.email },
                      { label: 'Nomor Handphone', value: user?.phone },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className='flex items-center justify-between border-b border-neutral-100 pb-3'
                      >
                        <span className='text-sm text-neutral-500'>
                          {label}
                        </span>
                        <span className='text-sm font-semibold text-neutral-900'>
                          {value ?? '—'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Edit form */}
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='space-y-4'
                    noValidate
                  >
                    <Input
                      {...register('name')}
                      placeholder='Name'
                      error={errors.name?.message}
                    />
                    <Input
                      {...register('phone')}
                      type='tel'
                      placeholder='Phone number'
                      error={errors.phone?.message}
                    />
                    <Button
                      type='submit'
                      size='lg'
                      loading={updateProfile.isPending}
                      className='w-full'
                    >
                      Update Profile
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
