import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface PaginationProps {
  pagina: number;
  total: number;
  limite: number;
  onChange: (p: number) => void;
}

export function Pagination({ pagina, total, limite, onChange }: PaginationProps) {
  const totalPaginas = Math.ceil(total / limite);
  if (totalPaginas <= 1) return null;

  const inicio = (pagina - 1) * limite + 1;
  const fim = Math.min(pagina * limite, total);

  const pages = Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
    if (totalPaginas <= 5) return i + 1;
    if (pagina <= 3) return i + 1;
    if (pagina >= totalPaginas - 2) return totalPaginas - 4 + i;
    return pagina - 2 + i;
  });

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-grafite-500">
        {inicio}–{fim} de {total} registros
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(pagina - 1)}
          disabled={pagina === 1}
          className="p-2 rounded-lg text-grafite-400 hover:bg-grafite-100 dark:hover:bg-grafite-800
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={clsx(
              'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
              p === pagina
                ? 'bg-primary-600 text-white'
                : 'text-grafite-600 dark:text-grafite-400 hover:bg-grafite-100 dark:hover:bg-grafite-800',
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(pagina + 1)}
          disabled={pagina === totalPaginas}
          className="p-2 rounded-lg text-grafite-400 hover:bg-grafite-100 dark:hover:bg-grafite-800
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
