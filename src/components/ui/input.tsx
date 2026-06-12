import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      rightIcon,
      placeholder,
      onChange,
      onFocus,
      onBlur,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const innerRef = React.useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(
      Boolean(value || defaultValue)
    );

    // Merge refs
    const mergedRef = (node: HTMLInputElement | null) => {
      (innerRef as React.MutableRefObject<HTMLInputElement | null>).current =
        node;
      if (typeof ref === 'function') ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    };

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setHasValue(e.target.value.length > 0);
      onChange?.(e);
    }

    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
      setIsFocused(true);
      // Cek value saat focus
      setHasValue(e.target.value.length > 0);
      onFocus?.(e);
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      setIsFocused(false);
      // Cek value saat blur
      setHasValue(e.target.value.length > 0);
      onBlur?.(e);
    }

    // Sync controlled value
    React.useEffect(() => {
      if (value !== undefined) {
        setHasValue(Boolean(value));
      }
    }, [value]);

    // Cek value dari DOM saat mount (untuk uncontrolled)
    React.useEffect(() => {
      if (innerRef.current) {
        setHasValue(innerRef.current.value.length > 0);
      }
    }, []);

    const floated = isFocused || hasValue;

    return (
      <div className='w-full'>
        <div className='relative'>
          <input
            type={type}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            ref={mergedRef}
            style={{
              paddingTop: floated ? '20px' : '0px',
              paddingBottom: floated ? '4px' : '0px',
              paddingLeft: '12px',
              paddingRight: rightIcon ? '40px' : '12px',
            }}
            className={cn(
              'w-full h-12 md:h-14 rounded-xl md:rounded-lg border border-neutral-300 bg-white font-semibold text-sm md:text-md text-neutral-950 tracking-tight-2 transition-all placeholder-transparent',
              'focus:border-primary-100 focus:outline-none focus:ring-1 focus:ring-primary-100/15',
              'disabled:cursor-not-allowed disabled:opacity-50',
              rightIcon && 'pr-10',
              error && 'border-error focus:border-error focus:ring-error/15',
              className
            )}
            placeholder={placeholder}
            {...props}
          />
          {/* Floating label */}
          <label
            style={{
              position: 'absolute',
              left: '12px',
              top: floated ? '8px' : '50%',
              transform: floated ? 'none' : 'translateY(-50%)',
              fontSize: floated ? '12px' : '14px',
              lineHeight: '1',
              letterSpacing: '-0.02em',
              color: '#717680',
              pointerEvents: 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {placeholder}
          </label>
          {rightIcon && (
            <span className='absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500'>
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className='mt-1.5 text-xs text-error' role='alert'>
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
