'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, ChevronRight, ShoppingBag } from 'lucide-react';
import {
  useCart,
  useUpdateCartItem,
  useDeleteCartItem,
} from '@/lib/query/hooks';
import { useRequireAuth } from '@/hooks/use-auth-guard';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/shared/Skeletons';
import type { CartItem } from '@/types';

export default function CartPage() {
  const { isAuthenticated, hasHydrated } = useRequireAuth();
  const { data: cartGroups, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const deleteItem = useDeleteCartItem();

  if (!hasHydrated) return null;
  if (!isAuthenticated) return null;

  async function handleUpdate(id: string, qty: number) {
    if (qty < 1) {
      try {
        await deleteItem.mutateAsync(id);
        toast({ title: 'Item dihapus dari cart', variant: 'success' });
      } catch {
        toast({ title: 'Gagal menghapus item', variant: 'error' });
      }
      return;
    }
    try {
      await updateItem.mutateAsync({ id, quantity: qty });
    } catch {
      toast({ title: 'Gagal memperbarui cart', variant: 'error' });
    }
  }

  const isMutating = updateItem.isPending || deleteItem.isPending;
  const placeholder =
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80';

  return (
    <div className='min-h-screen bg-neutral-50'>
      <div className='mx-auto max-w-3xl px-4 py-8 sm:px-6'>
        <h1 className='mb-6 text-2xl font-bold text-neutral-900'>My Cart</h1>

        {isLoading ? (
          <div className='space-y-4'>
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className='space-y-4 rounded-2xl bg-white p-5 shadow-sm'
              >
                <Skeleton className='h-5 w-32 rounded' />
                <Skeleton className='h-16 w-full rounded-xl' />
                <Skeleton className='h-16 w-full rounded-xl' />
              </div>
            ))}
          </div>
        ) : !cartGroups || cartGroups.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <div className='mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100'>
              <ShoppingBag className='h-12 w-12 text-neutral-300' />
            </div>
            <p className='text-lg font-bold text-neutral-700'>
              Your cart is empty
            </p>
            <p className='mt-1 text-sm text-neutral-500'>
              Add your favourite food first!
            </p>
            <Link
              href='/'
              className='mt-6 rounded-full bg-primary-100 px-7 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover'
            >
              Find Restaurants
            </Link>
          </div>
        ) : (
          <div className='space-y-4'>
            {cartGroups.map((group) => {
              const groupTotal = group.items.reduce(
                (s, i) => s + (i.menu?.price ?? 0) * i.quantity,
                0
              );
              return (
                <div
                  key={group.restaurant?.id}
                  className='rounded-2xl bg-white p-5 shadow-sm'
                >
                  <Link
                    href={`/resto/${group.restaurant?.id}`}
                    className='mb-5 flex items-center gap-2 font-bold text-neutral-900 transition-colors hover:text-primary-100'
                  >
                    <span className='text-lg'>🛍️</span>
                    <span>{group.restaurant?.name}</span>
                    <ChevronRight className='ml-auto h-4 w-4 text-neutral-400' />
                  </Link>

                  <div className='space-y-4'>
                    {group.items.map((item) => (
                      <CartItemRow
                        key={item.id}
                        item={item}
                        placeholder={placeholder}
                        onUpdate={handleUpdate}
                        isUpdating={isMutating}
                      />
                    ))}
                  </div>

                  <hr className='my-4 border-dashed border-neutral-200' />

                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-xs text-neutral-500'>Total</p>
                      <p className='text-xl font-extrabold text-neutral-900'>
                        {formatCurrency(groupTotal)}
                      </p>
                    </div>
                    <Link
                      href={`/checkout?restaurantId=${group.restaurant?.id}`}
                      className='rounded-full bg-primary-100 px-7 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-hover'
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CartItemRow({
  item,
  placeholder,
  onUpdate,
  isUpdating,
}: {
  item: CartItem;
  placeholder: string;
  onUpdate: (id: string, qty: number) => void;
  isUpdating: boolean;
}) {
  return (
    <div className='flex items-center gap-3'>
      <div className='relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-xl bg-neutral-100'>
        <Image
          src={item.menu?.image ?? placeholder}
          alt={item.menu?.name ?? 'Food'}
          fill
          className='object-cover'
          unoptimized
        />
      </div>
      <div className='min-w-0 flex-1'>
        <p className='line-clamp-1 text-sm font-semibold text-neutral-900'>
          {item.menu?.name}
        </p>
        <p className='text-sm font-medium text-neutral-600'>
          {formatCurrency(item.menu?.price ?? 0)}
        </p>
      </div>
      <div className='flex shrink-0 items-center gap-2'>
        <button
          onClick={() => onUpdate(item.id, item.quantity - 1)}
          disabled={isUpdating}
          className='flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-400 disabled:opacity-50'
        >
          <Minus className='h-3.5 w-3.5' />
        </button>
        <span className='w-5 text-center text-sm font-bold'>
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdate(item.id, item.quantity + 1)}
          disabled={isUpdating}
          className='flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-white transition-colors hover:bg-primary-hover disabled:opacity-50'
        >
          <Plus className='h-3.5 w-3.5' />
        </button>
      </div>
    </div>
  );
}
