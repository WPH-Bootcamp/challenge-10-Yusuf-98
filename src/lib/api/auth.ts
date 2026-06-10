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
  payload: Partial<Pick<User, 'name' | 'phone'>>
): Promise<User> {
  const { data } = await apiClient.get('/api/auth/profile');
  return (data as { data: User }).data ?? (data as User);
}
