import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Syringe, RefreshCw, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { dispensacoesApi, lotesApi, medicamentosApi, unidadesApi } from '@services/api';
import { Table } from '@components/ui/Table';
import { Pagination } from '@components/ui/Pagination';
import { Modal } from '@components/ui/Modal';
import { Alert } from '@components/ui/Alert';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { PageSpinner } from '@components/ui/Spinner';
import { EmptyState } from '@components/ui/EmptyState';
import { usePagination } from '@hooks/usePagination';
import type { Dispensacao } from '../../types';

const schema = z.object({
  loteId:           z.string().uuid('Selecione um lote'),
  medicamentoId:    z.string().uuid('Selecione um medicamento'),
  cpfPaciente:      z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos'),
  cartaoSusPaciente:z.string().optional(),
  unidadeId:        z.string().uuid('Selecione a unidade'),
  quantidade:       z.number().int().positive(),
  dosagem:          z.string().optional(),
  duracaoTratamento:z.string().optional(),
  cid10:            z.string().optional(),
  prescricaoRef:    z.string().optional(),
  observacoes:      z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function DispensacoesPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const { pagina, limite, irParaPagina } = usePagination(15);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dispensacoes', pagina],
    queryFn: () => dispensacoesApi.listar({ pagina, limite }),
  });

  const { data: stats } = useQuery({
    queryKey: ['dispensacoes', 'stats'],
    queryFn: dispensacoesApi.estatisticas,
  });

  const { data: lotes }        = useQuery({ queryKey: ['lotes','ativos'], queryFn: () => lotesApi.listar({ limite: 200, status: 'ATIVO' }) });
  const { data: medicamentos } = useQuery({ queryKey: ['meds','all'],    queryFn: () => medicamentosApi.listar({ limite: 200 }) });
  const { data: unidades }     = useQuery({ queryKey: ['unidades','all'],queryFn: () => unidadesApi.listar() });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const dispensar = useMutation({
    mutationFn: dispensacoesApi.dispensar,
    onSuccess: () => {
      toast.success('Dispensação registrada! CPF anonimizado conforme LGPD.');
      qc.invalidateQueries({ queryKey: ['dispensacoes'] });
      setModalOpen(false);
      reset();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Erro ao dispensar'),
  });

  const columns = [
    { key: 'medicamento', label: 'Medicamento',
      render: (r: Dispensacao) => (
        <div>
          <p className="font-medium text-sm text-grafite-900 dark:text-white">
            {r.medicamento?.dcb ?? '—'}
          </p>
          <p className="text-xs text-grafite-400">Lote: {r.lote?.numeroLote}</p>
        </div>
      )},
    { key: 'quantidade', label: 'Qtd.',
      render: (r: Dispensacao) => <span className="font-semibold">{r.quantidade} un.</span> },
    { key: 'unidade', label: 'Unidade',
      render: (r: Dispensacao) => <span className="text-sm text-grafite-600 dark:text-grafite-400">{r.unidade?.nome}</span> },
    { key: 'usuario', label: 'Farmacêutico',
      render: (r: Dispensacao) => <span className="text-sm">{r.usuario?.nome ?? '—'}</span> },
    { key: 'dataDispensacao', label: 'Data',
      render: (r: Dispensacao) => (
        <span className="text-xs text-grafite-400">
          {new Date(r.dataDispensacao).toLocaleString('pt-BR')}
        </span>
      )},
    { key: 'lgpd', label: 'Paciente',
      render: () => (
        <span className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400">
          <Shield size={11} /> Anonimizado
        </span>
      )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-grafite-900 dark:text-white flex items-center gap-2">
            <Syringe size={22} className="text-teal-500" />
            Dispensações
          </h1>
          <p className="text-grafite-500 text-sm mt-0.5">
            Dispensação ao paciente com proteção de dados LGPD
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => refetch()} className="btn-ghost p-2.5 rounded-xl">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus size={16} /> Dispensar
          </button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-grafite-900 dark:text-white">{stats.total}</p>
            <p className="text-xs text-grafite-400 mt-1">Total de dispensações</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-primary-500">{stats.ultimos30dias}</p>
            <p className="text-xs text-grafite-400 mt-1">Últimos 30 dias</p>
          </div>
          <div className="card p-4 text-center flex items-center justify-center gap-2">
            <Shield size={20} className="text-teal-500" />
            <div>
              <p className="text-sm font-bold text-teal-600 dark:text-teal-400">LGPD</p>
              <p className="text-xs text-grafite-400">CPF anonimizado</p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <PageSpinner />
      ) : !data?.dados?.length ? (
        <div className="card">
          <EmptyState icon={Syringe} titulo="Nenhuma dispensação registrada"
            descricao="Registre a primeira dispensação de medicamento CEAF ao paciente." />
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
        titulo="Dispensar Medicamento ao Paciente" size="lg">
        <Alert
          type="info"
          title="Proteção de dados — LGPD"
          message="O CPF e Cartão SUS serão armazenados como hash criptográfico (SHA-256). Nenhum dado pessoal identificável será exposto no sistema."
        />
        <form onSubmit={handleSubmit((d) => dispensar.mutate(d))} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Medicamento *"
              options={(medicamentos?.dados ?? []).map((m: any) => ({ value: m.id, label: m.dcb }))}
              placeholder="Selecionar..." {...register('medicamentoId')}
              error={errors.medicamentoId?.message} />
            <Select label="Lote *"
              options={(lotes?.dados ?? []).map((l: any) => ({
                value: l.id,
                label: `${l.medicamento?.dcb} — ${l.numeroLote}`,
              }))}
              placeholder="Selecionar..." {...register('loteId')}
              error={errors.loteId?.message} />
            <Input label="CPF do Paciente *" placeholder="Somente números (11 dígitos)"
              {...register('cpfPaciente')} error={errors.cpfPaciente?.message} />
            <Input label="Cartão SUS" placeholder="15 dígitos (opcional)"
              {...register('cartaoSusPaciente')} />
            <Select label="Unidade Dispensadora *"
              options={(unidades ?? []).map((u: any) => ({ value: u.id, label: u.nome }))}
              placeholder="Selecionar..." {...register('unidadeId')}
              error={errors.unidadeId?.message} />
            <Input label="Quantidade *" type="number" placeholder="Ex: 2"
              {...register('quantidade', { valueAsNumber: true })}
              error={errors.quantidade?.message} />
            <Input label="Dosagem" placeholder="Ex: 40mg/semana"
              {...register('dosagem')} />
            <Input label="Duração do Tratamento" placeholder="Ex: 6 meses"
              {...register('duracaoTratamento')} />
            <Input label="CID-10" placeholder="Ex: M05.0"
              {...register('cid10')} />
            <Input label="Nº Prescrição" placeholder="Ex: REC-2024-001"
              {...register('prescricaoRef')} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); reset(); }}
              className="btn-ghost flex-1">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center">
              {isSubmitting ? 'Dispensando...' : 'Confirmar Dispensação'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
