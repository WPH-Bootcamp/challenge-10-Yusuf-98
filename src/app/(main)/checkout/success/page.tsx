'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { formatCurrency } from '@/lib/utils';

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
    <div className='flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12'>
      <div className='w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl'>
        <div className='flex flex-col items-center px-6 pt-8 pb-4'>
          <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
            <CheckCircle className='h-10 w-10 text-accent-green' />
          </div>
          <h1 className='text-xl font-bold text-neutral-900'>
            Payment Success
          </h1>
          <p className='mt-1 text-center text-sm text-neutral-500'>
            Your payment has been successfully processed.
          </p>
        </div>

        <div className='mx-6 border-t border-dashed border-neutral-200' />

        <div className='space-y-3 px-6 py-5'>
          {[
            { label: 'Date', value: date },
            { label: 'Payment Method', value: paymentMethod, bold: true },
            { label: 'Price (items)', value: formatCurrency(subtotal) },
            { label: 'Delivery Fee', value: formatCurrency(deliveryFee) },
            { label: 'Service Fee', value: formatCurrency(serviceFee) },
          ].map(({ label, value, bold }) => (
            <div
              key={label}
              className='flex items-center justify-between text-sm'
            >
              <span className='text-neutral-500'>{label}</span>
              <span
                className={
                  bold ? 'font-bold text-neutral-900' : 'text-neutral-900'
                }
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className='mx-6 border-t border-dashed border-neutral-200' />

        <div className='flex items-center justify-between px-6 py-4'>
          <span className='font-semibold text-neutral-900'>Total</span>
          <span className='font-bold text-neutral-900'>
            {formatCurrency(total)}
          </span>
        </div>

        <div className='px-6 pb-6'>
          <Link
            href='/orders'
            onClick={clearPaymentSuccess}
            className='block w-full rounded-full bg-primary-100 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-primary-hover'
          >
            See My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
