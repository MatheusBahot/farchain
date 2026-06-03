import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  titulo: string;
  descricao?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, titulo, descricao, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-grafite-100 dark:bg-grafite-800 
                      flex items-center justify-center mb-4">
        <Icon size={28} className="text-grafite-400" />
      </div>
      <h3 className="font-semibold text-grafite-700 dark:text-grafite-300 mb-2">{titulo}</h3>
      {descricao && (
        <p className="text-grafite-400 text-sm max-w-sm">{descricao}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

