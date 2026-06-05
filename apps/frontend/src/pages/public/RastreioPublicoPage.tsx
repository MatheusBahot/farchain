import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Hash, Package, ShieldCheck } from 'lucide-react';
import { qrCodeApi } from '@services/api';

export default function RastreioPublicoPage() {
  const { hash } = useParams();
  const [data, setData] = useState<any>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        if (!hash) return;
        const response = await qrCodeApi.consultar(hash);
        setData(response.data?.data || response.data);
      } catch (error) {
        console.error(error);
        setErro(true);
      }
    }

    carregar();
  }, [hash]);

  if (erro) {
    return (
      <main className="min-h-screen bg-[#f5f5f7] p-6 text-slate-950">
        <section className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 shadow-xl">
          <AlertTriangle className="text-amber-500" size={34} />
          <h1 className="mt-5 text-3xl font-black">Registro não encontrado</h1>
          <p className="mt-3 text-sm text-slate-500">
            Não foi possível localizar o QR Code informado.
          </p>
        </section>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#f5f5f7] p-6 text-slate-950">
        <section className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 shadow-xl">
          Carregando rastreabilidade...
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] p-6 text-slate-950">
      <section className="mx-auto max-w-5xl rounded-[32px] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,.12)]">
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">
          Consulta pública FarmaChain
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-[-0.055em]">
          Rastreabilidade do medicamento
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Consulta pública de autenticidade, lote, validade e integridade
          blockchain do medicamento.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card icon={Package} label="Medicamento" value={data.medicamento?.dcb || data.medicamento?.nomeComercial || '—'} />
          <Card icon={ShieldCheck} label="Status" value={data.statusConsulta || 'ÍNTEGRO'} />
          <Card icon={Hash} label="Hash" value={data.lote?.hashCriptografico || data.blockchain?.ultimoHash || '—'} />
        </div>

        <div className="mt-8 rounded-[28px] bg-slate-50 p-6">
          <h2 className="text-xl font-black">Dados do lote</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Info label="Número do lote" value={data.lote?.numeroLote} />
            <Info label="Fabricante" value={data.lote?.fabricante || data.medicamento?.fabricante} />
            <Info label="Forma farmacêutica" value={data.medicamento?.formaFarmaceutica} />
            <Info label="Classe CEAF" value={data.medicamento?.classeCEAF} />
            <Info label="Validade" value={data.lote?.dataValidade ? new Date(data.lote.dataValidade).toLocaleDateString('pt-BR') : '—'} />
            <Info label="Eventos blockchain" value={String(data.blockchain?.totalEventos || '—')} />
          </div>
        </div>

        {data.historico?.length > 0 && (
          <div className="mt-8 rounded-[28px] bg-slate-50 p-6">
            <h2 className="text-xl font-black">Histórico</h2>
            <div className="mt-5 space-y-3">
              {data.historico.map((h: any, i: number) => (
                <div key={i} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                  <CheckCircle2 className="text-emerald-500" size={18} />
                  <p className="mt-2 text-sm font-black">{h.tipo || h.evento || 'Evento registrado'}</p>
                  <p className="mt-1 text-xs text-slate-500">{h.createdAt || h.data || '—'}</p>
                </div>
              ))}
            </div>
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
      <p className="mt-1 break-all text-sm font-black">{value || '—'}</p>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 break-all text-sm font-bold text-slate-800">{value || '—'}</p>
    </div>
  );
}
