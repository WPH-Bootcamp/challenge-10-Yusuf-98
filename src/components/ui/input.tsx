import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, error, label, leftIcon, rightIcon, id, ...props },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
    return (
      <div className='w-full'>
        {label && (
          <label
            htmlFor={inputId}
            className='mb-1.5 block text-sm font-medium text-gray-700'
          >
            {label}
          </label>
        )}
        <div className='relative'>
          {leftIcon && (
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              'w-full rounded-xl border border-[#E9EAEB] bg-white px-4 py-3 text-sm text-[#1B1D27] placeholder:text-[#A4A7AE] transition-colors',
              'focus:border-[#C12116] focus:outline-none focus:ring-2 focus:ring-[#C12116]/15',
              'disabled:cursor-not-allowed disabled:bg-[#F5F5F5] disabled:text-[#A4A7AE]',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <span className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'>
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className='mt-1.5 text-xs text-red-600' role='alert'>
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
