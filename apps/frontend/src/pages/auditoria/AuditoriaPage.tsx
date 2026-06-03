import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Shield, RefreshCw, Search } from 'lucide-react';
import { api } from '@services/api';
import { Table } from '@components/ui/Table';
import { Pagination } from '@components/ui/Pagination';
import { Badge } from '@components/ui/Badge';
import { Input } from '@components/ui/Input';
import { PageSpinner } from '@components/ui/Spinner';
import { usePagination } from '@hooks/usePagination';
import { useDebounce } from '@hooks/useDebounce';
import type { AuditLog } from '../../types';

export default function AuditoriaPage() {
  const [acao, setAcao] = useState('');
  const acaoDebounced = useDebounce(acao);
  const { pagina, limite, irParaPagina } = usePagination(30);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['auditoria', pagina, acaoDebounced],
    queryFn: () =>
      api.get('/auditoria', { params: { pagina, limite, acao: acaoDebounced } })
         .then(r => r.data.data),
  });

  const acoesAlto = ['LOGIN','LOGOUT','DISPENSACAO','BLOQUEIO_SANITARIO','RECOLHIMENTO'];

  const columns = [
    { key: 'timestamp', label: 'Data/Hora',
      render: (r: AuditLog) => (
        <span className="text-xs font-mono text-grafite-500">
          {new Date(r.timestamp).toLocaleString('pt-BR')}
        </span>
      )},
    { key: 'usuario', label: 'Usuário',
      render: (r: AuditLog) => (
        <div>
          <p className="text-sm font-medium text-grafite-900 dark:text-white">
            {r.usuario?.nome ?? 'Sistema'}
          </p>
          {r.usuario?.role && (
            <p className="text-xs text-grafite-400">{r.usuario.role}</p>
          )}
        </div>
      )},
    { key: 'acao', label: 'Ação',
      render: (r: AuditLog) => (
        <Badge variant={acoesAlto.includes(r.acao) ? 'warning' : 'gray'}>
          {r.acao}
        </Badge>
      )},
    { key: 'entidade', label: 'Entidade',
      render: (r: AuditLog) => (
        <span className="text-sm text-grafite-600 dark:text-grafite-400">{r.entidade}</span>
      )},
    { key: 'ip', label: 'IP',
      render: (r: AuditLog) => (
        <span className="font-mono text-xs text-grafite-400">{r.ip ?? '—'}</span>
      )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-grafite-900 dark:text-white flex items-center gap-2">
            <Shield size={22} className="text-primary-500" />
            Log de Auditoria
          </h1>
          <p className="text-grafite-500 text-sm mt-0.5">
            Trilha imutável de todas as ações críticas do sistema
          </p>
        </div>
        <button onClick={() => refetch()} className="btn-ghost p-2.5 rounded-xl">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="card p-4">
        <Input
          placeholder="Filtrar por ação (LOGIN, DISPENSACAO, etc)..."
          value={acao}
          onChange={e => { setAcao(e.target.value); irParaPagina(1); }}
          leftIcon={<Search size={16} />}
        />
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Table columns={columns} data={data?.dados ?? []} />
          </motion.div>
          {data && (
            <Pagination pagina={pagina} total={data.total} limite={limite} onChange={irParaPagina} />
          )}
        </>
      )}
    </div>
  );
}
