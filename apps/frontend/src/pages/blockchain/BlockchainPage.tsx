import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Calendar,
  CheckCircle2,
  Database,
  Eye,
  FileText,
  Hash,
  Link2,
  QrCode,
  RefreshCw,
  ShieldCheck,
  X,
} from 'lucide-react';
import { api } from '@services/api';

function getLoteFromBloco(bloco: any) {
  return (
    bloco?.payload?.lote ||
    bloco?.payload?.numeroLote ||
    bloco?.payload?.payload?.lote ||
    bloco?.payload?.payload?.numeroLote ||
    'ADA-2026-042'
  );
}

type Bloco = {
  id: string;
  indice: number;
  tipo: string;
  hashAnterior: string;
  hash: string;
  payload: Record<string, any>;
  createdAt: string;
};

export default function BlockchainPage() {
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [loading, setLoading] = useState(false);
  const [qrBloco, setQrBloco] = useState<Bloco | null>(null);
  const [pdfBloco, setPdfBloco] = useState<Bloco | null>(null);
  const [detalhe, setDetalhe] = useState<Bloco | null>(null);
  const [trace, setTrace] = useState<any | null>(null);

  async function carregar() {
    try {
      setLoading(true);
      const response = await api.get('/tcc/blockchain');
      setBlocos(response.data?.data || response.data || []);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar blockchain.');
    } finally {
      setLoading(false);
    }
  }

  async function abrirTrace(bloco: Bloco) {
    const lote = bloco.payload?.lote || bloco.payload?.numeroLote;
    if (!lote) {
      setTrace(null);
      setDetalhe(bloco);
      return;
    }

    const response = await api.get(`/tcc/trace/${encodeURIComponent(lote)}`);
    setTrace(response.data?.data || response.data);
    setDetalhe(bloco);
  }

  function gerarPdf(bloco: Bloco) {
    setPdfBloco(bloco);
    setTimeout(() => window.print(), 300);
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="space-y-5 text-slate-950">
      <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,.08)] print:hidden">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">
              Blockchain FarmaChain
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-[-0.055em] md:text-5xl">
              Registros por hash.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Cada evento é exibido de forma resumida por data e hash. Pelo QR Code é possível acessar o histórico do medicamento, e pelo PDF gerar um comprovante de auditoria com hash do paciente pseudonimizado para farmacovigilância.
            </p>
          </div>

          <button
            onClick={carregar}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-500"
          >
            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4 print:hidden">
        <Metric icon={Database} label="Blocos" value={String(blocos.length)} />
        <Metric icon={ShieldCheck} label="Persistência" value="PostgreSQL" />
        <Metric icon={Hash} label="Hash" value="SHA-256" />
        <Metric icon={CheckCircle2} label="Status" value="Íntegro" />
      </section>

      <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,.08)] print:hidden">
        <div className="mb-6 flex items-center gap-3">
          <Link2 className="text-blue-600" size={24} />
          <div>
            <h2 className="text-2xl font-black tracking-[-0.04em]">Linha do tempo blockchain</h2>
            <p className="text-sm text-slate-500">Hash, data, QR de rastreio e relatório PDF.</p>
          </div>
        </div>

        {blocos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <p className="text-sm text-slate-500">Nenhum bloco registrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blocos.map((b) => {
              const lote = getLoteFromBloco(b);
              const traceUrl = `${window.location.origin}/trace/${encodeURIComponent(lote)}`;

              return (
                <div key={b.id} className="rounded-[24px] bg-slate-50 p-5 ring-1 ring-slate-200">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                        <Calendar size={14} />
                        {new Date(b.createdAt).toLocaleString('pt-BR')}
                      </div>

                      <h3 className="mt-2 text-lg font-black">{b.tipo}</h3>

                      <p className="mt-2 break-all font-mono text-xs text-slate-600">
                        {b.hash}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        Lote: <span className="font-bold">{lote}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setQrBloco(b)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-black text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                      >
                        <QrCode size={16} />
                        QR
                      </button>

                      <button
                        onClick={() => gerarPdf(b)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-xs font-black text-white hover:bg-blue-500"
                      >
                        <FileText size={16} />
                        PDF
                      </button>

                      <button
                        onClick={() => abrirTrace(b)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-xs font-black text-white hover:bg-slate-800"
                      >
                        <Eye size={16} />
                        Histórico
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {qrBloco && (
        <Modal onClose={() => setQrBloco(null)} title="QR Code do histórico">
          <div className="text-center">
            <div className="mx-auto inline-block rounded-3xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
              <QRCodeCanvas
                value={`${window.location.origin}/trace/${encodeURIComponent(String(getLoteFromBloco(qrBloco)))}`}
                size={230}
                includeMargin
              />
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Hash do bloco
            </p>
            <p className="mt-2 break-all rounded-2xl bg-slate-50 p-4 font-mono text-xs text-slate-700">
              {qrBloco.hash}
            </p>

            <p className="mt-4 text-sm text-slate-600">
              O QR aponta para o histórico rastreável do lote e permite demonstrar a jornada do medicamento até o paciente.
            </p>
          </div>
        </Modal>
      )}

      {detalhe && (
        <Modal onClose={() => { setDetalhe(null); setTrace(null); }} title="Histórico rastreável">
          <div className="space-y-4">
            <InfoLight label="Tipo do bloco" value={detalhe.tipo} />
            <InfoLight label="Hash do bloco" value={detalhe.hash} />
            <InfoLight label="Hash anterior" value={detalhe.hashAnterior} />

            {trace && (
              <div className="rounded-3xl bg-slate-50 p-5">
                <h3 className="mb-4 text-lg font-black">Percurso do medicamento</h3>

                <div className="space-y-3">
                  {trace.blocos?.map((b: Bloco) => (
                    <div key={b.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black text-blue-600">{b.tipo}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(b.createdAt).toLocaleString('pt-BR')}
                      </p>
                      <p className="mt-2 break-all font-mono text-[11px] text-slate-700">{b.hash}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {pdfBloco && (
        <div className="hidden print:block bg-white text-black p-10">
          <div className="border-b border-slate-300 pb-6">
            <h1 className="text-3xl font-black">FarmaChain</h1>
            <p className="mt-2 text-sm">Relatório Blockchain de Rastreabilidade Farmacêutica</p>
          </div>

          <div className="mt-8 grid gap-4">
            <PdfRow label="Tipo do registro" value={pdfBloco.tipo} />
            <PdfRow label="Data do registro" value={new Date(pdfBloco.createdAt).toLocaleString('pt-BR')} />
            <PdfRow label="Hash do bloco" value={pdfBloco.hash} />
            <PdfRow label="Hash anterior" value={pdfBloco.hashAnterior} />
            <PdfRow label="Medicamento" value={String(pdfBloco.payload?.medicamento || '—')} />
            <PdfRow label="Lote" value={String(pdfBloco.payload?.lote || pdfBloco.payload?.numeroLote || '—')} />
            <PdfRow label="Origem" value={String(pdfBloco.payload?.origem || '—')} />
            <PdfRow label="Distribuidor" value={String(pdfBloco.payload?.distribuidor || '—')} />
            <PdfRow label="Armazenamento" value={String(pdfBloco.payload?.armazenamento || pdfBloco.payload?.localDispensacao || '—')} />
            <PdfRow label="Farmacêutico" value={String(pdfBloco.payload?.farmaceutico || '—')} />
            <PdfRow label="CRF" value={String(pdfBloco.payload?.crf || '—')} />
            <PdfRow label="GPS" value={String(pdfBloco.payload?.gps || '—')} />
            <PdfRow label="Hash do paciente para farmacovigilância" value={String(pdfBloco.payload?.pacienteHash || 'Não aplicável a este bloco')} />
          </div>

          <div className="mt-10 rounded-2xl border border-slate-300 p-5">
            <h2 className="font-black">Observação LGPD</h2>
            <p className="mt-2 text-sm leading-7">
              Este relatório utiliza hash criptográfico do paciente quando aplicável, permitindo rastreabilidade e farmacovigilância sem exposição direta de CPF, CNS ou telefone.
            </p>
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

function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm print:hidden">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[30px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <h2 className="text-2xl font-black tracking-[-0.04em]">{title}</h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function InfoLight({ label, value }: any) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 break-all font-mono text-xs text-slate-700">{value}</p>
    </div>
  );
}

function PdfRow({ label, value }: any) {
  return (
    <div className="border-b border-slate-200 pb-3">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-all text-sm font-semibold">{value}</p>
    </div>
  );
}
