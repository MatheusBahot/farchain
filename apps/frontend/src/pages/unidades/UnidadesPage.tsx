import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Building2, MapPin } from 'lucide-react';
import { unidadesApi } from '@services/api';
import { Badge } from '@components/ui/Badge';
import { PageSpinner } from '@components/ui/Spinner';
import { EmptyState } from '@components/ui/EmptyState';
import type { UnidadeSaude } from '../../types';

export default function UnidadesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['unidades'],
    queryFn: () => unidadesApi.listar(),
  });

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-grafite-900 dark:text-white">Unidades de Saúde</h1>
        <p className="text-grafite-500 text-sm mt-0.5">Rede de unidades da assistência farmacêutica</p>
      </div>

      {!data?.length ? (
        <EmptyState icon={Building2} titulo="Nenhuma unidade cadastrada" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((u: UnidadeSaude, i: number) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card p-5 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20
                                flex items-center justify-center">
                  <Building2 size={18} className="text-primary-500" />
                </div>
                <div className="flex gap-2">
                  {u.ehCAF && <Badge variant="primary">CAF</Badge>}
                  <Badge variant={u.ativo ? 'success' : 'gray'}>{u.ativo ? 'Ativa' : 'Inativa'}</Badge>
                </div>
              </div>
              <h3 className="font-semibold text-grafite-900 dark:text-white mb-1">{u.nome}</h3>
              <p className="text-xs text-grafite-400 mb-3">{u.tipo}</p>
              <div className="flex items-center gap-1.5 text-xs text-grafite-500">
                <MapPin size={12} />
                {[u.bairro, u.municipio, u.uf].filter(Boolean).join(', ')}
              </div>
              {u.distrito && (
                <p className="text-xs text-grafite-400 mt-1.5">{u.distrito.nome}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
