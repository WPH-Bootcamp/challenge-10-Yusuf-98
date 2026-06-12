import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-primary-100 rounded-full text-md -tracking-2 font-bold text-neutral-25 hover:bg-primary-hover focus-visible:ring-primary-100 active:scale-101',
        outline:
          'bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] rounded-xl text-neutral-950 font-bold tracking-tight-2 hover:bg-gray-50 focus-visible:ring-gray-400',
        ghost:
          'bg-transparent text-neutral-600 font-medium md:tracking-tight-3 hover:bg-gray-100 focus-visible:ring-gray-400',
        secondary:
          'bg-white text-neutral-950 font-bold tracking-tight-2 rounded-full hover:bg-neutral-400 focus-visible:ring-neutral-600',
        outlineGhost:
          'bg-transparent text-white font-bold tracking-tight-2 rounded-full border border-0.5 border-neutral-300 hover:bg-primary-100 focus-visible:ring-red-500',
        link: 'text-primary-100 underline-offset-4 hover:underline p-0 h-auto rounded-none',
      },
      size: {
        sm: 'h-9 md:h-10 py-2 px-3 gap-2 text-sm md:text-md',
        md: 'h-10 py-2 px-3 gap-2 text-sm md:text-md',
        default: 'h-12 px-2 py-2 gap-2',
        lg: 'h-10 md:h-12 p-2 gap-2 text-sm md:text-md',
        xl: 'h-14 px-10 text-base',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className='h-4 w-4 animate-spin'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
              />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
