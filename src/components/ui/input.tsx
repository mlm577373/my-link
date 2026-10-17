import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm transition-all outline-none',
          'focus:border-indigo-400 focus:bg-white/[0.08] focus:ring-2 focus:ring-indigo-400/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
