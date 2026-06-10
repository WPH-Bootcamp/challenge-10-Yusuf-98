'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { registerSchema, type RegisterFormValues } from '@/lib/validations';
import { register as registerUser } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import type { AuthResponse } from '@/types';

interface RegisterFormProps {
  onSwitchTab: () => void;
}

export function RegisterForm({}: RegisterFormProps) {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    try {
      const res: AuthResponse = await registerUser({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      const token = res.data?.token ?? res.token ?? res.access_token ?? '';
      const user = res.data?.user ?? res.user;
      if (!token || !user) throw new Error('Invalid response');
      setAuth(token, user);
      toast({ title: 'Registrasi berhasil!', variant: 'success' });
      router.push('/');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Registrasi gagal. Coba lagi.';
      toast({ title: 'Registrasi gagal', description: msg, variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-4 md:gap-5'
      noValidate
    >
      <Input
        {...register('name')}
        placeholder='Name'
        error={errors.name?.message}
        autoComplete='name'
      />
      <Input
        {...register('email')}
        type='email'
        placeholder='Email'
        error={errors.email?.message}
        autoComplete='email'
      />
      <Input
        {...register('phone')}
        type='tel'
        placeholder='Number Phone'
        error={errors.phone?.message}
        autoComplete='tel'
      />
      <Input
        {...register('password')}
        type={showPassword ? 'text' : 'password'}
        placeholder='Password'
        error={errors.password?.message}
        autoComplete='new-password'
        rightIcon={
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='text-neutral-950'
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </button>
        }
      />
      <Input
        {...register('confirmPassword')}
        type={showConfirm ? 'text' : 'password'}
        placeholder='Confirm Password'
        error={errors.confirmPassword?.message}
        autoComplete='new-password'
        rightIcon={
          <button
            type='button'
            onClick={() => setShowConfirm(!showConfirm)}
            className='text-neutral-950'
            tabIndex={-1}
          >
            {showConfirm ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </button>
        }
      />
      <Button
        type='submit'
        size='default'
        loading={isLoading}
        className='w-full'
      >
        Register
      </Button>
    </form>
  );
}
