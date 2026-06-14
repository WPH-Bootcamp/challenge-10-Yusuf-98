'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import JohnDoe48 from '@/assets/images/john-doe-48.png';
import MarkerPin from '@/assets/icons/marker-pin.png';
import FileMyOrder from '@/assets/icons/file-myorder.png';
import LogoutIcon from '@/assets/icons/arrow-circle-broken-left.png';
import Search from '@/assets/icons/search.png';
import StoreIcon from '@/assets/icons/store.png';
import XClose from '@/assets/icons/x-close.png';
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
    <div className='min-h-screen'>
      <div className='custom-container pt-20 md:pt-32 pb-8 md:pb-25'>
        <div className='flex flex-col gap-8 lg:flex-row'>
          {/* Sidebar */}
          <aside className='hidden shrink-0 lg:flex'>
            <div className='sticky w-60 top-24 rounded-2xl bg-white p-5 shadow-card'>
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
              <hr className='border-neutral-200 mt-3 mb-5' />
              <nav className='flex flex-col items-start gap-5'>
                <Link
                  href='/profile'
                  className='flex items-center gap-2 text-md tracking-tight-3 font-medium text-neutral-950 transition-colors hover-primary'
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
                  className='flex items-center gap-2 text-md tracking-tight-3 font-medium text-neutral-950 transition-colors  hover-primary'
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
                  className='flex items-center gap-2 text-md tracking-tight-3 font-medium text-neutral-950 transition-colors  hover-primary'
                >
                  <Image src={LogoutIcon} alt='Logout' className='w-6 h-6' />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main */}
          <div className='w-full flex flex-col gap-4 md:gap-6'>
            <h1 className='text-display-xs md:text-display-md-track font-extrabold text-neutral-950'>
              My Orders
            </h1>

            {/* Search */}
            <div className='flex flex-col rounded-2xl gap-5 p-4 md:p-6'>
              <div className='relative'>
                <Image
                  src={Search}
                  alt='Search'
                  className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2'
                />
                <input
                  type='search'
                  placeholder='Search'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='w-full md:w-149.5 h-11 rounded-full border border-neutral-300 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-neutral-600 text-neutral-950 tracking-tight-2 focus:border-primary-100 focus:outline-none focus:ring-1 focus:ring-primary-100/15'
                />
              </div>

              {/* Status tabs */}
              <div className='flex items-center gap-2 md:gap-3 overflow-x-auto pb-4'>
                <span className='shrink-0 text-sm md:text-lg tracking-tight-2 md:tracking-tight-3 font-bold text-neutral-950'>
                  Status
                </span>
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveStatus(tab.value)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm md:text-md tracking-tight-2 transition-all ${
                      activeStatus === tab.value
                        ? 'border-primary-100 font-bold bg-[rgba(255, 236, 236, 1)] text-primary-100 hover-dim'
                        : 'border-neutral-300 bg-white font-semibold text-neutral-950 hover-dark'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Orders */}
              <div className='overflow-hidden rounded-2xl bg-white'>
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
                            <div className='flex items-center gap-2 pb-5'>
                              <Image
                                src={StoreIcon}
                                alt='Store'
                                className='h-8 w-8'
                              />
                              <h3 className='font-bold text-sm md:text-lg tracking-tight-2 md:tracking-tight-3 text-neutral-950'>
                                {group.restaurant?.name}
                              </h3>
                            </div>
                            {group.items?.slice(0, 2).map((item, ii) => (
                              <div
                                key={ii}
                                className='mb-3 flex items-center gap-4'
                              >
                                <div className='relative h-16 md:h-20 w-16 md:w-20 shrink-0 overflow-hidden rounded-xl bg-black'>
                                  <Image
                                    src={item.image ?? placeholder}
                                    alt={item.menuName ?? 'Food'}
                                    fill
                                    className='object-cover w-full'
                                    unoptimized
                                  />
                                </div>
                                <div className='flex flex-col justify-center'>
                                  <p className='h-7 md:h-7.5 flex items-center text-sm md:text-md font-medium md:tracking-tight-3 text-neutral-950'>
                                    {item.menuName}
                                  </p>
                                  <p className='h-7.5 md:h-7.5 text-md md:text-md font-extrabold text-neutral-950'>
                                    {item.quantity} x{' '}
                                    {formatCurrency(item.price ?? 0)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}

                        <hr className='mt-5 mb-3 border-dashed border-neutral-300' />

                        <div className='flex flex-col justify-center md:flex-row md:items-center md:justify-between mb-3'>
                          <div className='flex flex-col mb-3'>
                            <p className='h-7 md:h-7.5 flex items-center text-sm md:text-md md:tracking-tight-3 font-medium text-neutral-950'>
                              Total
                            </p>
                            <p className='h-7.5 md:h-8 text-md md:text-xl font-extrabold text-neutral-950'>
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
                              className='w-full md:w-60 h-11 md:h-12 rounded-full bg-primary-100 flex items-center justify-center gap-2 p-2 text-md md:text-md tracking-tight-2 font-bold text-neutral-25 transition-colors hover-dim'
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
      </div>

      {/* Review Modal */}
      {reviewOrder && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
          onClick={() => setReviewOrder(null)}
        >
          <div
            className='w-full max-w-90.25 md:max-w-109.75 flex flex-col gap-4 md:gap-7 rounded-2xl bg-white p-4 md:p-6'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between'>
              <h2 className='text-xl md:text-display-xs font-extrabold text-neutral-950'>
                Give Review
              </h2>
              <button
                onClick={() => setReviewOrder(null)}
                className='flex h-7 w-7 items-center justify-center hover-dim'
              >
                <Image src={XClose} alt='Close' className='h-5 w-5' />
              </button>
            </div>
            <div className='flex flex-col gap-2 text-center'>
              <p className='text-md font-extrabold text-neutral-950'>
                Give Rating
              </p>
              <div className='flex justify-center'>
                <StarRating
                  value={reviewStar}
                  onChange={setReviewStar}
                  starClassName='h-7.5 w-7.5 md:h-9 md:w-9'
                  containerClassName='gap-3.5 md:gap-4.5'
                />
              </div>
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder='Please share your thoughts about our service!'
              rows={6}
              className='w-full h-58.75 resize-none rounded-2xl border border-neutral-300 py-2 px-3 text-sm md:text-md tracking-tight-2 text-neutral-950  placeholder:text-neutral-500 mt-2'
            />
            <button
              onClick={handleSubmitReview}
              disabled={createReview.isPending}
              className='h-11 md:h-12 w-full rounded-full bg-primary-100 p-2 text-md tracking-tight-2 font-bold text-neutral-25 transition-colors hover-dim disabled:opacity-60'
            >
              {createReview.isPending ? 'Submitting...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
