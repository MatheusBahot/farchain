import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Map, Building2, Users } from 'lucide-react';
import { distritosApi } from '@services/api';
import { PageSpinner } from '@components/ui/Spinner';
import type { DistritoSanitario } from '../../types';

export default function DistritosPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['distritos'],
    queryFn: distritosApi.listar,
  });

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-grafite-900 dark:text-white flex items-center gap-2">
          <Map size={22} className="text-teal-500" />
          Distritos Sanitários
        </h1>
        <p className="text-grafite-500 text-sm mt-0.5">
          12 Distritos Sanitários de Salvador, BA
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data ?? []).map((d: DistritoSanitario, i: number) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card p-5 hover:shadow-card-hover transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20
                              flex items-center justify-center font-display font-bold text-teal-500">
                {d.codigo}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-grafite-400">
                <Building2 size={12} />
                {d._count?.unidades ?? 0} unidades
              </div>
            </div>
            <h3 className="font-semibold text-grafite-900 dark:text-white text-sm mb-1">{d.nome}</h3>
            <p className="text-xs text-grafite-400">{d.municipio} — BA</p>
            {d.populacao && (
              <div className="flex items-center gap-1.5 mt-3 text-xs text-grafite-500">
                <Users size={12} />
                {d.populacao.toLocaleString('pt-BR')} habitantes
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
