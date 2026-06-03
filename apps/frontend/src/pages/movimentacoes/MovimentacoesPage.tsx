import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, ArrowLeftRight, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { movimentacoesApi, lotesApi, unidadesApi } from '@services/api';
import { Table } from '@components/ui/Table';
import { Pagination } from '@components/ui/Pagination';
import { Modal } from '@components/ui/Modal';
import { Badge } from '@components/ui/Badge';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { PageSpinner } from '@components/ui/Spinner';
import { EmptyState } from '@components/ui/EmptyState';
import { usePagination } from '@hooks/usePagination';
import type { Movimentacao } from '../../types';

const tiposMovimentacao = [
  { value: 'ENTRADA_ESTOQUE',     label: 'Entrada em Estoque' },
  { value: 'SAIDA_DISTRIBUICAO', label: 'Saída — Distribuição' },
  { value: 'TRANSFERENCIA_INTERNA', label: 'Transferência Interna' },
  { value: 'DEVOLUCAO_PACIENTE', label: 'Devolução do Paciente' },
  { value: 'DEVOLUCAO_FORNECEDOR', label: 'Devolução ao Fornecedor' },
  { value: 'PERDA',              label: 'Perda' },
  { value: 'DESCARTE',           label: 'Descarte' },
  { value: 'AJUSTE_INVENTARIO',  label: 'Ajuste de Inventário' },
];

const schema = z.object({
  loteId:         z.string().uuid('Selecione um lote'),
  tipo:           z.string().min(1, 'Tipo obrigatório'),
  quantidade:     z.number().int().positive('Quantidade deve ser positiva'),
  origemId:       z.string().optional(),
  destinoId:      z.string().optional(),
  justificativa:  z.string().optional(),
  documentoRef:   z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const tipoCorMap: Record<string, string> = {
  ENTRADA_ESTOQUE:      'success',
  SAIDA_DISTRIBUICAO:   'primary',
  TRANSFERENCIA_INTERNA:'teal',
  DEVOLUCAO_PACIENTE:   'warning',
  DEVOLUCAO_FORNECEDOR: 'warning',
  PERDA:                'danger',
  DESCARTE:             'danger',
  AJUSTE_INVENTARIO:    'gray',
};

export default function MovimentacoesPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const { pagina, limite, irParaPagina } = usePagination(20);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['movimentacoes', pagina],
    queryFn: () => movimentacoesApi.listar({ pagina, limite }),
  });

  const { data: lotes } = useQuery({
    queryKey: ['lotes', 'all-ativos'],
    queryFn: () => lotesApi.listar({ limite: 200, status: 'ATIVO' }),
  });

  const { data: unidades } = useQuery({
    queryKey: ['unidades', 'all'],
    queryFn: () => unidadesApi.listar(),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const criar = useMutation({
    mutationFn: movimentacoesApi.criar,
    onSuccess: () => {
      toast.success('Movimentação registrada e gravada no blockchain!');
      qc.invalidateQueries({ queryKey: ['movimentacoes'] });
      qc.invalidateQueries({ queryKey: ['lotes'] });
      setModalOpen(false);
      reset();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Erro ao registrar movimentação'),
  });

  const columns = [
    {
      key: 'tipo',
      label: 'Tipo',
      render: (row: Movimentacao) => (
        <Badge variant={(tipoCorMap[row.tipo] as any) ?? 'gray'}>
          {row.tipo.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      key: 'lote',
      label: 'Medicamento / Lote',
      render: (row: Movimentacao) => (
        <div>
          <p className="font-medium text-grafite-900 dark:text-white text-sm">
            {row.lote?.medicamento?.dcb ?? '—'}
          </p>
        </div>
      ),
    },
    {
      key: 'quantidade',
      label: 'Quantidade',
      render: (row: Movimentacao) => (
        <span className="font-semibold text-grafite-800 dark:text-white">
          {row.quantidade} un.
        </span>
      ),
    },
    {
      key: 'origem',
      label: 'Origem → Destino',
      render: (row: Movimentacao) => (
        <div className="text-sm text-grafite-500">
          {row.origem?.nome ?? '—'} → {row.destino?.nome ?? '—'}
        </div>
      ),
    },
    {
      key: 'usuario',
      label: 'Responsável',
      render: (row: Movimentacao) => (
        <span className="text-sm text-grafite-600 dark:text-grafite-400">
          {row.usuario?.nome ?? '—'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Data/Hora',
      render: (row: Movimentacao) => (
        <span className="text-xs text-grafite-400">
          {new Date(row.createdAt).toLocaleString('pt-BR')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-grafite-900 dark:text-white">Movimentações</h1>
          <p className="text-grafite-500 text-sm mt-0.5">
            Registro logístico com trilha blockchain imutável
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => refetch()} className="btn-ghost p-2.5 rounded-xl">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus size={16} /> Registrar Movimentação
          </button>
        </div>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : !data?.dados?.length ? (
        <div className="card">
          <EmptyState
            icon={ArrowLeftRight}
            titulo="Nenhuma movimentação registrada"
            descricao="Registre movimentações de lotes para manter o rastreamento completo."
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
        titulo="Registrar Movimentação" size="md">
        <form onSubmit={handleSubmit((d) => criar.mutate(d))} className="space-y-4">
          <Select
            label="Lote *"
            options={(lotes?.dados ?? []).map((l: any) => ({
              value: l.id,
              label: `${l.medicamento?.dcb} — ${l.numeroLote}`,
            }))}
            placeholder="Selecione o lote..."
            {...register('loteId')}
            error={errors.loteId?.message}
          />
          <Select
            label="Tipo de Movimentação *"
            options={tiposMovimentacao}
            placeholder="Selecione o tipo..."
            {...register('tipo')}
            error={errors.tipo?.message}
          />
          <Input
            label="Quantidade *" type="number" placeholder="Ex: 50"
            {...register('quantidade', { valueAsNumber: true })}
            error={errors.quantidade?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Unidade de Origem"
              options={(unidades ?? []).map((u: any) => ({ value: u.id, label: u.nome }))}
              placeholder="Selecione..."
              {...register('origemId')}
            />
            <Select
              label="Unidade de Destino"
              options={(unidades ?? []).map((u: any) => ({ value: u.id, label: u.nome }))}
              placeholder="Selecione..."
              {...register('destinoId')}
            />
          </div>
          <Input label="Justificativa" placeholder="Motivo da movimentação..."
            {...register('justificativa')} />
          <Input label="Documento de Referência" placeholder="NF, Ofício, etc..."
            {...register('documentoRef')} />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); reset(); }}
              className="btn-ghost flex-1">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center">
              {isSubmitting ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
