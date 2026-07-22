import { CartContent } from '@/components/features/cart/CartContent';

export default function CartPage() {
  return (
    <div className='custom-container min-h-screen items-center flex justify-center pt-20 md:pt-22 lg:pt-32'>
      <div className='flex flex-col gap-4 md:gap-8 w-full md:w-114 lg:w-200'>
        <CartContent />
      </div>
    </div>
  );
}
