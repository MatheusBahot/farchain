import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { dashboardApi } from '@services/api';
import {
  Package, Pill, Link2, AlertTriangle, Syringe,
  Building2, TrendingUp, Clock,
} from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  icon: React.ElementType;
  cor?: 'primary' | 'teal' | 'warning' | 'danger';
  delay?: number;
}

function StatCard({ titulo, valor, subtitulo, icon: Icon, cor = 'primary', delay = 0 }: StatCardProps) {
  const corMap = {
    primary: 'bg-primary-500/10 border-primary-500/20 text-primary-400',
    teal: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
    warning: 'bg-warning-500/10 border-warning-500/20 text-warning-400',
    danger: 'bg-danger-500/10 border-danger-500/20 text-danger-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-grafite-500 dark:text-grafite-400 text-sm">{titulo}</p>
          <p className="text-3xl font-bold text-grafite-900 dark:text-white mt-1">{valor}</p>
          {subtitulo && (
            <p className="text-xs text-grafite-500 mt-1">{subtitulo}</p>
          )}
        </div>
        <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center border', corMap[cor])}>
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data: resumo, isLoading } = useQuery({
    queryKey: ['dashboard', 'resumo'],
    queryFn: dashboardApi.resumo,
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-grafite-900 dark:text-white">
          Dashboard FarChain
        </h1>
        <p className="text-grafite-500 text-sm mt-1">
          Visão geral da plataforma de rastreabilidade farmacêutica CEAF/SUS
        </p>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          titulo="Medicamentos Ativos"
          valor={resumo?.medicamentos?.total ?? 0}
          subtitulo="CEAF cadastrados"
          icon={Pill}
          cor="primary"
          delay={0}
        />
        <StatCard
          titulo="Lotes Ativos"
          valor={resumo?.lotes?.ativos ?? 0}
          subtitulo={`de ${resumo?.lotes?.total ?? 0} total`}
          icon={Package}
          cor="teal"
          delay={0.05}
        />
        <StatCard
          titulo="Dispensações"
          valor={resumo?.dispensacoes?.total ?? 0}
          subtitulo={`${resumo?.dispensacoes?.ultimos30Dias ?? 0} nos últimos 30 dias`}
          icon={Syringe}
          cor="primary"
          delay={0.1}
        />
        <StatCard
          titulo="Blocos Blockchain"
          valor={resumo?.blockchain?.totalBlocos ?? 0}
          subtitulo="Eventos imutáveis"
          icon={Link2}
          cor="teal"
          delay={0.15}
        />
        <StatCard
          titulo="Lotes Vencendo"
          valor={resumo?.lotes?.vencendo30Dias ?? 0}
          subtitulo="Próximos 30 dias"
          icon={Clock}
          cor="warning"
          delay={0.2}
        />
        <StatCard
          titulo="Farmacovigilância"
          valor={resumo?.farmacovigilancia?.abertos ?? 0}
          subtitulo={`de ${resumo?.farmacovigilancia?.total ?? 0} total`}
          icon={AlertTriangle}
          cor="danger"
          delay={0.25}
        />
        <StatCard
          titulo="Unidades de Saúde"
          valor={resumo?.unidades?.total ?? 0}
          subtitulo="Ativas na rede"
          icon={Building2}
          cor="primary"
          delay={0.3}
        />
        <StatCard
          titulo="Estoque Baixo"
          valor={resumo?.alertas?.estoqueBaixo ?? 0}
          subtitulo="Lotes ≤ 10 unidades"
          icon={TrendingUp}
          cor="warning"
          delay={0.35}
        />
      </div>

      {/* Placeholder para gráficos — Etapa 3 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-grafite-900 dark:text-white mb-4">
            Dispensações por Mês
          </h3>
          <div className="h-48 flex items-center justify-center bg-grafite-50 dark:bg-grafite-800/50 rounded-xl">
            <p className="text-grafite-400 text-sm">Gráfico disponível na Etapa 3</p>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-grafite-900 dark:text-white mb-4">
            Top Medicamentos Dispensados
          </h3>
          <div className="h-48 flex items-center justify-center bg-grafite-50 dark:bg-grafite-800/50 rounded-xl">
            <p className="text-grafite-400 text-sm">Gráfico disponível na Etapa 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
