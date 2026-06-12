'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, ClipboardList, LogOut, User } from 'lucide-react';
import { useMyOrders, useCreateReview } from '@/lib/query/hooks';
import { useRequireAuth } from '@/hooks/use-auth-guard';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { formatCurrency } from '@/lib/utils';
import { StarRating } from '@/components/shared/StarRating';
import { toast } from '@/hooks/use-toast';
import type { OrderStatus, Order } from '@/types';

const STATUS_TABS: { label: string; value: OrderStatus }[] = [
  { label: 'Preparing', value: 'preparing' },
  { label: 'On the Way', value: 'on_the_way' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Done', value: 'done' },
  { label: 'Canceled', value: 'canceled' },
];

export default function OrdersPage() {
  const { isAuthenticated, hasHydrated } = useRequireAuth();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('preparing');
  const [search, setSearch] = useState('');
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [reviewStar, setReviewStar] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const createReview = useCreateReview();

  const { data: orders, isLoading } = useMyOrders({ status: activeStatus });

  const filtered = search
    ? (orders ?? []).filter((o) =>
        o.restaurants?.some((r) =>
          r.restaurant?.name?.toLowerCase().includes(search.toLowerCase())
        )
      )
    : (orders ?? []);

  function handleLogout() {
    logout();
    qc.clear();
    router.push('/');
  }

  async function handleSubmitReview() {
    if (!reviewOrder) return;
    if (reviewStar === 0) {
      toast({ title: 'Please select a rating', variant: 'error' });
      return;
    }
    if (reviewComment.length < 10) {
      toast({
        title: 'Comment must be at least 10 characters',
        variant: 'error',
      });
      return;
    }
    try {
      const firstRestaurant = reviewOrder.restaurants?.[0];
      await createReview.mutateAsync({
        transactionId: String(reviewOrder.transactionId ?? reviewOrder.id),
        restaurantId: Number(firstRestaurant?.restaurant?.id ?? 0),
        star: reviewStar,
        comment: reviewComment,
      });
      toast({ title: 'Review submitted!', variant: 'success' });
      setReviewOrder(null);
      setReviewStar(0);
      setReviewComment('');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to submit review';
      toast({
        title: 'Failed to submit review',
        description: msg,
        variant: 'error',
      });
    }
  }

  if (!hasHydrated) return null;
  if (!isAuthenticated) return null;

  const placeholder =
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80';

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
                  className='flex items-center gap-3 rounded-xl bg-primary-light px-3 py-2.5 text-sm font-bold text-primary-100'
                >
                  <ClipboardList className='h-4 w-4 shrink-0' />
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
          <div className='min-w-0 flex-1'>
            <h1 className='mb-6 text-2xl font-bold text-neutral-900'>
              My Orders
            </h1>

            {/* Search */}
            <div className='relative mb-4'>
              <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400' />
              <input
                type='search'
                placeholder='Search restaurant'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-11 pr-4 text-sm shadow-sm focus:border-primary-100 focus:outline-none focus:ring-1 focus:ring-primary-100/15'
              />
            </div>

            {/* Status tabs */}
            <div className='mb-5 flex items-center gap-2 overflow-x-auto pb-1'>
              <span className='mr-1 shrink-0 text-sm font-semibold text-neutral-500'>
                Status
              </span>
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveStatus(tab.value)}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                    activeStatus === tab.value
                      ? 'border-primary-100 bg-primary-100 text-white shadow-sm'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders */}
            <div className='overflow-hidden rounded-2xl bg-white shadow-sm'>
              {isLoading ? (
                <div className='space-y-4 p-5'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className='h-24 animate-pulse rounded-xl bg-neutral-100'
                    />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-20 text-center'>
                  <span className='mb-3 text-5xl'>📋</span>
                  <p className='text-base font-bold text-neutral-700'>
                    No orders found
                  </p>
                  <p className='mt-1 text-sm text-neutral-500'>
                    Your orders will appear here
                  </p>
                </div>
              ) : (
                <div className='divide-y divide-neutral-100'>
                  {filtered.map((order) => (
                    <div key={order.id} className='p-5'>
                      {/* Restaurants in this order */}
                      {order.restaurants?.map((group, gi) => (
                        <div key={gi} className='mb-4'>
                          <div className='mb-3 flex items-center gap-2'>
                            <span className='text-lg'>🛍️</span>
                            <span className='font-bold text-neutral-900'>
                              {group.restaurant?.name}
                            </span>
                          </div>
                          {group.items?.slice(0, 2).map((item, ii) => (
                            <div
                              key={ii}
                              className='mb-3 flex items-center gap-3'
                            >
                              <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100'>
                                <Image
                                  src={item.image ?? placeholder}
                                  alt={item.menuName ?? 'Food'}
                                  fill
                                  sizes='56px'
                                  className='object-cover'
                                  unoptimized
                                />
                              </div>
                              <div>
                                <p className='text-sm font-semibold text-neutral-900'>
                                  {item.menuName}
                                </p>
                                <p className='text-sm text-neutral-500'>
                                  {item.quantity} x{' '}
                                  {formatCurrency(item.price ?? 0)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}

                      <hr className='my-3 border-dashed border-neutral-200' />

                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-xs text-neutral-500'>Total</p>
                          <p className='text-lg font-extrabold text-neutral-900'>
                            {formatCurrency(
                              order.pricing?.totalPrice ?? order.total ?? 0
                            )}
                          </p>
                        </div>
                        {activeStatus === 'done' && (
                          <button
                            onClick={() => {
                              setReviewOrder(order);
                              setReviewStar(0);
                              setReviewComment('');
                            }}
                            className='rounded-full bg-primary-100 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-hover'
                          >
                            Give Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewOrder && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'
          onClick={() => setReviewOrder(null)}
        >
          <div
            className='w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='mb-5 flex items-center justify-between'>
              <h2 className='text-lg font-bold text-neutral-900'>
                Give Review
              </h2>
              <button
                onClick={() => setReviewOrder(null)}
                className='flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600'
              >
                ✕
              </button>
            </div>
            <div className='mb-5 text-center'>
              <p className='mb-3 text-sm font-semibold text-neutral-700'>
                Give Rating
              </p>
              <div className='flex justify-center'>
                <StarRating
                  value={reviewStar}
                  onChange={setReviewStar}
                  size='lg'
                />
              </div>
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder='Please share your thoughts about our service!'
              rows={6}
              className='w-full resize-none rounded-xl border border-neutral-200 p-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-100 focus:outline-none focus:ring-1 focus:ring-primary-100/15'
            />
            <button
              onClick={handleSubmitReview}
              disabled={createReview.isPending}
              className='mt-4 w-full rounded-full bg-primary-100 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-60'
            >
              {createReview.isPending ? 'Submitting...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
