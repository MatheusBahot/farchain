import clsx from 'clsx';

type Variant = 'success' | 'warning' | 'danger' | 'primary' | 'teal' | 'gray';

const variants: Record<Variant, string> = {
  success: 'bg-success-500/10 text-success-600 dark:text-success-400 border-success-500/20',
  warning: 'bg-warning-500/10 text-warning-600 dark:text-warning-400 border-warning-500/20',
  danger:  'bg-danger-500/10 text-danger-600 dark:text-danger-400 border-danger-500/20',
  primary: 'bg-primary-500/10 text-primary-700 dark:text-primary-400 border-primary-500/20',
  teal:    'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20',
  gray:    'bg-grafite-500/10 text-grafite-600 dark:text-grafite-400 border-grafite-500/20',
};

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ variant = 'gray', children, className, dot }: BadgeProps) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
      variants[variant],
      className,
    )}>
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full',
          variant === 'success' ? 'bg-success-500' :
          variant === 'warning' ? 'bg-warning-500' :
          variant === 'danger'  ? 'bg-danger-500'  :
          variant === 'teal'    ? 'bg-teal-500'    :
          variant === 'primary' ? 'bg-primary-500' : 'bg-grafite-500'
        )} />
      )}
      {children}
    </span>
  );
}

// Mapeamentos específicos do domínio
export function BadgeStatusLote({ status }: { status: string }) {
  const map: Record<string, { variant: Variant; label: string }> = {
    ATIVO:      { variant: 'success', label: 'Ativo' },
    QUARENTENA: { variant: 'warning', label: 'Quarentena' },
    BLOQUEADO:  { variant: 'danger',  label: 'Bloqueado' },
    VENCIDO:    { variant: 'danger',  label: 'Vencido' },
    RECOLHIDO:  { variant: 'danger',  label: 'Recolhido' },
    DESCARTADO: { variant: 'gray',    label: 'Descartado' },
    DEVOLVIDO:  { variant: 'gray',    label: 'Devolvido' },
  };
  const cfg = map[status] ?? { variant: 'gray', label: status };
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>;
}

export function BadgeClasseCEAF({ classe }: { classe: string }) {
  const map: Record<string, { variant: Variant; label: string }> = {
    COMPONENTE_I_A: { variant: 'primary', label: 'Comp. I-A' },
    COMPONENTE_I_B: { variant: 'teal',    label: 'Comp. I-B' },
    COMPONENTE_II:  { variant: 'warning', label: 'Comp. II'  },
    COMPONENTE_III: { variant: 'gray',    label: 'Comp. III' },
  };
  const cfg = map[classe] ?? { variant: 'gray', label: classe };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export function BadgeGravidade({ gravidade }: { gravidade: string }) {
  const map: Record<string, Variant> = {
    Leve: 'success', Moderado: 'warning', Grave: 'danger', Fatal: 'danger',
  };
  return <Badge variant={map[gravidade] ?? 'gray'}>{gravidade}</Badge>;
}
