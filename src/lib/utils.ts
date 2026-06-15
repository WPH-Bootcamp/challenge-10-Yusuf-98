import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\s/g, '');
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const datePart = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
  const timePart = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  return `${datePart}, ${timePart}`;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${(km * 1000).toFixed(0)} m`;
  return `${km.toFixed(1)} km`;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    preparing: 'Preparing',
    on_the_way: 'On the Way',
    delivered: 'Delivered',
    done: 'Done',
    canceled: 'Canceled',
  };
  return labels[status] ?? status;
}

export function toRestaurantArray(
  data: unknown
): import('./api/resto').Restaurant[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as import('./api/resto').Restaurant[];
  const d = data as Record<string, unknown>;
  if (Array.isArray(d.data))
    return d.data as import('./api/resto').Restaurant[];
  if (Array.isArray(d.restaurants))
    return d.restaurants as import('./api/resto').Restaurant[];
  if (Array.isArray(d.items))
    return d.items as import('./api/resto').Restaurant[];
  return [];
}

export function getDummyDistance(id: string | number): number {
  const n = typeof id === 'string' ? parseInt(id, 10) : id;
  const safeN = Number.isNaN(n) ? 0 : n;
  const val = (((safeN * 37) % 45) + 5) / 10;
  return Math.round(val * 10) / 10;
}
