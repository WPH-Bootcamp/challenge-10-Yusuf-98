'use client';

import next from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LogoColor from '@/assets/images/logo-color.png';
import SuccesGreen from '@/assets/icons/success-green.png';
import { useUIStore } from '@/store/ui.store';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { paymentSuccessData, clearPaymentSuccess } = useUIStore();

  useEffect(() => {
    if (!paymentSuccessData) {
      router.replace('/orders');
    }
  }, [paymentSuccessData, router]);

  if (!paymentSuccessData) return null;

  const { date, paymentMethod, subtotal, deliveryFee, serviceFee, total } =
    paymentSuccessData;

  return (
    <div className='flex flex-col min-h-screen items-center justify-center '>
      <Image src={LogoColor} alt='Logo Foody' className='w-37.25 h-10.5' />
      <div className='w-90.25 md:w-99 lg:w-107 overflow-hidden rounded-2xl p-4 md:p-5 mt-7 bg-white shadow-card'>
        <div className='flex flex-col items-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full'>
            <Image src={SuccesGreen} alt='Success Buy' className='h-16 w-16' />
          </div>
          <h1 className='h-8 md:h-8.5 text-lg md:text-xl tracking-tight-2 md:tracking-none font-extrabold text-neutral-950 mt-1.75'>
            Payment Success
          </h1>
          <p className='h-7 md:h-7.5 text-center text-sm md:text-md tracking-tight-2 text-neutral-950 mt-0.5 md:mt-0'>
            Your payment has been successfully processed.
          </p>
        </div>

        {/* Dashed divider */}
        <div className='relative my-3.5'>
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

        <div className='flex flex-col gap-6 md:gap-4'>
          {[
            { label: 'Date', value: date },
            { label: 'Payment Method', value: paymentMethod },
            { label: 'Price (items)', value: formatCurrency(subtotal) },
            { label: 'Delivery Fee', value: formatCurrency(deliveryFee) },
            { label: 'Service Fee', value: formatCurrency(serviceFee) },
          ].map(({ label, value }) => (
            <div key={label} className='flex items-center justify-between'>
              <span className=' font-medium text-sm md:text-md md:tracking-tight-3 text-neutral-950'>
                {label}
              </span>
              <span className='font-semibold text-sm tracking-tight-2 md:font-bold md:text-md text-neutral-950'>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Dashed divider */}
        <div className='relative my-4'>
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

        <div className='h-7.5 md:h-8 flex items-center justify-between'>
          <span className='text-md tracking-tight-2 md:text-lg md:tracking-none text-neutral-950'>
            Total
          </span>
          <span className='font-extrabold text-md md:text-lg tracking-tight-2 text-neutral-950'>
            {formatCurrency(total)}
          </span>
        </div>

        <div className=''>
          <Link
            href='/orders'
            onClick={clearPaymentSuccess}
            className='flex items-center justify-center w-full h-11 md:h-12 rounded-full bg-primary-100 text-center text-md font-bold tracking-tight-2 text-neutral-25 transition-colors hover-dim mt-5'
          >
            See My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
