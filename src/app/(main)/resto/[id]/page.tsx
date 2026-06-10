'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Share2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useRestaurantDetail, useAddToCart } from '@/lib/query/hooks';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StarRating } from '@/components/shared/StarRating';
import { MenuCardSkeleton } from '@/components/shared/Skeletons';
import { toast } from '@/hooks/use-toast';
import type { MenuItem } from '@/types';

type Params = Promise<{ id: string }>;

export default function RestoDetailPage({ params }: { params: Params }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'all' | 'food' | 'drink'>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(false);

  const { data: resto, isLoading, error } = useRestaurantDetail(id);
  const addToCart = useAddToCart();

  function changeQty(menuId: string, delta: number) {
    setQuantities((p) => ({
      ...p,
      [menuId]: Math.max(0, (p[menuId] ?? 0) + delta),
    }));
  }

  async function handleAdd(item: MenuItem) {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    const qty = Math.max(1, quantities[item.id] ?? 1);
    try {
      await addToCart.mutateAsync({
        restaurantId: id,
        menuId: item.id,
        quantity: qty,
      });
      toast({ title: `${item.name} ditambahkan ke cart`, variant: 'success' });
      setQuantities((p) => ({ ...p, [item.id]: 0 }));
    } catch {
      toast({ title: 'Gagal menambah ke cart', variant: 'error' });
    }
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center py-24 text-center'>
        <span className='mb-3 text-5xl'>😕</span>
        <p className='text-lg font-semibold text-neutral-700'>
          Restaurant not found
        </p>
        <Link
          href='/'
          className='mt-4 text-sm font-medium text-primary-100 hover:underline'
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  const allMenu = resto?.menu ?? [];
  const filteredMenu =
    activeTab === 'all'
      ? allMenu
      : allMenu.filter((m) => m.category?.toLowerCase() === activeTab);
  const displayMenu = showAllMenu ? filteredMenu : filteredMenu.slice(0, 8);
  const allReviews = resto?.reviews ?? [];
  const displayReviews = showAllReviews ? allReviews : allReviews.slice(0, 6);

  const totalItems = Object.values(quantities).reduce((s, q) => s + q, 0);
  const totalPrice = allMenu.reduce(
    (s, m) => s + (quantities[m.id] ?? 0) * m.price,
    0
  );

  const placeholder =
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80';

  return (
    <div className='relative min-h-screen bg-white pb-28 lg:pb-0'>
      {/* Photo grid */}
      {isLoading ? (
        <div className='h-[280px] animate-pulse bg-neutral-200 lg:h-[560px]' />
      ) : (
        <>
          {/* Desktop */}
          <div className='hidden h-[560px] grid-cols-2 gap-1 overflow-hidden lg:grid'>
            <div className='relative'>
              <Image
                src={resto?.images?.[0] ?? placeholder}
                alt={resto?.name ?? ''}
                fill
                className='object-cover'
                priority
              />
            </div>
            <div className='grid grid-rows-2 gap-1'>
              <div className='grid grid-cols-2 gap-1'>
                {[1, 2].map((i) => (
                  <div key={i} className='relative overflow-hidden'>
                    <Image
                      src={resto?.images?.[i] ?? placeholder}
                      alt={`Photo ${i}`}
                      fill
                      className='object-cover'
                    />
                  </div>
                ))}
              </div>
              <div className='relative overflow-hidden'>
                <Image
                  src={resto?.images?.[3] ?? placeholder}
                  alt='Photo 4'
                  fill
                  className='object-cover'
                />
              </div>
            </div>
          </div>
          {/* Mobile */}
          <div className='relative h-[280px] lg:hidden'>
            <Image
              src={resto?.images?.[0] ?? placeholder}
              alt={resto?.name ?? ''}
              fill
              className='object-cover'
              priority
            />
            <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5'>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Restaurant info */}
        <div className='flex items-start justify-between py-6'>
          <div className='flex items-center gap-4'>
            <div className='flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-orange-50 shadow-sm'>
              {isLoading ? (
                <div className='h-full w-full animate-pulse bg-neutral-200' />
              ) : resto?.logo ? (
                <Image
                  src={resto.logo}
                  alt={resto.name}
                  width={64}
                  height={64}
                  className='h-full w-full object-cover'
                  unoptimized
                />
              ) : (
                <span className='text-3xl'>🍔</span>
              )}
            </div>
            <div>
              <h1 className='text-xl font-bold text-neutral-900 lg:text-2xl'>
                {isLoading ? (
                  <span className='inline-block h-7 w-48 animate-pulse rounded bg-neutral-200' />
                ) : (
                  resto?.name
                )}
              </h1>
              <div className='mt-1 flex items-center gap-1.5'>
                <Star className='h-4 w-4 fill-star text-star' />
                <span className='text-sm font-semibold text-neutral-800'>
                  {resto?.rating?.toFixed(1)}
                </span>
              </div>
              <div className='mt-0.5 flex items-center gap-1 text-sm text-neutral-500'>
                <MapPin className='h-3.5 w-3.5 shrink-0' />
                <span>
                  {resto?.location}
                  {resto?.distance != null &&
                    ` · ${resto.distance.toFixed(1)} km`}
                </span>
              </div>
            </div>
          </div>
          <button className='flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50'>
            <Share2 className='h-4 w-4' />
            <span className='hidden sm:inline'>Share</span>
          </button>
        </div>

        <hr className='border-neutral-100' />

        {/* Menu */}
        <section className='py-8'>
          <h2 className='mb-4 text-xl font-bold text-neutral-900'>Menu</h2>
          <div className='mb-6 flex gap-2'>
            {(['all', 'food', 'drink'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full border px-5 py-1.5 text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'border-primary-100 bg-primary-100 text-white shadow-sm'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                }`}
              >
                {tab === 'all'
                  ? 'All Menu'
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
              {Array.from({ length: 8 }).map((_, i) => (
                <MenuCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredMenu.length === 0 ? (
            <p className='py-12 text-center text-neutral-500'>
              No menu items in this category
            </p>
          ) : (
            <>
              <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
                {displayMenu.map((item) => {
                  const qty = quantities[item.id] ?? 0;
                  return (
                    <div
                      key={item.id}
                      className='overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-shadow hover:shadow-md'
                    >
                      <div className='relative h-36 w-full bg-neutral-100 sm:h-40'>
                        <Image
                          src={item.image ?? placeholder}
                          alt={item.name}
                          fill
                          className='object-cover'
                          unoptimized
                        />
                      </div>
                      <div className='p-3'>
                        <p className='line-clamp-1 text-sm font-semibold text-neutral-900'>
                          {item.name}
                        </p>
                        <p className='mt-0.5 text-sm font-bold text-neutral-900'>
                          {formatCurrency(item.price)}
                        </p>
                        <div className='mt-3'>
                          {qty === 0 ? (
                            <button
                              onClick={() => handleAdd(item)}
                              className='w-full rounded-full bg-primary-100 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover active:scale-[0.98]'
                            >
                              Add
                            </button>
                          ) : (
                            <div className='flex items-center justify-between'>
                              <button
                                onClick={() => changeQty(item.id, -1)}
                                className='flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                              >
                                <Minus className='h-3.5 w-3.5' />
                              </button>
                              <span className='text-sm font-bold'>{qty}</span>
                              <button
                                onClick={() => changeQty(item.id, 1)}
                                className='flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-white hover:bg-primary-hover'
                              >
                                <Plus className='h-3.5 w-3.5' />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {filteredMenu.length > 8 && (
                <div className='mt-6 flex justify-center'>
                  <button
                    onClick={() => setShowAllMenu(!showAllMenu)}
                    className='rounded-full border border-neutral-300 px-8 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50'
                  >
                    {showAllMenu ? 'Show Less' : 'Show More'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <hr className='border-neutral-100' />

        {/* Reviews */}
        <section className='py-8'>
          <h2 className='mb-2 text-xl font-bold text-neutral-900'>Review</h2>
          <div className='mb-6 flex items-center gap-2'>
            <Star className='h-5 w-5 fill-star text-star' />
            <span className='text-lg font-bold text-neutral-900'>
              {resto?.rating?.toFixed(1)}
            </span>
            <span className='text-sm text-neutral-500'>
              ({allReviews.length} Ulasan)
            </span>
          </div>

          {allReviews.length === 0 ? (
            <p className='py-8 text-center text-neutral-500'>No reviews yet</p>
          ) : (
            <>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                {displayReviews.map((review) => (
                  <div
                    key={review.id}
                    className='rounded-xl border border-neutral-100 bg-white p-4 shadow-sm'
                  >
                    <div className='mb-3 flex items-center gap-3'>
                      <div className='flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-200'>
                        {review.userAvatar ? (
                          <Image
                            src={review.userAvatar}
                            alt={review.userName}
                            width={40}
                            height={40}
                            className='h-full w-full object-cover'
                            unoptimized
                          />
                        ) : (
                          <span className='text-lg'>👤</span>
                        )}
                      </div>
                      <div>
                        <p className='text-sm font-semibold text-neutral-900'>
                          {review.userName}
                        </p>
                        <p className='text-xs text-neutral-500'>
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <StarRating value={review.star} readonly size='sm' />
                    <p className='mt-2 text-sm leading-relaxed text-neutral-700'>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
              {allReviews.length > 6 && (
                <div className='mt-6 flex justify-center'>
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className='rounded-full border border-neutral-300 px-8 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50'
                  >
                    {showAllReviews ? 'Show Less' : 'Show More'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Sticky cart bar */}
      {totalItems > 0 && (
        <div className='fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur-sm shadow-2xl'>
          <div className='mx-auto flex max-w-7xl items-center justify-between'>
            <div className='flex items-center gap-2'>
              <ShoppingBag className='h-5 w-5 text-neutral-700' />
              <span className='text-sm font-medium text-neutral-700'>
                {totalItems} Items
              </span>
            </div>
            <span className='text-sm font-bold text-neutral-900'>
              {formatCurrency(totalPrice)}
            </span>
            <Link
              href='/cart'
              className='rounded-full bg-primary-100 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover'
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
