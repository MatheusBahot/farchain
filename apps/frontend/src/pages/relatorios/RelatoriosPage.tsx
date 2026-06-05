import {
  BarChart3,
  Database,
  FileText,
  ShieldCheck,
  Pill,
  QrCode,
  AlertTriangle,
} from 'lucide-react';
import ExportButton from '@components/ui/ExportButton';

const reports = [
  { title: 'Medicamentos', desc: 'Cadastro, status regulatório, classes e apresentações.', icon: Pill },
  { title: 'Lotes', desc: 'Validade, QR Code, origem, fabricante e auditoria.', icon: QrCode },
  { title: 'Movimentações', desc: 'Entradas, saídas, transferências e transporte.', icon: Database },
  { title: 'Dispensações', desc: 'Entrega, unidade, lote e dados pseudonimizados.', icon: FileText },
  { title: 'Farmacovigilância', desc: 'RAM, queixas técnicas, gravidade e causalidade.', icon: AlertTriangle },
  { title: 'Blockchain', desc: 'Blocos, hashes, integridade e eventos auditáveis.', icon: ShieldCheck },
];

export default function RelatoriosPage() {
  return (
    <div className="space-y-5 text-slate-950">
      <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">
              Relatórios institucionais
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.055em] md:text-5xl">
              Exportações, indicadores e conformidade.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Gere relatórios operacionais em CSV, JSON, TSV ou PDF via impressão,
              mantendo rastreabilidade, integridade e atenção à LGPD.
            </p>
          </div>

          <ExportButton
            filename="relatorio-farchain"
            data={[
              { modulo: 'Medicamentos', total: 2456, status: 'Ativo' },
              { modulo: 'Lotes', total: 1289, status: 'Monitorado' },
              { modulo: 'Blockchain', total: 12904, status: 'Íntegro' },
            ]}
          />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.title} className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Icon size={22} />
              </div>
              <h2 className="mt-8 text-xl font-black">{r.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{r.desc}</p>
              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <div className="mb-2 h-2 w-2/3 rounded-full bg-blue-200" />
                <div className="mb-2 h-2 w-5/6 rounded-full bg-slate-200" />
                <div className="h-2 w-1/2 rounded-full bg-slate-200" />
              </div>
            </div>
          );
        })}
      </section>

      <section className="rounded-[26px] border border-blue-100 bg-blue-50 p-6 text-blue-950">
        <div className="flex gap-4">
          <ShieldCheck className="mt-1 text-blue-600" size={22} />
          <div>
            <h3 className="font-black">Aviso LGPD</h3>
            <p className="mt-2 text-sm leading-7">
              Relatórios públicos ou compartilháveis devem utilizar dados anonimizados
              ou pseudonimizados. Dados pessoais sensíveis devem permanecer restritos
              aos perfis autorizados.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
