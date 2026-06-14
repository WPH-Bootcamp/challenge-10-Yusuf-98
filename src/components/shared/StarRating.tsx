'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  starClassName?: string;
  containerClassName?: string;
}

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
  starClassName,
  containerClassName,
}: StarRatingProps) {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-4.5 w-4.5',
    lg: 'h-5 w-5',
  };

  return (
    <div className={cn('flex items-center gap-1.5', containerClassName)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type='button'
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          className={cn(
            'transition-transform',
            !readonly && 'cursor-pointer hover:scale-110',
            readonly && 'cursor-default'
          )}
          aria-label={`${star} star`}
        >
          <Star
            className={cn(
              starClassName ?? sizeMap[size],
              star <= value
                ? 'fill-star text-star'
                : 'fill-neutral-400 text-neutral-400'
            )}
          />
        </button>
      ))}
    </div>
  );
}
