import { useState } from 'react';
import {
  ArrowUpRight,
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  Save,
} from 'lucide-react';
import ExportButton from './ExportButton';

interface PageShellProps {
  title: string;
  subtitle: string;
  eyebrow?: string;
  primaryAction?: string;
  stats?: Array<{
    label: string;
    value: string;
    trend?: string;
  }>;
  tableTitle?: string;
  rows?: Array<Record<string, string>>;
  variant?: 'default' | 'timeline' | 'cards';
}

export default function PageShell({
  title,
  subtitle,
  eyebrow = 'FarmaChain',
  primaryAction = 'Novo registro',
  stats = [],
  tableTitle = 'Registros recentes',
  rows = [],
  variant = 'default',
}: PageShellProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const data = rows.length
    ? rows
    : [
        { item: 'ADA-2026-042', status: 'Ativo', unidade: 'CEAF Salvador', data: 'Hoje' },
        { item: 'MET-2026-018', status: 'Validado', unidade: 'Policlínica Itapuã', data: 'Ontem' },
        { item: 'OMA-2026-009', status: 'Auditoria', unidade: 'UPA São Marcos', data: '2 dias' },
      ];

  const metrics = stats.length
    ? stats
    : [
        { label: 'Total', value: '1.248', trend: '+12%' },
        { label: 'Ativos', value: '982', trend: '+8%' },
        { label: 'Alertas', value: '24', trend: '-3%' },
        { label: 'Auditados', value: '100%', trend: 'OK' },
      ];

  return (
    <div className="space-y-5 text-slate-950">
      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,.08)]">
        <div className="grid min-h-[240px] lg:grid-cols-[1fr_.85fr]">
          <div className="p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">
              {eyebrow}
            </p>

            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.02] tracking-[-0.055em] md:text-5xl">
              {title}
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
              {subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500"
              >
                <Plus size={17} />
                {primaryAction}
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-200"
              >
                <Search size={17} />
                Buscar
              </button>

              <ExportButton filename={tableTitle.toLowerCase().replace(/ /g, '-')} data={data} />
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(59,130,246,.26),transparent_34%)]" />
            <div className="relative h-full rounded-[26px] bg-white/75 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                    Status operacional
                  </p>
                  <p className="mt-3 text-4xl font-black tracking-[-0.06em] text-slate-950">
                    Sistema íntegro
                  </p>
                </div>

                <div className="grid gap-3">
                  {['Blockchain validada', 'Auditoria ativa', 'Dados protegidos'].map((x) => (
                    <div key={x} className="flex items-center gap-3 rounded-2xl bg-white p-3">
                      <CheckCircle2 className="text-emerald-500" size={18} />
                      <span className="text-sm font-bold">{x}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,.08)]"
          >
            <div className="flex items-center justify-between">
              <div className={`h-11 w-11 rounded-2xl ${['bg-blue-100', 'bg-emerald-100', 'bg-orange-100', 'bg-violet-100'][i % 4]}`} />
              {m.trend && (
                <span className="flex items-center gap-1 text-xs font-black text-emerald-600">
                  {m.trend}
                  <ArrowUpRight size={13} />
                </span>
              )}
            </div>
            <p className="mt-5 text-xs font-semibold text-slate-500">{m.label}</p>
            <p className="mt-1 text-3xl font-black tracking-[-0.05em]">{m.value}</p>
          </div>
        ))}
      </section>

      {variant === 'timeline' ? (
        <Timeline title={tableTitle} />
      ) : variant === 'cards' ? (
        <Cards data={data} title={tableTitle} onNew={() => setModalOpen(true)} />
      ) : (
        <Table data={data} title={tableTitle} onNew={() => setModalOpen(true)} />
      )}

      {modalOpen && (
        <CadastroModal
          title={primaryAction}
          pageTitle={title}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

function CadastroModal({
  title,
  pageTitle,
  onClose,
}: {
  title: string;
  pageTitle: string;
  onClose: () => void;
}) {
  const fields = getFields(pageTitle);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-600">
              Cadastro
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Cadastro simulado salvo. Próxima etapa: conectar este formulário ao endpoint real da API.');
            onClose();
          }}
          className="p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name} className={f.full ? 'md:col-span-2' : ''}>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
                  {f.label}
                </label>

                {f.type === 'textarea' ? (
                  <textarea
                    name={f.name}
                    rows={4}
                    placeholder={f.placeholder}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                ) : (
                  <input
                    name={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-950">
            Este formulário já abre corretamente. Na próxima etapa, conectaremos o botão salvar aos endpoints reais do backend.
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-500"
            >
              <Save size={17} />
              Salvar cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getFields(pageTitle: string) {
  const t = pageTitle.toLowerCase();

  if (t.includes('medicamento')) {
    return [
      { name: 'nome', label: 'Nome do medicamento', type: 'text', placeholder: 'Ex.: Adalimumabe' },
      { name: 'principioAtivo', label: 'Princípio ativo', type: 'text', placeholder: 'Ex.: Adalimumabe' },
      { name: 'fabricante', label: 'Fabricante', type: 'text', placeholder: 'Ex.: AbbVie' },
      { name: 'classe', label: 'Classe terapêutica', type: 'text', placeholder: 'Ex.: Imunobiológico' },
      { name: 'apresentacao', label: 'Apresentação', type: 'text', placeholder: 'Ex.: Seringa preenchida' },
      { name: 'concentracao', label: 'Concentração', type: 'text', placeholder: 'Ex.: 40mg/0,4mL' },
    ];
  }

  if (t.includes('lote')) {
    return [
      { name: 'numeroLote', label: 'Número do lote', type: 'text', placeholder: 'Ex.: ADA-2026-042' },
      { name: 'medicamento', label: 'Medicamento', type: 'text', placeholder: 'Ex.: Adalimumabe 40mg' },
      { name: 'fabricante', label: 'Fabricante', type: 'text', placeholder: 'Ex.: AbbVie' },
      { name: 'validade', label: 'Validade', type: 'date', placeholder: '' },
      { name: 'temperaturaMin', label: 'Temperatura mínima', type: 'number', placeholder: '2' },
      { name: 'temperaturaMax', label: 'Temperatura máxima', type: 'number', placeholder: '8' },
    ];
  }

  if (t.includes('dispensa')) {
    return [
      { name: 'paciente', label: 'Paciente', type: 'text', placeholder: 'Nome do paciente' },
      { name: 'cpf', label: 'CPF', type: 'text', placeholder: 'CPF será convertido em hash' },
      { name: 'cartaoSus', label: 'Cartão SUS', type: 'text', placeholder: 'Número do CNS' },
      { name: 'lote', label: 'Lote', type: 'text', placeholder: 'Ex.: ADA-2026-042' },
      { name: 'quantidade', label: 'Quantidade', type: 'number', placeholder: '1' },
      { name: 'farmaceutico', label: 'Farmacêutico responsável', type: 'text', placeholder: 'Nome e CRF' },
    ];
  }

  if (t.includes('farmacovigil')) {
    return [
      { name: 'tipo', label: 'Tipo de evento', type: 'text', placeholder: 'RAM ou queixa técnica' },
      { name: 'gravidade', label: 'Gravidade', type: 'text', placeholder: 'Leve, moderada ou grave' },
      { name: 'medicamento', label: 'Medicamento', type: 'text', placeholder: 'Medicamento relacionado' },
      { name: 'lote', label: 'Lote', type: 'text', placeholder: 'Lote relacionado' },
      { name: 'descricao', label: 'Descrição do evento', type: 'textarea', placeholder: 'Descreva o evento observado', full: true },
    ];
  }

  if (t.includes('unidade')) {
    return [
      { name: 'nome', label: 'Nome da unidade', type: 'text', placeholder: 'Ex.: CEAF Salvador' },
      { name: 'tipo', label: 'Tipo', type: 'text', placeholder: 'CAF, UBS, UPA, Policlínica' },
      { name: 'distrito', label: 'Distrito sanitário', type: 'text', placeholder: 'Ex.: Centro Histórico' },
      { name: 'endereco', label: 'Endereço', type: 'text', placeholder: 'Endereço da unidade' },
      { name: 'latitude', label: 'Latitude', type: 'text', placeholder: '-12.97' },
      { name: 'longitude', label: 'Longitude', type: 'text', placeholder: '-38.50' },
    ];
  }

  if (t.includes('usuário') || t.includes('usuario')) {
    return [
      { name: 'nome', label: 'Nome', type: 'text', placeholder: 'Nome completo' },
      { name: 'email', label: 'E-mail', type: 'email', placeholder: 'usuario@farchain.gov.br' },
      { name: 'cpf', label: 'CPF', type: 'text', placeholder: 'CPF obrigatório' },
      { name: 'role', label: 'Perfil', type: 'text', placeholder: 'SUPER_ADMIN, FARMACEUTICO, AUDITOR' },
      { name: 'unidade', label: 'Unidade vinculada', type: 'text', placeholder: 'CEAF Salvador' },
      { name: 'senha', label: 'Senha provisória', type: 'password', placeholder: 'Senha inicial' },
    ];
  }

  return [
    { name: 'nome', label: 'Nome', type: 'text', placeholder: 'Nome do registro' },
    { name: 'status', label: 'Status', type: 'text', placeholder: 'Ativo' },
    { name: 'unidade', label: 'Unidade', type: 'text', placeholder: 'Unidade relacionada' },
    { name: 'observacao', label: 'Observação', type: 'textarea', placeholder: 'Observações adicionais', full: true },
  ];
}

function Table({
  data,
  title,
  onNew,
}: {
  data: Array<Record<string, string>>;
  title: string;
  onNew: () => void;
}) {
  const keys = Object.keys(data[0] ?? {});

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black">{title}</h2>
          <p className="text-xs text-slate-500">Lista operacional com registros recentes</p>
        </div>

        <button
          type="button"
          onClick={onNew}
          className="rounded-2xl bg-slate-100 p-3 text-slate-500 hover:bg-slate-200"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              {keys.map((k) => (
                <th key={k} className="px-4 py-3 font-black">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t border-slate-100">
                {keys.map((k) => (
                  <td key={k} className="px-4 py-4 font-semibold text-slate-700">
                    {row[k]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Cards({
  data,
  title,
  onNew,
}: {
  data: Array<Record<string, string>>;
  title: string;
  onNew: () => void;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">{title}</h2>
        <button
          type="button"
          onClick={onNew}
          className="rounded-2xl bg-slate-100 px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-200"
        >
          Novo
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {data.map((row, i) => (
          <div key={i} className="rounded-[24px] bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              {row.status ?? 'Ativo'}
            </p>
            <p className="mt-4 text-xl font-black">{row.item}</p>
            <p className="mt-2 text-sm text-slate-500">{row.unidade}</p>
            <p className="mt-5 text-xs font-semibold text-slate-400">{row.data}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Timeline({ title }: { title: string }) {
  const events = [
    ['08:10', 'Lote cadastrado', 'Registro criado e hash gerado.'],
    ['09:32', 'Movimentação registrada', 'Transferência enviada para unidade.'],
    ['10:15', 'Dispensação realizada', 'Entrega vinculada ao lote rastreado.'],
    ['11:20', 'Auditoria executada', 'Integridade confirmada no ledger.'],
  ];

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
      <h2 className="text-lg font-black">{title}</h2>
      <div className="mt-6 space-y-4">
        {events.map(([time, name, desc], i) => (
          <div key={i} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              {i === 0 ? <Clock size={18} /> : i === 1 ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
            </div>
            <div>
              <p className="text-xs font-black text-slate-400">{time}</p>
              <p className="text-sm font-black">{name}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
