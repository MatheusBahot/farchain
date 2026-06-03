import clsx from 'clsx';

interface SpinnerProps { size?: 'sm' | 'md' | 'lg'; className?: string; }

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={clsx(
      'border-4 border-primary-500 border-t-transparent rounded-full animate-spin',
      sizes[size], className,
    )} />
  );
}

export function PageSpinner() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-64">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-3" />
        <p className="text-grafite-400 text-sm">Carregando...</p>
      </div>
    </div>
  );
}
