import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Hash, MapPin, Package, Pill, ShieldCheck } from 'lucide-react';
import { api } from '@services/api';

export default function TracePage() {
  const { lote } = useParams();
  const [trace, setTrace] = useState<any>(null);

  useEffect(() => {
    async function carregar() {
      const response = await api.get(`/tcc/trace/${encodeURIComponent(lote || '')}`);
      setTrace(response.data?.data || response.data);
    }

    carregar();
  }, [lote]);

  if (!trace) {
    return <div className="min-h-screen bg-[#f5f5f7] p-10">Carregando rastreabilidade...</div>;
  }

  const medicamento = trace.medicamento;
  const dispensacao = trace.dispensacao;

  return (
    <main className="min-h-screen bg-[#f5f5f7] p-6 text-slate-950">
      <section className="mx-auto max-w-5xl rounded-[32px] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,.12)]">
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">
          Rastreabilidade FarmaChain
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.055em]">
          Histórico do lote {trace.lote}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Consulta pública de rastreabilidade do medicamento, com eventos registrados em blockchain e proteção de dados do paciente.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card icon={Pill} label="Medicamento" value={medicamento?.medicamento || '—'} />
          <Card icon={Package} label="Origem" value={medicamento?.origem || '—'} />
          <Card icon={ShieldCheck} label="Status" value={dispensacao?.status || medicamento?.status || '—'} />
        </div>

        <div className="mt-8 rounded-[28px] bg-slate-50 p-6">
          <h2 className="text-xl font-black">Linha do tempo</h2>

          <div className="mt-6 space-y-4">
            {trace.blocos?.map((b: any) => (
              <div key={b.id} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="mt-1 text-emerald-500" />
                  <div>
                    <p className="text-sm font-black">{b.tipo}</p>
                    <p className="mt-1 text-xs text-slate-500">{new Date(b.createdAt).toLocaleString('pt-BR')}</p>
                    <p className="mt-3 break-all font-mono text-xs text-slate-700">{b.hash}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {dispensacao && (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card icon={Hash} label="Hash do paciente" value={dispensacao.paciente_hash || dispensacao.pacienteHash || '—'} />
            <Card icon={MapPin} label="GPS da dispensação" value={`${dispensacao.latitude || '—'}, ${dispensacao.longitude || '—'}`} />
          </div>
        )}
      </section>
    </main>
  );
}

function Card({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
      <Icon className="text-blue-600" size={22} />
      <p className="mt-4 text-xs font-black uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 break-all text-sm font-black text-slate-800">{value}</p>
    </div>
  );
}
