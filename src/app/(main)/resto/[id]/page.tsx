'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Share2, Plus, Minus } from 'lucide-react';
import BagBlack from '@/assets/icons/bag-black.png';
import { useRestaurantDetail, useAddToCart } from '@/lib/query/hooks';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StarRating } from '@/components/shared/StarRating';
import { MenuCardSkeleton } from '@/components/shared/Skeletons';
import { toast } from '@/hooks/use-toast';
import StarIcon from '@/assets/icons/star.png';
import { FadeInStagger, FadeInItem } from '@/components/shared/FadeInStagger';
import type { MenuItem } from '@/types';
import { getDummyDistance } from '@/lib/utils';

type Params = Promise<{ id: string }>;

const heroSlideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0,
    opacity: dir === 0 ? 0 : 1,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 1,
  }),
};

export default function RestoDetailPage({ params }: { params: Params }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'all' | 'food' | 'drink'>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [visibleMenuCount, setVisibleMenuCount] = useState(4);
  const [visibleReviewCount, setVisibleReviewCount] = useState(4);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroDirection, setHeroDirection] = useState(0);

  const { data: resto, isLoading, error } = useRestaurantDetail(id);
  const addToCart = useAddToCart();

  function changeQty(menuId: string | number, delta: number) {
    const key = String(menuId);
    setQuantities((p) => ({
      ...p,
      [key]: Math.max(0, (p[key] ?? 0) + delta),
    }));
  }

  function handleTabChange(tab: 'all' | 'food' | 'drink') {
    setActiveTab(tab);
    setVisibleMenuCount(4);
  }

  async function handleAdd(item: MenuItem) {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    const key = String(item.id);
    setQuantities((p) => ({ ...p, [key]: 1 })); // tampilkan stepper segera

    try {
      await addToCart.mutateAsync({
        restaurantId: Number(id),
        menuId: Number(item.id),
        quantity: 1,
      });
      const name = item.foodName ?? item.name ?? 'Item';
      toast({ title: `${name} ditambahkan ke cart`, variant: 'success' });
    } catch {
      toast({ title: 'Gagal menambah ke cart', variant: 'error' });
      setQuantities((p) => ({ ...p, [key]: 0 })); // rollback kalau gagal
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

  const rating = resto?.star ?? resto?.rating ?? resto?.averageRating;
  const location = resto?.place ?? resto?.location;
  const allMenu = resto?.menus ?? resto?.menu ?? [];
  const filteredMenu =
    activeTab === 'all'
      ? allMenu
      : allMenu.filter(
          (m) => (m.type ?? m.category)?.toLowerCase() === activeTab
        );
  const displayMenu = filteredMenu.slice(0, visibleMenuCount);
  const allReviews = resto?.reviews ?? [];
  const displayReviews = allReviews.slice(0, visibleReviewCount);

  const totalItems = Object.values(quantities).reduce((s, q) => s + q, 0);
  const totalPrice = allMenu.reduce(
    (s, m) => s + (quantities[String(m.id)] ?? 0) * m.price,
    0
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resto?.name,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const placeholder =
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80';

  const heroImages =
    resto?.images && resto.images.length > 0 ? resto.images : [placeholder];

  return (
    <div className='relative custom-container pt-20 md:pt-22 lg:pt-32 bg-white'>
      {/* Photo grid */}
      {isLoading ? (
        <div className='h-[280px] mx-auto animate-pulse bg-neutral-200 lg:h-[470px]' />
      ) : (
        <>
          {/* Desktop */}
          <div className='hidden md:h-[420px] lg:h-[470px] grid-cols-[1.11fr_0.89fr] gap-5 overflow-hidden md:grid'>
            <FadeInItem index={0} className='relative'>
              <Image
                src={resto?.images?.[0] ?? placeholder}
                alt={resto?.name ?? ''}
                fill
                sizes='60.17vw'
                className='object-cover rounded-2xl'
                priority
              />
            </FadeInItem>
            <div className='grid grid-rows-[2fr_1fr] gap-5'>
              <FadeInItem index={1} className='relative overflow-hidden'>
                <Image
                  src={resto?.images?.[2] ?? placeholder}
                  alt='Photo 4'
                  fill
                  sizes='44,83vw'
                  className='object-cover rounded-2xl'
                />
              </FadeInItem>
              <div className='grid grid-cols-2 gap-5'>
                {[1, 3].map((i, idx) => (
                  <FadeInItem
                    key={i}
                    index={2 + idx}
                    className='relative overflow-hidden'
                  >
                    <Image
                      src={resto?.images?.[i] ?? placeholder}
                      alt={`Photo ${i}`}
                      fill
                      sizes='22.4vw'
                      className='object-cover rounded-2xl'
                    />
                  </FadeInItem>
                ))}
              </div>
            </div>
          </div>
          {/* Mobile */}
          <FadeInItem index={0} className='relative h-[260px] md:hidden'>
            <div className='absolute inset-0 overflow-hidden rounded-2xl'>
              <AnimatePresence
                initial={false}
                custom={heroDirection}
                mode='popLayout'
              >
                <motion.div
                  key={heroIndex}
                  custom={heroDirection}
                  variants={heroSlideVariants}
                  initial='enter'
                  animate='center'
                  exit='exit'
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  drag={heroImages.length > 1 ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_e, info) => {
                    const threshold = 50;
                    if (info.offset.x < -threshold) {
                      setHeroDirection(1);
                      setHeroIndex((prev) => (prev + 1) % heroImages.length);
                    } else if (info.offset.x > threshold) {
                      setHeroDirection(-1);
                      setHeroIndex(
                        (prev) =>
                          (prev - 1 + heroImages.length) % heroImages.length
                      );
                    }
                  }}
                  className='absolute inset-0 cursor-grab active:cursor-grabbing'
                >
                  <Image
                    src={heroImages[heroIndex] ?? placeholder}
                    alt={resto?.name ?? ''}
                    fill
                    sizes='100vw'
                    className='object-cover rounded-2xl pointer-events-none'
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className='absolute -bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-1'>
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setHeroDirection(
                      i > heroIndex ? 1 : i < heroIndex ? -1 : 0
                    );
                    setHeroIndex(i);
                  }}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`h-2 w-2 cursor-pointer rounded-full transition-colors ${i === heroIndex ? 'bg-primary-100' : 'bg-accent-gray'}`}
                />
              ))}
            </div>
          </FadeInItem>
        </>
      )}

      <div className='mx-auto max-w-7xl mt-2.25'>
        {/* Restaurant info */}
        <div className='flex items-center justify-between pt-6'>
          <div className='flex items-center gap-2 md:gap-4'>
            <div className='flex h-22.5 w-22.5 lg:w-30 lg:h-30 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-50 shadow-sm'>
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
            <div className='flex flex-col gap-1.25'>
              <h1 className='text-md font-extrabold text-neutral-950 lg:text-display-md-track'>
                {isLoading ? (
                  <span className='inline-block h-7 w-48 animate-pulse rounded bg-neutral-200' />
                ) : (
                  resto?.name
                )}
              </h1>
              <div className='flex items-center gap-1'>
                <Image src={StarIcon} alt='Star' width={24} height={24} />
                <span className='text-sm lg:text-lg tracking-tight-2 font-semibold text-neutral-950'>
                  {rating?.toFixed(1)}
                </span>
              </div>
              <div className='text-sm lg:text-lg font-medium text-neutral-950'>
                {location}
                {resto?.id != null && ` • ${getDummyDistance(resto.id)} km`}
              </div>
            </div>
          </div>
          <button
            onClick={handleShare}
            className='w-11 h-11 md:w-35 md:h-11 flex items-center justify-center gap-3 rounded-full border border-neutral-300 bg-white md:px-4 md:py-3 text-sm md:text-md tracking-tight-2 font-bold text-neutral-950 transition-colors hover:bg-neutral-50'
          >
            <Share2 className='h-5 w-5 md:h-6 md:w-6' />
            <span className='hidden sm:inline'>Share</span>
          </button>
        </div>

        <hr className='border-neutral-300 my-5 lg:my-8' />

        {/* Menu */}
        <section className='flex flex-col gap-5 pb-6 md:gap-5 lg:gap-6'>
          <h2 className='text-display-xs lg:text-display-lg-track font-extrabold text-neutral-950'>
            Menu
          </h2>
          <div className='flex gap-2 md:gap-3'>
            {(['all', 'food', 'drink'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`rounded-full border px-4 py-2 text-sm md:text-md tracking-tight-2 capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'border-primary-100 bg-primary-50 text-primary-100 font-bold'
                    : 'border-neutral-300 bg-white text-neutral-950 hover:border-neutral-600 font-semibold'
                }`}
              >
                {tab === 'all'
                  ? 'All Menu'
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className='grid grid-cols-2 gap-5 md:gap-5 md:grid-cols-3 lg:grid-cols-4'>
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
              <FadeInStagger className='grid grid-cols-2 gap-5 md:gap-5 md:grid-cols-3 lg:grid-cols-4'>
                {displayMenu.map((item, idx) => {
                  const key = String(item.id ?? idx);
                  const qty = quantities[key] ?? 0;
                  const itemName = item.foodName ?? item.name ?? 'Menu';
                  return (
                    <FadeInItem key={key} index={idx % 4}>
                      <div className='flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover-scale-105 cursor-pointer'>
                        <div
                          className='relative w-full'
                          style={{ aspectRatio: '1 / 1' }}
                        >
                          <Image
                            src={item.image ?? placeholder}
                            alt={itemName}
                            fill
                            sizes='(max-width: 768px) 50vw, 25vw'
                            className='object-cover'
                            unoptimized
                          />
                        </div>

                        <div
                          className='flex flex-col md:flex-row md:items-center md:justify-between'
                          style={{
                            padding: 'clamp(8px, 0.6vw + 5.6px, 16px)',
                            gap: 'clamp(8px, 1vw + 4px, 16px)',
                          }}
                        >
                          <div className='flex flex-col min-w-0'>
                            <p
                              className='font-medium text-neutral-950'
                              style={{
                                fontSize: 'clamp(12px, 0.4vw + 10.4px, 16px)',
                              }}
                            >
                              {itemName}
                            </p>
                            <p
                              className='font-extrabold text-neutral-950'
                              style={{
                                fontSize: 'clamp(14px, 0.6vw + 11.6px, 20px)',
                              }}
                            >
                              {formatCurrency(item.price)}
                            </p>
                          </div>

                          {qty === 0 ? (
                            <button
                              onClick={() => handleAdd(item)}
                              className='w-full h-9 md:w-19.75 lg:h-10 flex items-center justify-center rounded-full bg-primary-100 font-bold text-white transition-colors hover:bg-primary-hover active:scale-[0.98]'
                              style={{
                                fontSize: 'clamp(12px, 0.4vw + 10.4px, 16px)',
                              }}
                            >
                              Add
                            </button>
                          ) : (
                            <div
                              className='flex items-center justify-between'
                              style={{
                                width: 'clamp(114px, 9.4vw + 76.6px, 123px)',
                                height: 'clamp(36px, 0.4vw + 34.4px, 40px)',
                              }}
                            >
                              <button
                                onClick={() => changeQty(item.id, -1)}
                                className='flex items-center justify-center rounded-full border border-neutral-300 text-neutral-950 shrink-0'
                                style={{
                                  width: 'clamp(32px, 1.2vw + 27.8px, 40px)',
                                  height: 'clamp(32px, 1.2vw + 27.8px, 40px)',
                                }}
                              >
                                <Minus
                                  style={{
                                    width: 'clamp(16px, 0.6vw + 13.9px, 24px)',
                                    height: 'clamp(16px, 0.6vw + 13.9px, 24px)',
                                  }}
                                />
                              </button>
                              <span
                                className='font-semibold text-neutral-950 tracking-tight-2'
                                style={{
                                  fontSize: 'clamp(14px, 0.6vw + 11.6px, 20px)',
                                }}
                              >
                                {qty}
                              </span>
                              <button
                                onClick={() => changeQty(item.id, 1)}
                                className='flex items-center justify-center rounded-full bg-primary-100 text-white hover:bg-primary-hover shrink-0'
                                style={{
                                  width: 'clamp(32px, 1.2vw + 27.8px, 40px)',
                                  height: 'clamp(32px, 1.2vw + 27.8px, 40px)',
                                }}
                              >
                                <Plus
                                  style={{
                                    width: 'clamp(16px, 0.6vw + 13.9px, 24px)',
                                    height: 'clamp(16px, 0.6vw + 13.9px, 24px)',
                                  }}
                                />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </FadeInItem>
                  );
                })}
              </FadeInStagger>
              {filteredMenu.length > 4 && (
                <div className='flex justify-center md:mt-2'>
                  <button
                    onClick={() =>
                      setVisibleMenuCount((prev) =>
                        prev >= filteredMenu.length
                          ? Math.max(4, prev - 2)
                          : Math.min(filteredMenu.length, prev + 4)
                      )
                    }
                    className='w-40 h-10 md:h-12 rounded-full border border-neutral-300 p-2 text-sm md:text-md font-bold tracking-tight-2 text-neutral-950 hover-dim'
                  >
                    {visibleMenuCount >= filteredMenu.length
                      ? 'Show Less'
                      : 'Show More'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <hr className='border-neutral-300 my-4 lg:my-2' />

        {/* Reviews */}
        <section className='flex flex-col gap-4 lg:gap-6 lg:pt-6'>
          <div className='flex flex-col items-start justify-center gap-2 md:gap-3'>
            <h2 className='text-display-xs lg:text-display-lg-track font-extrabold text-neutral-950'>
              Review
            </h2>
            <div className='flex items-center gap-1'>
              <Image
                src={StarIcon}
                alt='Star'
                width={24}
                height={24}
                className='lg:w-8.5 lg:h-8.5'
              />
              <span className='text-md lg:text-xl font-extrabold text-neutral-950'>
                {rating?.toFixed(1)}
              </span>
              <span className='text-md lg:text-xl font-extrabold text-neutral-950'>
                ({allReviews.length} Ulasan)
              </span>
            </div>
          </div>

          {allReviews.length === 0 ? (
            <p className='py-8 text-center text-neutral-500'>No reviews yet</p>
          ) : (
            <div>
              <FadeInStagger className='grid grid-cols-1 gap-4 lg:gap-5 md:grid-cols-2'>
                {displayReviews.map((review, idx) => {
                  const userName =
                    review.user?.name ?? review.userName ?? 'User';
                  const userAvatar = review.user?.avatar ?? review.userAvatar;
                  return (
                    <FadeInItem key={review.id ?? idx} index={idx % 4}>
                      <div className='flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-card'>
                        <div className='flex items-center gap-3'>
                          <div className='flex h-15 lg:h-16 w-15 lg-w-16 shrink-0 items-center justify-center border border-neutral-700 overflow-hidden rounded-full'>
                            {userAvatar ? (
                              <Image
                                src={userAvatar}
                                alt={userName}
                                width={58}
                                height={58}
                                className='h-full w-full object-cover'
                                unoptimized
                              />
                            ) : (
                              <span className='text-4xl'>👤</span>
                            )}
                          </div>
                          <div className='flex flex-col justify-center'>
                            <p className='text-md lg:text-lg lg:tracking-tight-2 font-extrabold text-neutral-950'>
                              {userName}
                            </p>
                            <p className='text-sm lg:text-md tracking-tight-2 text-neutral-950'>
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                          <StarRating value={review.star} readonly size='md' />
                          <p className='text-sm lg:text-md tracking-tight-2 text-neutral-950'>
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </FadeInItem>
                  );
                })}
              </FadeInStagger>
              {allReviews.length > 4 && (
                <div className='flex justify-center mt-6 md:mt-2 mb-10 lg:mb-12'>
                  <button
                    onClick={() =>
                      setVisibleReviewCount((prev) =>
                        prev >= allReviews.length
                          ? Math.max(4, prev - 2)
                          : Math.min(allReviews.length, prev + 4)
                      )
                    }
                    className='w-40 h-10 md:h-12 rounded-full border border-neutral-300 p-2 text-sm md:text-md font-bold tracking-tight-2 text-neutral-950 hover-dim'
                  >
                    {visibleReviewCount >= allReviews.length
                      ? 'Show Less'
                      : 'Show More'}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Sticky cart bar */}
      {totalItems > 0 && (
        <div className='custom-container fixed inset-x-0 bottom-0 z-40 h-20 bg-white shadow-card flex items-center'>
          <div className='flex w-full items-center justify-between gap-4'>
            <div className='flex flex-col gap-0.5'>
              <div className='flex items-center gap-2'>
                <Image src={BagBlack} alt='Shopping Bag' className='h-6 w-6' />
                <span className='text-md tracking-tight-2 text-neutral-950'>
                  {totalItems} Items
                </span>
              </div>
              <span className='text-xl font-extrabold text-neutral-950'>
                {formatCurrency(totalPrice)}
              </span>
            </div>
            <Link
              href='/cart'
              className='w-57.5 h-11 flex items-center justify-center shrink-0 rounded-full bg-primary-100 p-2 gap-2 text-md font-bold tracking-tight-2 text-center text-neutral-25 transition-colors hover-dim'
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
