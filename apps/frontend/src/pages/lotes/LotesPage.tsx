import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Search, Package, QrCode, RefreshCw, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { lotesApi, medicamentosApi, unidadesApi, qrCodeApi } from '@services/api';
import { Table } from '@components/ui/Table';
import { Pagination } from '@components/ui/Pagination';
import { Modal } from '@components/ui/Modal';
import { BadgeStatusLote } from '@components/ui/Badge';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { PageSpinner } from '@components/ui/Spinner';
import { EmptyState } from '@components/ui/EmptyState';
import { useDebounce } from '@hooks/useDebounce';
import { usePagination } from '@hooks/usePagination';
import type { Lote } from '../../types';
import { differenceInDays, parseISO } from 'date-fns';

const schema = z.object({
  medicamentoId: z.string().uuid('Selecione um medicamento'),
  numeroLote: z.string().min(2, 'Número do lote obrigatório'),
  fabricante: z.string().min(2, 'Fabricante obrigatório'),
  dataFabricacao: z.string().min(1, 'Data obrigatória'),
  dataValidade: z.string().min(1, 'Data obrigatória'),
  quantidadeProduzida: z.number().int().positive(),
  quantidadeRecebida: z.number().int().positive(),
  notaFiscal: z.string().optional(),
  fornecedor: z.string().optional(),
  unidadeDestinoId: z.string().optional(),
  observacoes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function diasParaVencer(dataValidade: string): number {
  return differenceInDays(parseISO(dataValidade), new Date());
}

function ValidadeTag({ data }: { data: string }) {
  const dias = diasParaVencer(data);
  const cor = dias < 0 ? 'text-danger-500' : dias <= 30 ? 'text-warning-500' : 'text-success-500';
  return (
    <div>
      <p className={`text-sm font-semibold ${cor}`}>
        {new Date(data).toLocaleDateString('pt-BR')}
      </p>
      <p className="text-xs text-grafite-400">
        {dias < 0 ? `Vencido há ${Math.abs(dias)}d` :
         dias <= 30 ? `Vence em ${dias}d ⚠` : `${dias} dias`}
      </p>
    </div>
  );
}

export default function LotesPage() {
  const qc = useQueryClient();
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [qrModal, setQrModal] = useState<{ open: boolean; lote?: Lote }>({ open: false });
  const [qrData, setQrData] = useState<any>(null);
  const buscaDebounced = useDebounce(busca);
  const { pagina, limite, irParaPagina } = usePagination(15);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['lotes', pagina, buscaDebounced, statusFiltro],
    queryFn: () => lotesApi.listar({ pagina, limite, status: statusFiltro }),
  });

  const { data: medicamentos } = useQuery({
    queryKey: ['medicamentos', 'all'],
    queryFn: () => medicamentosApi.listar({ limite: 200 }),
  });

  const { data: unidades } = useQuery({
    queryKey: ['unidades', 'all'],
    queryFn: () => unidadesApi.listar(),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const criar = useMutation({
    mutationFn: lotesApi.criar,
    onSuccess: () => {
      toast.success('Lote registrado com sucesso!');
      qc.invalidateQueries({ queryKey: ['lotes'] });
      setModalOpen(false);
      reset();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Erro ao criar lote'),
  });

  const gerarQr = async (lote: Lote) => {
    try {
      const result = await qrCodeApi.gerar(lote.id);
      setQrData(result);
      setQrModal({ open: true, lote });
      qc.invalidateQueries({ queryKey: ['lotes'] });
    } catch {
      toast.error('Erro ao gerar QR Code');
    }
  };

  const columns = [
    {
      key: 'numeroLote',
      label: 'Lote / Medicamento',
      render: (row: Lote) => (
        <div>
          <p className="font-mono font-semibold text-grafite-900 dark:text-white text-sm">
            {row.numeroLote}
          </p>
          <p className="text-xs text-grafite-400">{row.medicamento?.dcb}</p>
        </div>
      ),
    },
    {
      key: 'fabricante',
      label: 'Fabricante',
      render: (row: Lote) => <span className="text-sm">{row.fabricante}</span>,
    },
    {
      key: 'dataValidade',
      label: 'Validade',
      render: (row: Lote) => <ValidadeTag data={row.dataValidade} />,
    },
    {
      key: 'estoque',
      label: 'Estoque Total',
      render: (row: Lote) => {
        const total = row.estoque?.reduce((acc: number, e: any) => acc + e.quantidade, 0) ?? 0;
        return (
          <span className={`font-semibold ${total === 0 ? 'text-danger-500' :
            total <= 10 ? 'text-warning-500' : 'text-grafite-900 dark:text-white'}`}>
            {total} un.
          </span>
        );
      },
    },
    {
      key: 'statusSanitario',
      label: 'Status',
      render: (row: Lote) => <BadgeStatusLote status={row.statusSanitario} />,
    },
    {
      key: 'qrcode',
      label: 'QR Code',
      render: (row: Lote) => (
        <button
          onClick={e => { e.stopPropagation(); gerarQr(row); }}
          className="flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400
                     hover:underline font-medium"
        >
          <QrCode size={14} />
          {row.qrCodeHash ? 'Ver QR' : 'Gerar'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-grafite-900 dark:text-white">Lotes Farmacêuticos</h1>
          <p className="text-grafite-500 text-sm mt-0.5">
            Gestão de lotes com rastreabilidade blockchain
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Registrar Lote
        </button>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Buscar por número do lote..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          leftIcon={<Search size={16} />}
          className="flex-1"
        />
        <Select
          options={[
            { value: 'ATIVO', label: 'Ativo' },
            { value: 'QUARENTENA', label: 'Quarentena' },
            { value: 'BLOQUEADO', label: 'Bloqueado' },
            { value: 'VENCIDO', label: 'Vencido' },
          ]}
          placeholder="Todos os status"
          value={statusFiltro}
          onChange={e => setStatusFiltro(e.target.value)}
          className="sm:w-48"
        />
        <button onClick={() => refetch()} className="btn-ghost p-2.5 rounded-xl">
          <RefreshCw size={16} />
        </button>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : !data?.dados?.length ? (
        <div className="card">
          <EmptyState
            icon={Package}
            titulo="Nenhum lote encontrado"
            descricao="Registre o primeiro lote farmacêutico para iniciar o rastreamento."
            action={
              <button onClick={() => setModalOpen(true)} className="btn-primary">
                <Plus size={16} /> Registrar lote
              </button>
            }
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

      {/* Modal Novo Lote */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); reset(); }}
        titulo="Registrar Novo Lote" size="lg">
        <form onSubmit={handleSubmit((d) => criar.mutate(d))} className="space-y-4">
          <Select
            label="Medicamento *"
            options={(medicamentos?.dados ?? []).map((m: any) => ({
              value: m.id,
              label: `${m.dcb}${m.nomeComercial ? ` — ${m.nomeComercial}` : ''}`,
            }))}
            placeholder="Selecione o medicamento..."
            {...register('medicamentoId')}
            error={errors.medicamentoId?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Número do Lote *" placeholder="Ex: LOT-2024-001234"
              {...register('numeroLote')} error={errors.numeroLote?.message} />
            <Input label="Fabricante *" placeholder="Ex: AbbVie Brasil"
              {...register('fabricante')} error={errors.fabricante?.message} />
            <Input label="Data de Fabricação *" type="date"
              {...register('dataFabricacao')} error={errors.dataFabricacao?.message} />
            <Input label="Data de Validade *" type="date"
              {...register('dataValidade')} error={errors.dataValidade?.message} />
            <Input label="Qtd. Produzida *" type="number"
              {...register('quantidadeProduzida', { valueAsNumber: true })}
              error={errors.quantidadeProduzida?.message} />
            <Input label="Qtd. Recebida *" type="number"
              {...register('quantidadeRecebida', { valueAsNumber: true })}
              error={errors.quantidadeRecebida?.message} />
            <Input label="Nota Fiscal" placeholder="Ex: NF-12345"
              {...register('notaFiscal')} />
            <Input label="Fornecedor" placeholder="Ex: Distribuidora ABC"
              {...register('fornecedor')} />
          </div>
          <Select
            label="Unidade de Destino (Estoque Inicial)"
            options={(unidades ?? []).map((u: any) => ({ value: u.id, label: u.nome }))}
            placeholder="Selecione a unidade..."
            {...register('unidadeDestinoId')}
          />
          <Input label="Observações" placeholder="Informações adicionais..."
            {...register('observacoes')} />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); reset(); }}
              className="btn-ghost flex-1">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center">
              {isSubmitting ? 'Registrando...' : 'Registrar Lote'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal QR Code */}
      <Modal open={qrModal.open} onClose={() => setQrModal({ open: false })}
        titulo="QR Code do Lote" size="sm">
        {qrData && (
          <div className="text-center space-y-4">
            <img src={qrData.qrCodeBase64} alt="QR Code do Lote"
              className="mx-auto w-64 h-64 rounded-2xl border-4 border-grafite-200 dark:border-grafite-700" />
            <div className="text-left bg-grafite-50 dark:bg-grafite-800/50 rounded-xl p-4 space-y-2">
              <p className="text-xs text-grafite-500">Hash Público:</p>
              <p className="font-mono text-xs text-primary-600 dark:text-primary-400 break-all">
                {qrData.qrCodeHash}
              </p>
              <p className="text-xs text-grafite-500 mt-2">URL de Consulta:</p>
              <p className="font-mono text-xs text-teal-600 dark:text-teal-400 break-all">
                {qrData.urlPublica}
              </p>
            </div>
            <a href={qrData.qrCodeBase64} download={`qr-lote-${qrModal.lote?.numeroLote}.png`}
              className="btn-primary w-full justify-center">
              Baixar QR Code
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
}
