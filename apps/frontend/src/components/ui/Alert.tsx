import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

type AlertType = 'success' | 'warning' | 'error' | 'info';

const config = {
  success: { icon: CheckCircle2, bg: 'bg-success-500/10 border-success-500/20', text: 'text-success-700 dark:text-success-400' },
  warning: { icon: AlertTriangle, bg: 'bg-warning-500/10 border-warning-500/20', text: 'text-warning-700 dark:text-warning-400' },
  error:   { icon: XCircle,       bg: 'bg-danger-500/10 border-danger-500/20',   text: 'text-danger-700 dark:text-danger-400'   },
  info:    { icon: Info,          bg: 'bg-primary-500/10 border-primary-500/20', text: 'text-primary-700 dark:text-primary-400' },
};

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  dismissible?: boolean;
}

export function Alert({ type = 'info', title, message, dismissible }: AlertProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  const { icon: Icon, bg, text } = config[type];

  return (
    <div className={clsx('flex items-start gap-3 p-4 rounded-xl border', bg)}>
      <Icon size={18} className={clsx('shrink-0 mt-0.5', text)} />
      <div className="flex-1 min-w-0">
        {title && <p className={clsx('font-semibold text-sm mb-1', text)}>{title}</p>}
        <p className="text-sm text-grafite-600 dark:text-grafite-400">{message}</p>
      </div>
      {dismissible && (
        <button onClick={() => setVisible(false)} className="text-grafite-400 hover:text-grafite-600 shrink-0">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
