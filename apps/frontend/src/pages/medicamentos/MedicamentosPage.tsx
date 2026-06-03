import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Search, Pill, Thermometer, Filter, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { medicamentosApi } from '@services/api';
import { Table } from '@components/ui/Table';
import { Pagination } from '@components/ui/Pagination';
import { Modal } from '@components/ui/Modal';
import { Badge, BadgeClasseCEAF } from '@components/ui/Badge';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { PageSpinner } from '@components/ui/Spinner';
import { EmptyState } from '@components/ui/EmptyState';
import { useDebounce } from '@hooks/useDebounce';
import { usePagination } from '@hooks/usePagination';
import type { Medicamento } from '../../types';

const schema = z.object({
  dcb:                 z.string().min(2, 'DCB obrigatório'),
  nomeComercial:       z.string().optional(),
  principioAtivo:      z.string().min(2, 'Princípio ativo obrigatório'),
  fabricante:          z.string().min(2, 'Fabricante obrigatório'),
  distribuidor:        z.string().optional(),
  registroSanitario:   z.string().optional(),
  classeTerapeutica:   z.string().min(2, 'Classe terapêutica obrigatória'),
  formaFarmaceutica:   z.string().min(1, 'Forma farmacêutica obrigatória'),
  concentracao:        z.string().min(1, 'Concentração obrigatória'),
  apresentacao:        z.string().min(1, 'Apresentação obrigatória'),
  viaAdministracao:    z.string().optional(),
  classeCEAF:          z.string().min(1, 'Classe CEAF obrigatória'),
  protocoloClinico:    z.string().optional(),
  cid10:               z.string().optional(),
  temperaturaMin:      z.number().optional(),
  temperaturaMax:      z.number().optional(),
  requireCadeiaFria:   z.boolean().optional(),
  condicoesArmazenamento: z.string().optional(),
  custoCentral:        z.number().min(0).optional(),
});

type FormData = z.infer<typeof schema>;

const formasFarmaceuticas = [
  'COMPRIMIDO','CAPSULA','SOLUCAO_ORAL','SOLUCAO_INJETAVEL','SUSPENSAO_ORAL',
  'POMADA','CREME','GEL','INALACAO','PO_INJETAVEL','FRASCO_AMPOLA',
  'SERINGA_PREENCHIDA','CANETA_APLICADORA',
].map(v => ({ value: v, label: v.replace(/_/g,' ') }));

const classesCEAF = [
  { value: 'COMPONENTE_I_A', label: 'Componente I-A' },
  { value: 'COMPONENTE_I_B', label: 'Componente I-B' },
  { value: 'COMPONENTE_II',  label: 'Componente II'  },
  { value: 'COMPONENTE_III', label: 'Componente III' },
];

export default function MedicamentosPage() {
  const qc = useQueryClient();
  const [busca, setBusca] = useState('');
  const [classeFiltro, setClasseFiltro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Medicamento | null>(null);
  const buscaDebounced = useDebounce(busca, 400);
  const { pagina, limite, irParaPagina } = usePagination(15);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['medicamentos', pagina, buscaDebounced, classeFiltro],
    queryFn: () => medicamentosApi.listar({ pagina, limite, busca: buscaDebounced, classeCEAF: classeFiltro }),
  });

  const { data: stats } = useQuery({
    queryKey: ['medicamentos', 'estatisticas'],
    queryFn: medicamentosApi.estatisticas,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const criar = useMutation({
    mutationFn: medicamentosApi.criar,
    onSuccess: () => {
      toast.success('Medicamento cadastrado com sucesso!');
      qc.invalidateQueries({ queryKey: ['medicamentos'] });
      fecharModal();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Erro ao salvar'),
  });

  const atualizar = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      medicamentosApi.atualizar(id, data),
    onSuccess: () => {
      toast.success('Medicamento atualizado!');
      qc.invalidateQueries({ queryKey: ['medicamentos'] });
      fecharModal();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Erro ao atualizar'),
  });

  const fecharModal = () => {
    setModalOpen(false);
    setEditando(null);
    reset();
  };

  const abrirEdicao = (med: Medicamento) => {
    setEditando(med);
    Object.entries(med).forEach(([k, v]) => setValue(k as any, v));
    setModalOpen(true);
  };

  const onSubmit = (data: FormData) => {
    if (editando) {
      atualizar.mutate({ id: editando.id, data });
    } else {
      criar.mutate(data);
    }
  };

  const columns = [
    {
      key: 'dcb',
      label: 'DCB / Nome Comercial',
      render: (row: Medicamento) => (
        <div>
          <p className="font-semibold text-grafite-900 dark:text-white">{row.dcb}</p>
          {row.nomeComercial && (
            <p className="text-xs text-grafite-400">{row.nomeComercial}</p>
          )}
        </div>
      ),
    },
    {
      key: 'classeCEAF',
      label: 'Classe CEAF',
      render: (row: Medicamento) => <BadgeClasseCEAF classe={row.classeCEAF} />,
    },
    {
      key: 'formaFarmaceutica',
      label: 'Forma',
      render: (row: Medicamento) => (
        <span className="text-sm text-grafite-600 dark:text-grafite-400">
          {row.formaFarmaceutica.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'concentracao',
      label: 'Concentração',
      render: (row: Medicamento) => (
        <span className="font-mono text-sm">{row.concentracao}</span>
      ),
    },
    {
      key: 'requireCadeiaFria',
      label: 'Cadeia Fria',
      render: (row: Medicamento) =>
        row.requireCadeiaFria ? (
          <Badge variant="primary">
            <Thermometer size={11} /> ❄ Sim
          </Badge>
        ) : (
          <Badge variant="gray">Não</Badge>
        ),
    },
    {
      key: 'custoCentral',
      label: 'Custo (R$)',
      render: (row: Medicamento) => (
        <span className="font-semibold text-grafite-800 dark:text-grafite-200">
          {row.custoCentral
            ? row.custoCentral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            : '—'}
        </span>
      ),
    },
    {
      key: 'lotes',
      label: 'Lotes',
      render: (row: Medicamento) => (
        <Badge variant={row._count?.lotes ? 'teal' : 'gray'}>
          {row._count?.lotes ?? 0}
        </Badge>
      ),
    },
    {
      key: 'acoes',
      label: '',
      render: (row: Medicamento) => (
        <button
          onClick={(e) => { e.stopPropagation(); abrirEdicao(row); }}
          className="text-xs text-primary-600 dark:text-primary-400 
                     hover:underline font-medium px-2 py-1"
        >
          Editar
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-grafite-900 dark:text-white">Medicamentos CEAF</h1>
          <p className="text-grafite-500 text-sm mt-0.5">
            Cadastro do Componente Especializado da Assistência Farmacêutica
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Novo Medicamento
        </button>
      </div>

      {/* Stats mini */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total de medicamentos', valor: stats.total, cor: 'text-primary-500' },
            { label: 'Requerem cadeia fria', valor: stats.cadeiaFria, cor: 'text-teal-500' },
            { label: 'Classes CEAF', valor: stats.porClasse?.length ?? 4, cor: 'text-warning-500' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <p className={`text-2xl font-bold ${s.cor}`}>{s.valor}</p>
              <p className="text-xs text-grafite-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Buscar por DCB, nome comercial, princípio ativo..."
          value={busca}
          onChange={e => { setBusca(e.target.value); irParaPagina(1); }}
          leftIcon={<Search size={16} />}
          className="flex-1"
        />
        <Select
          options={classesCEAF}
          placeholder="Todas as classes"
          value={classeFiltro}
          onChange={e => { setClasseFiltro(e.target.value); irParaPagina(1); }}
          className="sm:w-52"
        />
        <button onClick={() => refetch()} className="btn-ghost p-2.5 rounded-xl">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <PageSpinner />
      ) : !data?.dados?.length ? (
        <div className="card">
          <EmptyState
            icon={Pill}
            titulo="Nenhum medicamento encontrado"
            descricao="Ajuste os filtros ou cadastre o primeiro medicamento CEAF."
            action={
              <button onClick={() => setModalOpen(true)} className="btn-primary">
                <Plus size={16} /> Cadastrar medicamento
              </button>
            }
          />
        </div>
      ) : (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Table
              columns={columns}
              data={data.dados}
              onRowClick={abrirEdicao}
            />
          </motion.div>
          <Pagination
            pagina={pagina}
            total={data.total}
            limite={limite}
            onChange={irParaPagina}
          />
        </>
      )}

      {/* Modal de cadastro/edição */}
      <Modal
        open={modalOpen}
        onClose={fecharModal}
        titulo={editando ? 'Editar Medicamento' : 'Novo Medicamento CEAF'}
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input label="DCB *" placeholder="Ex: ADALIMUMABE"
              {...register('dcb')} error={errors.dcb?.message} />
            <Input label="Nome Comercial" placeholder="Ex: Humira"
              {...register('nomeComercial')} />
            <Input label="Princípio Ativo *" placeholder="Ex: adalimumabe"
              {...register('principioAtivo')} error={errors.principioAtivo?.message} />
            <Input label="Fabricante *" placeholder="Ex: AbbVie"
              {...register('fabricante')} error={errors.fabricante?.message} />
            <Input label="Distribuidor" placeholder="Ex: AbbVie Brasil"
              {...register('distribuidor')} />
            <Input label="Registro Sanitário ANVISA"
              placeholder="Ex: 1.2345.0001.001-1"
              {...register('registroSanitario')} />
            <Input label="Classe Terapêutica *"
              placeholder="Ex: Imunossupressor / Anti-TNF"
              {...register('classeTerapeutica')} error={errors.classeTerapeutica?.message} />
            <Select
              label="Forma Farmacêutica *"
              options={formasFarmaceuticas}
              placeholder="Selecionar..."
              {...register('formaFarmaceutica')} error={errors.formaFarmaceutica?.message} />
            <Input label="Concentração *" placeholder="Ex: 40mg/0,8mL"
              {...register('concentracao')} error={errors.concentracao?.message} />
            <Input label="Apresentação *" placeholder="Ex: 2 seringas preenchidas"
              {...register('apresentacao')} error={errors.apresentacao?.message} />
            <Input label="Via de Administração" placeholder="Ex: Subcutânea"
              {...register('viaAdministracao')} />
            <Select
              label="Classe CEAF *"
              options={classesCEAF}
              placeholder="Selecionar..."
              {...register('classeCEAF')} error={errors.classeCEAF?.message} />
            <Input label="Protocolo Clínico"
              placeholder="Ex: PCDT Artrite Reumatoide"
              {...register('protocoloClinico')} />
            <Input label="CID-10" placeholder="Ex: M05,M06,K50"
              {...register('cid10')} />
            <Input label="Temperatura Mínima (°C)" type="number"
              placeholder="Ex: 2"
              {...register('temperaturaMin', { valueAsNumber: true })} />
            <Input label="Temperatura Máxima (°C)" type="number"
              placeholder="Ex: 8"
              {...register('temperaturaMax', { valueAsNumber: true })} />
            <Input label="Custo Central (R$)" type="number" step="0.01"
              placeholder="Ex: 4521.00"
              {...register('custoCentral', { valueAsNumber: true })} />
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="cadeiaFria"
                {...register('requireCadeiaFria')}
                className="w-4 h-4 accent-primary-600" />
              <label htmlFor="cadeiaFria"
                className="text-sm text-grafite-700 dark:text-grafite-300">
                Requer cadeia fria ❄
              </label>
            </div>
          </div>
          <Input
            label="Condições de Armazenamento"
            placeholder="Ex: Refrigerado entre 2°C e 8°C. Não congelar."
            {...register('condicoesArmazenamento')}
          />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={fecharModal} className="btn-ghost flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center">
              {isSubmitting ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
