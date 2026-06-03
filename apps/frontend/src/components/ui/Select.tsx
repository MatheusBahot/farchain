import { forwardRef } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={clsx(
            'w-full px-4 py-2.5 pr-10 rounded-xl text-sm appearance-none',
            'bg-white dark:bg-grafite-800',
            'border text-grafite-900 dark:text-grafite-100',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
            'transition-all duration-200 cursor-pointer',
            error
              ? 'border-danger-400'
              : 'border-grafite-300 dark:border-grafite-600',
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-grafite-400 pointer-events-none"
        />
      </div>
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  ),
);
Select.displayName = 'Select';
