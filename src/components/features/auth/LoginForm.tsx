'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '@/lib/validations';
import { login } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import type { AuthResponse } from '@/types';

interface LoginFormProps {
  onSwitchTab: () => void;
}

export function LoginForm({}: LoginFormProps) {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const res: AuthResponse = await login({
        email: values.email,
        password: values.password,
      });
      const token = res.data?.token ?? res.token ?? res.access_token ?? '';
      const user = res.data?.user ?? res.user;
      if (!token || !user) throw new Error('Invalid response');
      setAuth(token, user);
      toast({ title: 'Login berhasil!', variant: 'success' });
      router.push('/');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Email atau password salah.';
      toast({ title: 'Login gagal', description: msg, variant: 'error' });
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
        {...register('email')}
        type='email'
        placeholder='Email'
        error={errors.email?.message}
        autoComplete='email'
      />
      <Input
        {...register('password')}
        type={showPassword ? 'text' : 'password'}
        placeholder='Password'
        error={errors.password?.message}
        autoComplete='current-password'
        rightIcon={
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='text-neutral-950'
            tabIndex={-1}
          >
            {showPassword ? (
              <Eye className='h-4 w-4' />
            ) : (
              <EyeOff className='h-4 w-4' />
            )}
          </button>
        }
      />
      <label className='flex cursor-pointer items-center gap-2'>
        <input
          {...register('rememberMe')}
          type='checkbox'
          className='h-5 w-5 appearance-none rounded-sm border-2 border-neutral-300 bg-white checked:border-none checked:bg-primary-100 checked:text-white checked:bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27white%27%20stroke-width%3D%274%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpolyline%20points%3D%2720%206%209%2017%204%2012%27%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")] bg-center bg-no-repeat bg-size-[1rem] focus:ring-red-500 focus:ring-offset-0'
        />
        <span className='text-sm md:text-md md:tracking-tight-3 font-medium text-neutral-950'>
          Remember Me
        </span>
      </label>
      <Button
        type='submit'
        size='default'
        loading={isLoading}
        className='w-full'
      >
        Login
      </Button>
    </form>
  );
}
