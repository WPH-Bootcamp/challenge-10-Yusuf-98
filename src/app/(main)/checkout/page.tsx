import { Suspense } from 'react';
import { CheckoutClient } from '@/components/features/checkout/CheckoutClient';

export default function CheckoutPage() {
  return (
    <div className='custom-container min-h-screen items-center flex justify-center pt-20 md:pt-22 lg:pt-32 mb-12 md:mb-25'>
      <Suspense>
        <CheckoutClient />
      </Suspense>
    </div>
  );
}
