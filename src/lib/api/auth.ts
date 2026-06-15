import apiClient from './axios';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from '@/types';

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    '/api/auth/login',
    payload
  );
  return data;
}

export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    '/api/auth/register',
    payload
  );
  return data;
}

export async function getProfile(): Promise<User> {
  const { data } = await apiClient.get('/api/auth/profile');
  return (data as { data: User }).data ?? (data as User);
}

export async function updateProfile(
  payload: Partial<Pick<User, 'name' | 'phone'>> & {
    avatar?: File;
    address?: string;
  }
): Promise<User> {
  const formData = new FormData();
  if (payload.name) formData.append('name', payload.name);
  if (payload.phone) formData.append('phone', payload.phone);
  if (payload.avatar) formData.append('avatar', payload.avatar);

  const { data } = await apiClient.put('/api/auth/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return (data as { data: User }).data ?? (data as User);
}
