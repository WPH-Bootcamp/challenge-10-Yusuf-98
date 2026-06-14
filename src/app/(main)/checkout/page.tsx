'use client';

import { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CartItemRow from '@/components/shared/CartItemRow';
import MapPin from '@/assets/icons/map-pin.png';
import CheckTicked from '@/assets/icons/checkround-ticked.png';
import CheckUnticked from '@/assets/icons/checkround-unticked.png';
import StoreIcon from '@/assets/icons/store.png';
import { useCart, useCheckout } from '@/lib/query/hooks';
import { useRequireAuth } from '@/hooks/use-auth-guard';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { formatCurrency } from '@/lib/utils';
import { checkoutSchema, type CheckoutFormValues } from '@/lib/validations';
import { ChangeAddressModal } from '@/components/shared/ChangeAddressModal';
import { toast } from '@/hooks/use-toast';
import BankBni from '@/assets/icons/bni.png';
import BankBri from '@/assets/icons/bri.png';
import BankBca from '@/assets/icons/bca.png';
import BankMandiri from '@/assets/icons/mandiri.png';
import { Button } from '@/components/ui/button';

const PAYMENT_METHODS = [
  { id: 'bni', name: 'Bank Negara Indonesia', logo: BankBni },
  { id: 'bri', name: 'Bank Rakyat Indonesia', logo: BankBri },
  { id: 'bca', name: 'Bank Central Asia', logo: BankBca },
  { id: 'mandiri', name: 'Mandiri', logo: BankMandiri },
];

const DELIVERY_FEE = 10000;
const SERVICE_FEE = 1000;

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');
  const { isAuthenticated, hasHydrated } = useRequireAuth();
  const { user } = useAuthStore();
  const { data: cartGroups, isLoading } = useCart();
  const checkout = useCheckout();
  const { setPaymentSuccess } = useUIStore();
  const [localQty, setLocalQty] = useState<Record<string, number>>({});
  const [showAddressModal, setShowAddressModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'bni',
      deliveryAddress: '',
      phone: '',
    },
  });

  const selectedPayment = watch('paymentMethod');
  const deliveryAddress = watch('deliveryAddress');
  const phone = watch('phone');

  useEffect(() => {
    if (user?.address) setValue('deliveryAddress', user.address);
    if (user?.phone) setValue('phone', user.phone);
  }, [user, setValue]);

  if (!hasHydrated) return null;
  if (!isAuthenticated) return null;

  const targetGroups = restaurantId
    ? (cartGroups ?? []).filter(
        (g) => String(g.restaurant?.id) === String(restaurantId)
      )
    : (cartGroups ?? []);

  const subtotal = targetGroups.reduce(
    (sum, g) =>
      sum +
      g.items.reduce(
        (s, i) =>
          s + (i.menu?.price ?? 0) * (localQty[String(i.id)] ?? i.quantity),
        0
      ),
    0
  );
  const total = subtotal + DELIVERY_FEE + SERVICE_FEE;
  const itemCount = targetGroups.reduce((s, g) => s + g.items.length, 0);

  const placeholder =
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80';

  const isAddressValid = (deliveryAddress ?? '').trim().length >= 10;

  async function onSubmit(values: CheckoutFormValues) {
    if (!targetGroups.length) {
      toast({ title: 'Cart is empty', variant: 'error' });
      return;
    }
    try {
      await checkout.mutateAsync({
        restaurants: targetGroups.map((g) => ({
          restaurantId: Number(g.restaurant.id),
          items: g.items.map((i) => ({
            menuId: Number(i.menu?.id),
            quantity: localQty[String(i.id)] ?? i.quantity,
          })),
        })),
        deliveryAddress: values.deliveryAddress,
        phone: values.phone,
        paymentMethod: values.paymentMethod,
        notes: values.notes,
      });
      setPaymentSuccess({
        date: new Date()
          .toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
          .replace(' pukul', ','),
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
    <div className='custom-container min-h-screen items-center flex justify-center pt-20 md:pt-22 lg:pt-32 mb-12 md:mb-25'>
      <div className='mx-auto w-full lg:w-250 flex flex-col gap-4 md:gap-6'>
        <h1 className='w-full text-display-xs md:text-display-md-track font-extrabold text-neutral-950'>
          Checkout
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className='flex flex-col gap-4 md:gap-5 md:flex-row lg:items-start'>
            {/* Left */}
            <div className='w-full min-w-90 flex flex-col gap-4 md:gap-5'>
              {/* Delivery address */}
              <div className='flex flex-col gap-4 md:gap-5.25 p-4 md:p-5 shadow-card rounded-2xl bg-white'>
                <div className='flex flex-col gap-1'>
                  <div className='h-7.5 md:h-8 flex items-center gap-2'>
                    <Image
                      src={MapPin}
                      alt='Map Pin'
                      className='h-6 md:h-8 w-6 md:w-8'
                    />
                    <h2 className='font-extrabold text-md md:text-lg md:tracking-tight-2 text-neutral-950'>
                      Delivery Address
                    </h2>
                  </div>

                  <div className='flex flex-col gap-1'>
                    {isAddressValid ? (
                      <>
                        <p className='h-7 md:h-7.5 flex items-center text-sm md:text-md md:tracking-tight-3 font-medium text-neutral-950'>
                          {deliveryAddress}
                        </p>
                        {phone && (
                          <p className='h-7 md:h-7.5 flex items-center text-sm md:text-md md:tracking-tight-3 font-medium text-neutral-950'>
                            {phone}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className='text-sm md:text-md md:tracking-tight-3 font-medium text-error'>
                        Please set your delivery address
                      </p>
                    )}
                    {errors.deliveryAddress && (
                      <p className='text-sm md:text-md md:tracking-tight-3 font-medium text-error'>
                        {errors.deliveryAddress.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='flex'>
                  <button
                    type='button'
                    onClick={() => setShowAddressModal(true)}
                    className='h-9 md:h-10 w-30 flex items-center justify-center rounded-full border border-neutral-300 px-4 py-1.5 text-sm md:text-md tracking-tight-2 font-bold text-neutral-950 hover-dark transition-colors cursor-pointer'
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
                    className='rounded-2xl bg-white flex flex-col gap-3 md:gap-5 p-4 md:p-5 shadow-card'
                  >
                    <div className='flex items-center justify-between py-0.5'>
                      <div className='flex items-center gap-2'>
                        <Image
                          src={StoreIcon}
                          alt='Store'
                          className='h-8 w-8'
                        />
                        <h3 className='font-bold text-md md:text-lg tracking-tight-2 md:tracking-tight-3 text-neutral-950'>
                          {group.restaurant?.name}
                        </h3>
                      </div>
                      <button
                        type='button'
                        className='h-9 md:h-10 w-30 flex justify-center rounded-full border border-neutral-300 px-6 py-2 md:p-2 text-sm md:text-md tracking-tight-2 font-bold text-neutral-950 hover-dark items-center transition-colors cursor-pointer'
                      >
                        Add item
                      </button>
                    </div>
                    <div className='flex flex-col gap-3 md:gap-5 py-2.5'>
                      {group.items.map((item) => {
                        const key = String(item.id);
                        const qty = localQty[key] ?? item.quantity;
                        return (
                          <CartItemRow
                            key={item.id}
                            item={{ ...item, quantity: qty }}
                            placeholder={placeholder}
                            isUpdating={false}
                            onUpdate={(id, newQty) =>
                              setLocalQty((p) => ({
                                ...p,
                                [id]: Math.max(1, newQty),
                              }))
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right */}
            <div className='w-full md:max-w-97.5 md:min-w-85 rounded-2xl bg-white py-4 md:py-5 shadow-card'>
              <div className='flex flex-col gap-3 md:gap-4 px-4 md:px-5'>
                {/* Payment method */}
                <h2 className='h-7.5 md:h-8 font-extrabold text-md md:text-lg md:tracking-tight-2 text-neutral-950'>
                  Payment Method
                </h2>
                <div className='flex flex-col'>
                  {PAYMENT_METHODS.map((method, idx) => {
                    const isSelected = selectedPayment === method.id;
                    return (
                      <div key={method.id}>
                        <label className='flex cursor-pointer items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-md overflow-hidden bg-white border border-neutral-300'>
                              <Image
                                src={method.logo}
                                alt={method.name}
                                className='h-full w-full object-contain'
                              />
                            </div>
                            <span className='text-sm md:text-md tracking-tight-2 text-neutral-950'>
                              {method.name}
                            </span>
                          </div>
                          <input
                            type='radio'
                            value={method.id}
                            {...register('paymentMethod')}
                            className='sr-only'
                          />
                          <Image
                            src={isSelected ? CheckTicked : CheckUnticked}
                            alt={isSelected ? 'Selected' : 'Not selected'}
                            className='h-6 w-6'
                          />
                        </label>
                        {idx !== PAYMENT_METHODS.length - 1 && (
                          <hr className='my-3 md:my-4 border-neutral-200' />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {errors.paymentMethod && (
                <p className='mt-2 text-xs text-error'>
                  {errors.paymentMethod.message}
                </p>
              )}

              {/* Dashed divider */}
              <div className='relative my-5'>
                <div className='absolute -left-3 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-neutral-100' />
                <div
                  className='w-full'
                  style={{
                    height: '1px',
                    backgroundImage:
                      'repeating-linear-gradient(to right, var(--color-neutral-300) 0px, var(--color-neutral-300) 4px, transparent 4px, transparent 8px)',
                  }}
                />
                <div className='absolute -right-3 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-neutral-100' />
              </div>
              {/* Summary */}
              <div className='flex flex-col gap-3 md:gap-4 px-4 md:px-5'>
                <h2 className='h-7.5 md:h-8 font-extrabold text-md md:text-lg md:tracking-tight-2 text-neutral-950'>
                  Payment Summary
                </h2>
                <div className='h-7 md:h-7.5 flex items-center justify-between'>
                  <span className='font-medium text-sm md:text-md md:tracking-tight-3 text-neutral-950'>
                    Price ({itemCount} items)
                  </span>
                  <span className='font-bold text-sm md:text-md tracking-tight-2 text-neutral-950'>
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className='h-7 md:h-7.5 flex justify-between'>
                  <span className='font-medium text-sm md:text-md md:tracking-tight-3 text-neutral-950'>
                    Delivery Fee
                  </span>
                  <span className='font-bold text-sm md:text-md tracking-tight-2 text-neutral-950'>
                    {formatCurrency(DELIVERY_FEE)}
                  </span>
                </div>
                <div className='h-7 md:h-7.5 flex justify-between'>
                  <span className='font-medium text-sm md:text-md md:tracking-tight-3 text-neutral-950'>
                    Service Fee
                  </span>
                  <span className='font-bold text-sm md:text-md tracking-tight-2 text-neutral-950'>
                    {formatCurrency(SERVICE_FEE)}
                  </span>
                </div>
                <div className='h-7.5 md:h-8 flex justify-between'>
                  <span className='text-md md:text-lg tracking-tight-2 md:tracking-none text-neutral-950'>
                    Total
                  </span>
                  <span className='font-extrabold text-md md:text-lg md:tracking-tight-2 text-neutral-950'>
                    {formatCurrency(total)}
                  </span>
                </div>
                <Button
                  type='submit'
                  variant={'default'}
                  size={'default'}
                  disabled={checkout.isPending || !isAddressValid}
                  className='hover-dim transition-colors disabled:cursor-not-allowed'
                >
                  {checkout.isPending ? 'Processing...' : 'Buy'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {showAddressModal && (
        <ChangeAddressModal
          initialAddress={deliveryAddress ?? ''}
          initialPhone={phone ?? ''}
          avatar={user?.avatar}
          onClose={() => setShowAddressModal(false)}
          onSave={(address, newPhone) => {
            setValue('deliveryAddress', address, { shouldValidate: true });
            setValue('phone', newPhone);
          }}
        />
      )}
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
