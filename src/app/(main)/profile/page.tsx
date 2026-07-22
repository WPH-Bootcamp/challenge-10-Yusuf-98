'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useProfile, useUpdateProfile } from '@/hooks/queries/profile';
import { useAuthStore } from '@/store/auth.store';
import { useRequireAuth } from '@/hooks/use-auth-guard';
import { useQueryClient } from '@tanstack/react-query';
import JohnDoe48 from '@/assets/images/john-doe-48.png';
import MarkerPin from '@/assets/icons/marker-pin.png';
import FileMyOrder from '@/assets/icons/file-myorder.png';
import LogoutIcon from '@/assets/icons/arrow-circle-broken-left.png';
import XClose from '@/assets/icons/x-close.png';
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { FadeInStagger, FadeInItem } from '@/components/shared/FadeInStagger';

export default function ProfilePage() {
  // --- Auth Guard ---
  const { isAuthenticated, hasHydrated } = useRequireAuth();
  const { user: storeUser, logout, setUser } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();

  // --- Data Fetching ---
  const { data: profileData, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  // --- UI State ---
  const [showModal, setShowModal] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // --- Form ---
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
  });

  // --- Prefill Form from Profile Data ---
  useEffect(() => {
    if (profileData) {
      reset({
        name: profileData.name,
        phone: profileData.phone,
        address: storeUser?.address ?? '',
      });
      setUser(profileData);
    }
  }, [profileData, reset, setUser]);

  // --- Lock Scroll on Modal ---
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  // --- Handlers ---
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function handleLogout() {
    logout();
    qc.clear();
    router.push('/');
  }

  function handleOpenModal() {
    reset({
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      address: user?.address ?? '',
    });
    setShowModal(true);
  }

  async function onSubmit(values: UpdateProfileFormValues) {
    try {
      const updated = await updateProfile.mutateAsync({
        ...values,
        ...(avatarFile ? { avatar: avatarFile } : {}),
      });
      setUser({ ...updated, address: values.address });
      toast({ title: 'Profile updated!', variant: 'success' });
      setShowModal(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch {
      toast({ title: 'Failed to update profile', variant: 'error' });
    }
  }

  if (!hasHydrated) return null;
  if (!isAuthenticated) return null;

  // --- Merged User Data ---
  const user = {
    ...storeUser,
    ...profileData,
    avatar: storeUser?.avatar,
    address: storeUser?.address,
  };

  return (
    <div className='min-h-screen'>
      <div className='custom-container pt-20 md:pt-32 pb-8 md:pb-25'>
        <div className='flex flex-col gap-8 lg:flex-row lg:items-start'>
          {/* --- Sidebar --- */}
          <aside className='hidden shrink-0 lg:block'>
            <div className='w-60 rounded-2xl bg-white p-5 shadow-card'>
              {/* --- User Info --- */}
              <div className='flex items-center gap-2 border-b border-neutral-100 pb-4'>
                <div className='flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-200'>
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name ?? ''}
                      width={48}
                      height={48}
                      className='h-full w-full object-cover rounded-full'
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
                <span className='truncate text-lg font-bold text-neutral-950 tracking-tight-3'>
                  {user?.name}
                </span>
              </div>

              <hr className='border-neutral-200 mt-2 mb-5.5' />

              {/* --- Sidebar Nav --- */}
              <nav className='flex flex-col items-start gap-6'>
                <Link
                  href='/profile'
                  className='flex items-center gap-2 text-md tracking-tight-3 font-medium text-neutral-950 transition-all duration-500 ease-in-out hover-primary'
                >
                  <Image
                    src={MarkerPin}
                    alt='Delivery Address'
                    className='w-6 h-6'
                  />
                  Delivery Address
                </Link>
                <Link
                  href='/orders'
                  className='flex items-center gap-2 text-md tracking-tight-3 font-medium text-neutral-950 transition-all duration-500 ease-in-out hover-primary'
                >
                  <Image
                    src={FileMyOrder}
                    alt='My Orders'
                    className='w-6 h-6'
                  />
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className='flex items-center gap-2 text-md tracking-tight-3 font-medium text-neutral-950 transition-all duration-500 ease-in-out cursor-pointer hover-primary'
                >
                  <Image src={LogoutIcon} alt='Logout' className='w-6 h-6' />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* --- Main Content --- */}
          <div className='w-131 flex flex-col gap-4 md:gap-6'>
            {/* --- Page Title --- */}
            <FadeInItem index={0}>
              <h1 className='text-display-xs md:text-display-md-track font-extrabold text-neutral-950'>
                Profile
              </h1>
            </FadeInItem>

            <FadeInItem index={1}>
              <div className='w-full rounded-2xl bg-white p-5 shadow-card'>
                {/* --- Avatar --- */}
                <div className='flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-neutral-200'>
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
                    <Image
                      src={JohnDoe48}
                      alt='User'
                      className='h-full w-full object-cover'
                    />
                  )}
                </div>

                {/* --- Loading State --- */}
                {isLoading ? (
                  <div className='flex flex-col gap-3 mt-3'>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className='h-10 animate-pulse rounded-xl bg-neutral-100'
                      />
                    ))}
                  </div>
                ) : (
                  <FadeInStagger>
                    {/* --- Profile Fields --- */}
                    {[
                      { label: 'Name', value: user?.name },
                      { label: 'Email', value: user?.email },
                      { label: 'Nomor Handphone', value: user?.phone },
                    ].map(({ label, value }, idx) => (
                      <FadeInItem key={label} index={idx}>
                        <div className='flex items-center justify-between border-b border-neutral-100 pt-3'>
                          <span className='text-sm md:text-md md:tracking-tight-3 font-medium text-neutral-950'>
                            {label}
                          </span>
                          <span className='text-sm md:text-md tracking-tight-2 font-bold text-neutral-950'>
                            {value ?? '—'}
                          </span>
                        </div>
                      </FadeInItem>
                    ))}

                    {/* --- Update Profile Button --- */}
                    <FadeInItem index={3}>
                      <div className='pt-6'>
                        <button
                          type='button'
                          onClick={handleOpenModal}
                          className='h-11 w-full rounded-full bg-primary-100 p-2 text-md tracking-tight-2 font-bold text-neutral-25 transition-all duration-500 ease-in-out hover-dim'
                        >
                          Update Profile
                        </button>
                      </div>
                    </FadeInItem>
                  </FadeInStagger>
                )}
              </div>
            </FadeInItem>
          </div>
        </div>
      </div>

      {/* --- Update Profile Modal --- */}
      {showModal && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
          onClick={() => setShowModal(false)}
        >
          <div
            className='w-full max-w-90.25 md:max-w-109.75 flex flex-col gap-4 md:gap-7 rounded-2xl bg-white p-4 md:p-6'
            onClick={(e) => e.stopPropagation()}
          >
            {/* --- Modal Header --- */}
            <div className='flex items-center justify-between'>
              <h2 className='text-xl md:text-display-xs font-extrabold text-neutral-950'>
                Update Profile
              </h2>
              <button
                type='button'
                onClick={() => setShowModal(false)}
                className='flex h-7 w-7 items-center justify-center transition-all duration-500 ease-in-out hover-dim'
              >
                <Image src={XClose} alt='Close' className='h-5 w-5' />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-4 md:gap-5'
              noValidate
            >
              {/* --- Avatar Upload --- */}
              <div className='flex flex-col items-center gap-3'>
                <div className='flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-neutral-200'>
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt='Preview'
                      width={64}
                      height={64}
                      className='h-full w-full object-cover'
                      unoptimized
                    />
                  ) : user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name ?? ''}
                      width={64}
                      height={64}
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
                <label className='cursor-pointer text-sm font-bold text-primary-100 hover:underline'>
                  Change Profile Image
                  <input
                    type='file'
                    accept='image/*'
                    className='sr-only'
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              {/* --- Form Fields --- */}
              <Input
                {...register('name')}
                placeholder='Name'
                error={errors.name?.message}
              />
              <Input
                {...register('phone')}
                type='tel'
                placeholder='Nomor Handphone'
                error={errors.phone?.message}
              />
              <Input {...register('address')} placeholder='Delivery Address' />

              {/* --- Form Actions --- */}
              <div className='flex gap-3 pt-2'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='h-11 flex-1 rounded-full border border-neutral-300 p-2 text-md tracking-tight-2 font-bold text-neutral-950 transition-all duration-500 ease-in-out hover-dark'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={updateProfile.isPending}
                  className='h-11 flex-1 rounded-full bg-primary-100 p-2 text-md tracking-tight-2 font-bold text-neutral-25 transition-all duration-500 ease-in-out hover-dim disabled:opacity-60'
                >
                  {updateProfile.isPending ? 'Saving...' : 'OK'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
