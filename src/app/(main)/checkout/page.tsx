'use client';

import { Suspense, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Minus, Plus, FileText } from 'lucide-react';
import { useCart, useCheckout } from '@/lib/query/hooks';
import { useRequireAuth } from '@/hooks/use-auth-guard';
import { useUIStore } from '@/store/ui.store';
import { formatCurrency } from '@/lib/utils';
import { checkoutSchema, type CheckoutFormValues } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const PAYMENT_METHODS = [
  { id: 'bni', name: 'Bank Negara Indonesia', abbr: 'BNI' },
  { id: 'bri', name: 'Bank Rakyat Indonesia', abbr: 'BRI' },
  { id: 'bca', name: 'Bank Central Asia', abbr: 'BCA' },
  { id: 'mandiri', name: 'Mandiri', abbr: 'MDR' },
];

const DELIVERY_FEE = 10000;
const SERVICE_FEE = 1000;

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');
  const { isAuthenticated, hasHydrated } = useRequireAuth();
  const { data: cartGroups, isLoading } = useCart();
  const checkout = useCheckout();
  const { setPaymentSuccess } = useUIStore();
  const [localQty, setLocalQty] = useState<Record<string, number>>({});

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'bni' },
  });

  const selectedPayment = watch('paymentMethod');

  if (!hasHydrated) return null;
  if (!isAuthenticated) return null;

  const targetGroups = restaurantId
    ? (cartGroups ?? []).filter((g) => g.restaurant?.id === restaurantId)
    : (cartGroups ?? []);

  const subtotal = targetGroups.reduce(
    (sum, g) =>
      sum +
      g.items.reduce(
        (s, i) => s + (i.menu?.price ?? 0) * (localQty[i.id] ?? i.quantity),
        0
      ),
    0
  );
  const total = subtotal + DELIVERY_FEE + SERVICE_FEE;
  const itemCount = targetGroups.reduce((s, g) => s + g.items.length, 0);

  const placeholder =
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80';

  async function onSubmit(values: CheckoutFormValues) {
    if (!targetGroups.length) {
      toast({ title: 'Cart is empty', variant: 'error' });
      return;
    }
    try {
      await checkout.mutateAsync({
        restaurants: targetGroups.map((g) => ({
          restaurantId: g.restaurant.id,
          items: g.items.map((i) => ({
            menuId: i.menuId,
            quantity: localQty[i.id] ?? i.quantity,
          })),
        })),
        deliveryAddress: values.deliveryAddress,
        phone: values.phone,
        paymentMethod: values.paymentMethod,
        notes: values.notes,
      });
      setPaymentSuccess({
        date: new Date().toLocaleString('id-ID'),
        paymentMethod:
          PAYMENT_METHODS.find((p) => p.id === values.paymentMethod)?.name ??
          values.paymentMethod,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        serviceFee: SERVICE_FEE,
        total,
      });
      router.push('/checkout/success');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Checkout failed. Please try again.';
      toast({ title: 'Checkout failed', description: msg, variant: 'error' });
    }
  }

  return (
    <div className='min-h-screen bg-neutral-50'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <h1 className='mb-6 text-2xl font-bold text-neutral-900'>Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className='flex flex-col gap-5 lg:flex-row lg:items-start'>
            {/* Left */}
            <div className='flex-1 space-y-4'>
              {/* Delivery address */}
              <div className='rounded-2xl bg-white p-5 shadow-sm'>
                <div className='mb-4 flex items-center gap-2'>
                  <MapPin className='h-5 w-5 text-primary-100' />
                  <h2 className='font-bold text-neutral-900'>
                    Delivery Address
                  </h2>
                </div>
                <div className='space-y-3'>
                  <Input
                    {...register('deliveryAddress')}
                    placeholder='Full delivery address (min. 10 characters)'
                    error={errors.deliveryAddress?.message}
                  />
                  <Input
                    {...register('phone')}
                    type='tel'
                    placeholder='Phone number (optional)'
                  />
                </div>
                <div className='mt-3 flex justify-end'>
                  <button
                    type='button'
                    className='rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors'
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Cart items */}
              {isLoading ? (
                <div className='h-48 animate-pulse rounded-2xl bg-white' />
              ) : (
                targetGroups.map((group) => (
                  <div
                    key={group.restaurant?.id}
                    className='rounded-2xl bg-white p-5 shadow-sm'
                  >
                    <div className='mb-4 flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='text-lg'>🛍️</span>
                        <h3 className='font-bold text-neutral-900'>
                          {group.restaurant?.name}
                        </h3>
                      </div>
                      <button
                        type='button'
                        className='text-sm font-medium text-primary-100 hover:underline'
                      >
                        Add item
                      </button>
                    </div>
                    <div className='space-y-4'>
                      {group.items.map((item) => {
                        const qty = localQty[item.id] ?? item.quantity;
                        return (
                          <div
                            key={item.id}
                            className='flex items-center gap-3'
                          >
                            <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100'>
                              <Image
                                src={item.menu?.image ?? placeholder}
                                alt={item.menu?.name ?? ''}
                                fill
                                className='object-cover'
                                unoptimized
                              />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='line-clamp-1 text-sm font-semibold text-neutral-900'>
                                {item.menu?.name}
                              </p>
                              <p className='text-sm text-neutral-500'>
                                {formatCurrency(item.menu?.price ?? 0)}
                              </p>
                            </div>
                            <div className='flex shrink-0 items-center gap-2'>
                              <button
                                type='button'
                                onClick={() =>
                                  setLocalQty((p) => ({
                                    ...p,
                                    [item.id]: Math.max(
                                      1,
                                      (p[item.id] ?? item.quantity) - 1
                                    ),
                                  }))
                                }
                                className='flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors'
                              >
                                <Minus className='h-3.5 w-3.5' />
                              </button>
                              <span className='w-5 text-center text-sm font-bold'>
                                {qty}
                              </span>
                              <button
                                type='button'
                                onClick={() =>
                                  setLocalQty((p) => ({
                                    ...p,
                                    [item.id]:
                                      (p[item.id] ?? item.quantity) + 1,
                                  }))
                                }
                                className='flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-white hover:bg-primary-hover transition-colors'
                              >
                                <Plus className='h-3.5 w-3.5' />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}

              {/* Notes */}
              <div className='rounded-2xl bg-white p-5 shadow-sm'>
                <div className='mb-3 flex items-center gap-2'>
                  <FileText className='h-5 w-5 text-neutral-500' />
                  <h2 className='font-bold text-neutral-900'>Notes</h2>
                </div>
                <textarea
                  {...register('notes')}
                  placeholder='Additional notes (optional)'
                  rows={3}
                  className='w-full resize-none rounded-xl border border-neutral-200 p-3 text-sm placeholder:text-neutral-400 focus:border-primary-100 focus:outline-none focus:ring-1 focus:ring-primary-100/15'
                />
              </div>
            </div>

            {/* Right */}
            <div className='w-full space-y-4 lg:w-[340px] xl:w-[380px]'>
              {/* Payment method */}
              <div className='rounded-2xl bg-white p-5 shadow-sm'>
                <h2 className='mb-4 font-bold text-neutral-900'>
                  Payment Method
                </h2>
                <div className='space-y-2'>
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors hover:bg-neutral-50 ${
                        selectedPayment === method.id
                          ? 'border-primary-100 bg-primary-light'
                          : 'border-neutral-200'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <div
                          className={`flex h-9 w-12 items-center justify-center rounded-lg text-xs font-bold ${
                            method.id === 'bni'
                              ? 'bg-orange-100 text-orange-700'
                              : method.id === 'bri'
                                ? 'bg-blue-100 text-blue-700'
                                : method.id === 'bca'
                                  ? 'bg-sky-100 text-sky-700'
                                  : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {method.abbr}
                        </div>
                        <span className='text-sm font-medium text-neutral-900'>
                          {method.name}
                        </span>
                      </div>
                      <input
                        type='radio'
                        value={method.id}
                        {...register('paymentMethod')}
                        className='h-4 w-4 text-primary-100 focus:ring-primary-100'
                      />
                    </label>
                  ))}
                  {errors.paymentMethod && (
                    <p className='text-xs text-error'>
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className='rounded-2xl bg-white p-5 shadow-sm'>
                <h2 className='mb-4 font-bold text-neutral-900'>
                  Payment Summary
                </h2>
                <div className='space-y-2.5 text-sm'>
                  <div className='flex justify-between text-neutral-600'>
                    <span>Price ({itemCount} items)</span>
                    <span className='font-semibold text-neutral-900'>
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className='flex justify-between text-neutral-600'>
                    <span>Delivery Fee</span>
                    <span className='font-semibold text-neutral-900'>
                      {formatCurrency(DELIVERY_FEE)}
                    </span>
                  </div>
                  <div className='flex justify-between text-neutral-600'>
                    <span>Service Fee</span>
                    <span className='font-semibold text-neutral-900'>
                      {formatCurrency(SERVICE_FEE)}
                    </span>
                  </div>
                  <hr className='border-neutral-100' />
                  <div className='flex justify-between text-base font-extrabold text-neutral-900'>
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                <button
                  type='submit'
                  disabled={checkout.isPending}
                  className='mt-5 w-full rounded-full bg-primary-100 py-3.5 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-60'
                >
                  {checkout.isPending ? 'Processing...' : 'Buy'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
