import { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, className, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-grafite-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200',
            'bg-white dark:bg-grafite-800',
            'border text-grafite-900 dark:text-grafite-100',
            'placeholder-grafite-400 dark:placeholder-grafite-500',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            leftIcon && 'pl-10',
            error
              ? 'border-danger-400 focus:ring-danger-500/30 focus:border-danger-400'
              : 'border-grafite-300 dark:border-grafite-600 focus:ring-primary-500/20 focus:border-primary-500',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger-500">{error}</p>}
      {hint && !error && <p className="text-xs text-grafite-400">{hint}</p>}
    </div>
  ),
);
Input.displayName = 'Input';
