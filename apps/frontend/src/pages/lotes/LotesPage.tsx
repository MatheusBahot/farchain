import { useState } from 'react';
import { Plus, X, Package, QrCode, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const iniciais = [
  {
    id: '1',
    numero: 'ADA-2026-042',
    medicamento: 'Adalimumabe',
    fabricante: 'AbbVie',
    validade: '2027-12-31',
    quantidade: '240',
    temperatura: '2°C a 8°C',
    status: 'Ativo',
  },
];

export default function LotesPage() {
  const [open, setOpen] = useState(false);
  const [lotes, setLotes] = useState(iniciais);
  const [form, setForm] = useState({
    numero: '',
    medicamento: '',
    fabricante: '',
    validade: '',
    quantidade: '',
    temperatura: '',
  });

  function salvar(e: React.FormEvent) {
    e.preventDefault();

    if (!form.numero || !form.medicamento || !form.validade) {
      toast.error('Preencha número do lote, medicamento e validade.');
      return;
    }

    setLotes((old) => [
      {
        id: crypto.randomUUID(),
        ...form,
        status: 'Ativo',
      },
      ...old,
    ]);

    setForm({
      numero: '',
      medicamento: '',
      fabricante: '',
      validade: '',
      quantidade: '',
      temperatura: '',
    });

    setOpen(false);
    toast.success('Lote cadastrado com sucesso.');
  }

  return (
    <div className="space-y-5 text-slate-950">
      <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">
              Gestão de lotes
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.055em] md:text-5xl">
              Lotes rastreáveis
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Controle validade, fabricante, quantidade, temperatura e QR Code de rastreio.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500"
          >
            <Plus size={17} />
            Novo lote
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ['Lotes', String(lotes.length)],
          ['Ativos', String(lotes.length)],
          ['QR Codes', String(lotes.length)],
          ['Auditados', '100%'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black tracking-[-0.05em]">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {lotes.map((l) => (
          <div key={l.id} className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Package size={22} />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <QrCode size={22} />
              </div>
            </div>

            <h3 className="mt-6 text-xl font-black">{l.numero}</h3>
            <p className="mt-1 text-sm text-slate-500">{l.medicamento}</p>

            <div className="mt-5 space-y-2 text-xs text-slate-600">
              <p><strong>Fabricante:</strong> {l.fabricante || '-'}</p>
              <p><strong>Validade:</strong> {l.validade}</p>
              <p><strong>Quantidade:</strong> {l.quantidade || '-'}</p>
              <p><strong>Temperatura:</strong> {l.temperatura || '-'}</p>
            </div>
          </div>
        ))}
      </section>

      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <form onSubmit={salvar} className="w-full max-w-3xl rounded-[30px] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">
                  Cadastro
                </p>
                <h2 className="mt-2 text-2xl font-black">Novo lote</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Registre dados essenciais para rastreabilidade.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-2xl bg-slate-100 p-3 text-slate-500 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Número do lote" value={form.numero} onChange={(v) => setForm({ ...form, numero: v })} />
              <Input label="Medicamento" value={form.medicamento} onChange={(v) => setForm({ ...form, medicamento: v })} />
              <Input label="Fabricante" value={form.fabricante} onChange={(v) => setForm({ ...form, fabricante: v })} />
              <Input label="Validade" type="date" value={form.validade} onChange={(v) => setForm({ ...form, validade: v })} />
              <Input label="Quantidade" value={form.quantidade} onChange={(v) => setForm({ ...form, quantidade: v })} />
              <Input label="Temperatura" value={form.temperatura} onChange={(v) => setForm({ ...form, temperatura: v })} />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setOpen(false)} className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700">
                Cancelar
              </button>
              <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white">
                <CheckCircle2 size={17} />
                Salvar lote
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
      />
    </label>
  );
}
