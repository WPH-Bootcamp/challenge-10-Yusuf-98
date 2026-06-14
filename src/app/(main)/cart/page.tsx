'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import StoreIcon from '@/assets/icons/store.png';
import {
  useCart,
  useUpdateCartItem,
  useDeleteCartItem,
} from '@/lib/query/hooks';
import { useRequireAuth } from '@/hooks/use-auth-guard';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/shared/Skeletons';
import { FadeInStagger, FadeInItem } from '@/components/shared/FadeInStagger';
import CartItemRow from '@/components/shared/CartItemRow';

export default function CartPage() {
  const { isAuthenticated, hasHydrated } = useRequireAuth();
  const { data: cartGroups, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const deleteItem = useDeleteCartItem();
  const [pendingId, setPendingId] = useState<string | null>(null);

  if (!hasHydrated) return null;
  if (!isAuthenticated) return null;

  async function handleUpdate(id: string, qty: number) {
    setPendingId(id);
    if (qty < 1) {
      try {
        await deleteItem.mutateAsync(id);
        toast({ title: 'Item dihapus dari cart', variant: 'success' });
      } catch {
        toast({ title: 'Gagal menghapus item', variant: 'error' });
      } finally {
        setPendingId(null);
      }
      return;
    }
    try {
      await updateItem.mutateAsync({ id, quantity: qty });
    } catch {
      toast({ title: 'Gagal memperbarui cart', variant: 'error' });
    } finally {
      setPendingId(null);
    }
  }

  const placeholder =
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80';

  return (
    <div className='custom-container min-h-screen items-center flex justify-center pt-20 md:pt-22 lg:pt-32'>
      <div className='flex flex-col gap-4 md:gap-8 w-full md:w-114 lg:w-200'>
        <h1 className='text-display-xs md:text-display-md-track font-extrabold text-neutral-950'>
          My Cart
        </h1>
        <div className='mb-10 md:mb-26'>
          {isLoading ? (
            <div className='space-y-4'>
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className='space-y-4 rounded-2xl bg-white p-5 shadow-card'
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
            <FadeInStagger className='space-y-4'>
              {cartGroups.map((group, groupIndex) => {
                const groupTotal = group.items.reduce(
                  (s, i) => s + (i.menu?.price ?? 0) * i.quantity,
                  0
                );
                return (
                  <FadeInItem key={group.restaurant?.id} index={groupIndex}>
                    <div className='rounded-3xl bg-white p-4 shadow-card'>
                      <Link
                        href={`/resto/${group.restaurant?.id}`}
                        className='mb-5 flex items-center gap-1 md:gap-2 text-md md:text-lg font-bold md:font-extrabold text-neutral-950 transition-colors hover-dim'
                      >
                        <Image
                          src={StoreIcon}
                          alt='Store Icon'
                          className='w-8 h-8'
                        />
                        <span>{group.restaurant?.name}</span>
                        <ChevronRight className='h-5 w-5 text-neutral-950' />
                      </Link>

                      <FadeInStagger className='space-y-4'>
                        {group.items.map((item, itemIndex) => (
                          <FadeInItem key={item.id} index={itemIndex}>
                            <CartItemRow
                              item={item}
                              placeholder={placeholder}
                              onUpdate={handleUpdate}
                              isUpdating={pendingId === String(item.id)}
                            />
                          </FadeInItem>
                        ))}
                      </FadeInStagger>

                      <div
                        className='mb-3 mt-3 md:mb-4 md:mt-6 w-full'
                        style={{
                          height: '1px',
                          backgroundImage:
                            'repeating-linear-gradient(to right, var(--color-neutral-300) 0px, var(--color-neutral-300) 4px, transparent 4px, transparent 8px)',
                        }}
                      />

                      <div className='flex flex-col gap-3 md:flex-row items-center md:justify-between'>
                        <div className='w-full flex flex-col items-start'>
                          <p className='h-7 md:h-7.5 text-sm md:text-md md:tracking-tight-3 font-medium text-neutral-950'>
                            Total
                          </p>
                          <p className='h-8 md:h-8.5 text-lg md:text-xl tracking-tight-2 md:tracking-none font-extrabold text-neutral-950'>
                            {formatCurrency(groupTotal)}
                          </p>
                        </div>
                        <Link
                          href={`/checkout?restaurantId=${group.restaurant?.id}`}
                          className='h-11 md:h-12 flex items-center justify-center w-full md:w-88 rounded-full bg-primary-100 p-2 text-sm md:text-md tracking-tight-2 text-center font-bold text-neutral-25 transition-colors hover-dim'
                        >
                          Checkout
                        </Link>
                      </div>
                    </div>
                  </FadeInItem>
                );
              })}
            </FadeInStagger>
          )}
        </div>
      </div>
    </div>
  );
}
