import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { farmacovigilanciaApi, lotesApi } from '@services/api';
import { Table } from '@components/ui/Table';
import { Pagination } from '@components/ui/Pagination';
import { Modal } from '@components/ui/Modal';
import { Badge, BadgeGravidade } from '@components/ui/Badge';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { PageSpinner } from '@components/ui/Spinner';
import { EmptyState } from '@components/ui/EmptyState';
import { usePagination } from '@hooks/usePagination';
import type { FarmacoVigilancia } from '../../types';

const schema = z.object({
  loteId:         z.string().uuid('Selecione um lote'),
  tipoEvento:     z.string().min(1, 'Tipo obrigatório'),
  descricao:      z.string().min(10, 'Descrição mínima de 10 caracteres'),
  gravidade:      z.string().min(1, 'Gravidade obrigatória'),
  dataOcorrencia: z.string().min(1, 'Data obrigatória'),
  acaoTomada:     z.string().optional(),
  notificacaoRef: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const tiposEvento = [
  { value: 'RAM', label: 'Reação Adversa (RAM)' },
  { value: 'Queixa Técnica', label: 'Queixa Técnica' },
  { value: 'Desvio de Qualidade', label: 'Desvio de Qualidade' },
  { value: 'Falha Terapêutica', label: 'Falha Terapêutica' },
  { value: 'Suspeita de Falsificação', label: 'Suspeita de Falsificação' },
];

const gravidadeOpts = [
  { value: 'Leve', label: 'Leve' },
  { value: 'Moderado', label: 'Moderado' },
  { value: 'Grave', label: 'Grave' },
  { value: 'Fatal', label: 'Fatal' },
];

const statusMap: Record<string, string> = {
  ABERTO:           'warning',
  EM_INVESTIGACAO:  'primary',
  ENCERRADO:        'success',
  NOTIFICADO_ANVISA:'teal',
};

export default function FarmacovigilanciaPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const { pagina, limite, irParaPagina } = usePagination(15);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['farmacovigilancia', pagina],
    queryFn: () => farmacovigilanciaApi.listar({ pagina, limite }),
  });

  const { data: stats } = useQuery({
    queryKey: ['farmacovigilancia', 'stats'],
    queryFn: farmacovigilanciaApi.estatisticas,
  });

  const { data: lotes } = useQuery({
    queryKey: ['lotes', 'all-ativos'],
    queryFn: () => lotesApi.listar({ limite: 200, status: 'ATIVO' }),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const registrar = useMutation({
    mutationFn: farmacovigilanciaApi.registrar,
    onSuccess: () => {
      toast.success('Evento de farmacovigilância registrado!');
      qc.invalidateQueries({ queryKey: ['farmacovigilancia'] });
      setModalOpen(false);
      reset();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Erro ao registrar'),
  });

  const columns = [
    {
      key: 'tipoEvento',
      label: 'Tipo',
      render: (row: FarmacoVigilancia) => (
        <Badge variant="warning">{row.tipoEvento}</Badge>
      ),
    },
    {
      key: 'lote',
      label: 'Medicamento / Lote',
      render: (row: FarmacoVigilancia) => (
        <div>
          <p className="font-medium text-sm text-grafite-900 dark:text-white">
            {row.lote?.medicamento?.dcb ?? '—'}
          </p>
          <p className="text-xs text-grafite-400">{row.lote?.numeroLote}</p>
        </div>
      ),
    },
    {
      key: 'descricao',
      label: 'Descrição',
      render: (row: FarmacoVigilancia) => (
        <p className="text-sm text-grafite-600 dark:text-grafite-400 max-w-xs truncate">
          {row.descricao}
        </p>
      ),
    },
    {
      key: 'gravidade',
      label: 'Gravidade',
      render: (row: FarmacoVigilancia) => <BadgeGravidade gravidade={row.gravidade} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: FarmacoVigilancia) => (
        <Badge variant={(statusMap[row.status] as any) ?? 'gray'} dot>
          {row.status.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      key: 'dataCadastro',
      label: 'Data',
      render: (row: FarmacoVigilancia) => (
        <span className="text-xs text-grafite-400">
          {new Date(row.dataCadastro).toLocaleDateString('pt-BR')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-grafite-900 dark:text-white flex items-center gap-2">
            <AlertTriangle size={22} className="text-warning-500" />
            Farmacovigilância
          </h1>
          <p className="text-grafite-500 text-sm mt-0.5">
            Registro de RAM, queixas técnicas e eventos adversos
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => refetch()} className="btn-ghost p-2.5 rounded-xl">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus size={16} /> Registrar Evento
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-grafite-900 dark:text-white">{stats.total}</p>
            <p className="text-xs text-grafite-400 mt-1">Total de eventos</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-warning-500">{stats.abertos}</p>
            <p className="text-xs text-grafite-400 mt-1">Abertos</p>
          </div>
          {stats.porGravidade?.map((g: any) => (
            <div key={g.gravidade} className="card p-4 text-center">
              <p className="text-2xl font-bold text-grafite-900 dark:text-white">{g._count}</p>
              <p className="text-xs text-grafite-400 mt-1">{g.gravidade}</p>
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <PageSpinner />
      ) : !data?.dados?.length ? (
        <div className="card">
          <EmptyState
            icon={AlertTriangle}
            titulo="Nenhum evento registrado"
            descricao="Registre eventos de farmacovigilância para manter o controle de segurança."
          />
        </div>
      ) : (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Table columns={columns} data={data.dados} />
          </motion.div>
          <Pagination pagina={pagina} total={data.total} limite={limite} onChange={irParaPagina} />
        </>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); reset(); }}
        titulo="Registrar Evento de Farmacovigilância" size="lg">
        <form onSubmit={handleSubmit((d) => registrar.mutate(d))} className="space-y-4">
          <Select
            label="Lote Relacionado *"
            options={(lotes?.dados ?? []).map((l: any) => ({
              value: l.id,
              label: `${l.medicamento?.dcb} — ${l.numeroLote}`,
            }))}
            placeholder="Selecione o lote..."
            {...register('loteId')}
            error={errors.loteId?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Tipo de Evento *" options={tiposEvento}
              placeholder="Selecionar tipo..." {...register('tipoEvento')}
              error={errors.tipoEvento?.message} />
            <Select label="Gravidade *" options={gravidadeOpts}
              placeholder="Selecionar gravidade..." {...register('gravidade')}
              error={errors.gravidade?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-1.5">
              Descrição Detalhada *
            </label>
            <textarea
              {...register('descricao')}
              rows={4}
              placeholder="Descreva o evento de forma detalhada..."
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-grafite-300 
                         dark:border-grafite-600 bg-white dark:bg-grafite-800 
                         text-grafite-900 dark:text-grafite-100 resize-none
                         focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
            {errors.descricao && (
              <p className="text-xs text-danger-500 mt-1">{errors.descricao.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Data da Ocorrência *" type="date"
              {...register('dataOcorrencia')} error={errors.dataOcorrencia?.message} />
            <Input label="Nº Notificação ANVISA" placeholder="Ex: NOT-2024-12345"
              {...register('notificacaoRef')} />
          </div>
          <Input label="Ação Tomada" placeholder="Descreva a ação imediata tomada..."
            {...register('acaoTomada')} />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); reset(); }}
              className="btn-ghost flex-1">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center">
              {isSubmitting ? 'Registrando...' : 'Registrar Evento'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
