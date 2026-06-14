import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import type { CartItem } from '@/types';

function CartItemRow({
  item,
  placeholder,
  onUpdate,
  isUpdating,
}: {
  item: CartItem;
  placeholder: string;
  onUpdate: (id: string, qty: number) => void;
  isUpdating: boolean;
}) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-4.25'>
        <div className='relative h-16 md:h-20 w-16 md:w-20 shrink-0 overflow-hidden rounded-xl'>
          <Image
            src={item.menu?.image ?? placeholder}
            alt={item.menu?.foodName ?? 'Food'}
            fill
            className='object-cover'
            unoptimized
          />
        </div>
        <div className='flex flex-col justify-center'>
          <p className='h-7 md:h-7.5 flex items-center text-sm md:text-md font-medium md:tracking-tight-3 text-neutral-950'>
            {item.menu?.foodName}
          </p>
          <p className='h-7.5 md:h-8 text-md md:text-lg md:tracking-tight-2 font-extrabold text-neutral-950'>
            {formatCurrency(item.menu?.price ?? 0)}
          </p>
        </div>
      </div>

      <div
        className='flex items-center justify-between shrink-0'
        style={{
          width: 'clamp(114px, 9.4vw + 76.6px, 123px)',
          height: 'clamp(36px, 0.4vw + 34.4px, 40px)',
        }}
      >
        <button
          type='button'
          onClick={() => onUpdate(String(item.id), item.quantity - 1)}
          disabled={isUpdating}
          className='flex items-center justify-center rounded-full border border-neutral-300 text-neutral-950 shrink-0 disabled:opacity-50'
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
          style={{ fontSize: 'clamp(14px, 0.6vw + 11.6px, 20px)' }}
        >
          {item.quantity}
        </span>
        <button
          type='button'
          onClick={() => onUpdate(String(item.id), item.quantity + 1)}
          disabled={isUpdating}
          className='flex items-center justify-center rounded-full bg-primary-100 text-white hover:bg-primary-hover shrink-0 disabled:opacity-50'
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
    </div>
  );
}

export default CartItemRow;
