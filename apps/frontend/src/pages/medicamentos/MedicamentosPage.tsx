import { api } from '@services/api';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Package,
  Pill,
  Plus,
  QrCode,
  Save,
  ShieldCheck,
  Thermometer,
} from 'lucide-react';

type Registro = {
  medicamento: string;
  principioAtivo: string;
  fabricante: string;
  apresentacao: string;
  concentracao: string;
  classeTerapeutica: string;
  componente: string;
  registroAnvisa: string;
  temperatura: string;
  numeroLote: string;
  validade: string;
  origem: string;
  distribuidor: string;
  armazenamento: string;
  temperaturaMinima: string;
  temperaturaMaxima: string;
  quantidadeInicial: string;
  status: string;
};

const vazio: Registro = {
  medicamento: '',
  principioAtivo: '',
  fabricante: '',
  apresentacao: '',
  concentracao: '',
  classeTerapeutica: '',
  componente: '',
  registroAnvisa: '',
  temperatura: '',
  numeroLote: '',
  validade: '',
  origem: '',
  distribuidor: '',
  armazenamento: '',
  temperaturaMinima: '',
  temperaturaMaxima: '',
  quantidadeInicial: '',
  status: '',
};

export default function MedicamentosPage() {
  const [open, setOpen] = useState(false);
  const [registros, setRegistros] = useState<Registro[]>(() => {
    const salvo = localStorage.getItem('farchain-medicamentos-lotes');
    return salvo ? JSON.parse(salvo) : [];
  });
  const [form, setForm] = useState<Registro>(vazio);
  const [etapa, setEtapa] = useState(1);

  async function carregarRegistros() {
    try {
      const response = await api.get('/tcc/medicamentos-lotes');
      const lista = response.data?.data || response.data || [];
      setRegistros(lista);
    } catch (error) {
      console.error('Erro ao carregar medicamentos/lotes', error);
    }
  }

  useEffect(() => {
    carregarRegistros();
  }, []);

  useEffect(() => {
    localStorage.setItem('farchain-medicamentos-lotes', JSON.stringify(registros));
  }, [registros]);

  async function salvar() {
    if (!form.medicamento.trim() || !form.numeroLote.trim()) {
      alert('Preencha pelo menos Medicamento e Número do lote.');
      return;
    }

    const novoRegistro = {
      ...form,
      status: form.status || 'Ativo',
    };

    setRegistros((prev) => [novoRegistro, ...prev]);
    localStorage.setItem(
      'farchain-medicamentos-lotes',
      JSON.stringify([novoRegistro, ...registros]),
    );

    setForm(vazio);
    setOpen(false);

    alert('Medicamento e lote registrados com sucesso.');
  }

  return (
    <div className="space-y-5 text-slate-950">
      <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">
          Cadastro integrado
        </p>

        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black leading-tight tracking-[-0.055em] md:text-5xl">
              Medicamento + lote.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Registre primeiro o medicamento e o respectivo lote. Depois esse
              registro seguirá para movimentação, dispensação e validação na blockchain.
            </p>
          </div>

          <button
            onClick={() => {
              setForm(vazio);
              setEtapa(1); setOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500"
          >
            <Plus size={17} />
            Novo medicamento + lote
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric icon={Pill} label="Medicamentos" value={String(registros.length)} />
        <Metric icon={Package} label="Lotes vinculados" value={String(registros.length)} />
        <Metric icon={Thermometer} label="Cadeia fria" value="Monitorada" />
        <Metric icon={ShieldCheck} label="Rastreabilidade" value="Ativa" />
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
        <h2 className="text-lg font-black">Registros cadastrados</h2>
        <p className="mt-1 text-xs text-slate-500">
          Os medicamentos e lotes salvos aparecerão aqui.
        </p>

        {registros.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <QrCode className="mx-auto text-slate-400" size={34} />
            <h3 className="mt-4 text-xl font-black">Nenhum medicamento cadastrado</h3>
            <p className="mt-2 text-sm text-slate-500">
              Clique em “Novo medicamento + lote” para iniciar o fluxo.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5">
            {registros.map((r, index) => (
              <div key={`${r.numeroLote}-${index}`} className="rounded-[26px] bg-slate-50 p-5 ring-1 ring-slate-200">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                      {r.componente || 'Componente não informado'} · {r.status || 'Status não informado'}
                    </p>
                    <h3 className="mt-3 text-3xl font-black tracking-[-0.05em]">
                      {r.medicamento}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {r.apresentacao || 'Apresentação não informada'} · {r.concentracao || 'Concentração não informada'}
                    </p>
                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-blue-600 shadow-sm">
                    <QrCode size={30} />
                  </div>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                  <InfoBlock
                    title="Medicamento"
                    icon={Pill}
                    items={[
                      ['Medicamento', r.medicamento],
                      ['Princípio ativo', r.principioAtivo],
                      ['Fabricante', r.fabricante],
                      ['Apresentação', r.apresentacao],
                      ['Concentração', r.concentracao],
                      ['Classe terapêutica', r.classeTerapeutica],
                      ['Componente', r.componente],
                      ['Registro ANVISA', r.registroAnvisa],
                      ['Temperatura', r.temperatura],
                    ]}
                  />

                  <InfoBlock
                    title="Lote"
                    icon={Package}
                    items={[
                      ['Número do lote', r.numeroLote],
                      ['Validade', r.validade],
                      ['Origem', r.origem],
                      ['Distribuidor', r.distribuidor],
                      ['Armazenamento', r.armazenamento],
                      ['Temperatura mínima', r.temperaturaMinima],
                      ['Temperatura máxima', r.temperaturaMaxima],
                      ['Quantidade inicial', r.quantidadeInicial],
                      ['Status', r.status],
                    ]}
                  />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="/movimentacoes" className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-xs font-black text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100">
                    Movimentar <ArrowRight size={14} />
                  </a>
                  <a href="/dispensacoes" className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-xs font-black text-white hover:bg-blue-500">
                    Dispensar <ArrowRight size={14} />
                  </a>
                  <a href="/blockchain" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-slate-800">
                    Ver blockchain <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[30px] bg-white shadow-2xl">
            <div className="border-b border-slate-100 p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">
                Etapa {etapa} de 2
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">
                {etapa === 1 ? 'Dados do medicamento' : 'Dados do lote'}
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className={`h-2 rounded-full ${etapa >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                <div className={`h-2 rounded-full ${etapa >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
              </div>
            </div>

            <div className="p-6">
              {etapa === 1 ? (
                <FormBlock title="Medicamento" icon={Pill}>
                  <Input label="Medicamento" value={form.medicamento} onChange={(v: string) => setForm({ ...form, medicamento: v })} />
                  <Input label="Princípio ativo" value={form.principioAtivo} onChange={(v: string) => setForm({ ...form, principioAtivo: v })} />
                  <Input label="Fabricante" value={form.fabricante} onChange={(v: string) => setForm({ ...form, fabricante: v })} />
                  <Input label="Apresentação" value={form.apresentacao} onChange={(v: string) => setForm({ ...form, apresentacao: v })} />
                  <Input label="Concentração" value={form.concentracao} onChange={(v: string) => setForm({ ...form, concentracao: v })} />
                  <Input label="Classe terapêutica" value={form.classeTerapeutica} onChange={(v: string) => setForm({ ...form, classeTerapeutica: v })} />
                  <Input label="Componente" value={form.componente} onChange={(v: string) => setForm({ ...form, componente: v })} />
                  <Input label="Registro ANVISA" value={form.registroAnvisa} onChange={(v: string) => setForm({ ...form, registroAnvisa: v })} />
                  <Input label="Temperatura" value={form.temperatura} onChange={(v: string) => setForm({ ...form, temperatura: v })} />
                </FormBlock>
              ) : (
                <FormBlock title="Lote" icon={Package}>
                  <Input label="Número do lote" value={form.numeroLote} onChange={(v: string) => setForm({ ...form, numeroLote: v })} />
                  <Input label="Validade" value={form.validade} onChange={(v: string) => setForm({ ...form, validade: v })} />
                  <Input label="Origem" value={form.origem} onChange={(v: string) => setForm({ ...form, origem: v })} />
                  <Input label="Distribuidor" value={form.distribuidor} onChange={(v: string) => setForm({ ...form, distribuidor: v })} />
                  <Input label="Armazenamento" value={form.armazenamento} onChange={(v: string) => setForm({ ...form, armazenamento: v })} />
                  <Input label="Temperatura mínima" value={form.temperaturaMinima} onChange={(v: string) => setForm({ ...form, temperaturaMinima: v })} />
                  <Input label="Temperatura máxima" value={form.temperaturaMaxima} onChange={(v: string) => setForm({ ...form, temperaturaMaxima: v })} />
                  <Input label="Quantidade inicial" value={form.quantidadeInicial} onChange={(v: string) => setForm({ ...form, quantidadeInicial: v })} />
                  <Input label="Status" value={form.status} onChange={(v: string) => setForm({ ...form, status: v })} />
                </FormBlock>
              )}
            </div>

            <div className="flex justify-between gap-3 border-t border-slate-100 p-6">
              <button
                type="button"
                onClick={() => etapa === 1 ? setOpen(false) : setEtapa(1)}
                className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-200"
              >
                {etapa === 1 ? 'Cancelar' : 'Voltar'}
              </button>

              {etapa === 1 ? (
                <button
                  type="button"
                  onClick={() => setEtapa(2)}
                  className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-500"
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={salvar}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-500"
                >
                  <Save size={17} />
                  Registrar medicamento + lote
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
      <Icon className="text-blue-600" size={22} />
      <p className="mt-5 text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-[-0.05em]">{value}</p>
    </div>
  );
}

function InfoBlock({ title, icon: Icon, items }: any) {
  return (
    <div className="rounded-[24px] bg-white p-5 ring-1 ring-slate-200">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Icon size={18} />
        </div>
        <h4 className="font-black">{title}</h4>
      </div>

      <div className="grid gap-3">
        {items.map(([label, value]: [string, string]) => (
          <div key={label} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2 last:border-0">
            <p className="text-xs font-bold text-slate-400">{label}</p>
            <p className="text-right text-xs font-black text-slate-700">{value || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormBlock({ title, icon: Icon, children }: any) {
  return (
    <div className="rounded-[24px] bg-slate-50 p-5">
      <div className="mb-5 flex items-center gap-3">
        <Icon className="text-blue-600" />
        <h3 className="font-black">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
      />
    </div>
  );
}
