import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Link2,
  Package,
  Pill,
  QrCode,
  ShieldCheck,
  Syringe,
  Thermometer,
  Truck,
} from 'lucide-react';

const kpis = [
  { label: 'Medicamentos', value: '2.456', trend: '+12%', icon: Pill, color: 'bg-violet-100 text-violet-600' },
  { label: 'Lotes ativos', value: '1.289', trend: '+8%', icon: Package, color: 'bg-blue-100 text-blue-600' },
  { label: 'Movimentações', value: '8.753', trend: '+18%', icon: Truck, color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Dispensações', value: '5.342', trend: '+15%', icon: Syringe, color: 'bg-orange-100 text-orange-600' },
];

const linhaData = [
  { dia: '28 Mai', total: 580 },
  { dia: '29 Mai', total: 980 },
  { dia: '30 Mai', total: 720 },
  { dia: '31 Mai', total: 1180 },
  { dia: '01 Jun', total: 1510 },
  { dia: '02 Jun', total: 1360 },
  { dia: '03 Jun', total: 1630 },
];

const donutData = [
  { name: 'CEAF Salvador', value: 2045 },
  { name: 'Policlínica Itapuã', value: 1216 },
  { name: 'UPA São Marcos', value: 1023 },
  { name: 'Outras unidades', value: 1058 },
];

const barData = [
  { nome: 'Adalimumabe', total: 480 },
  { nome: 'Etanercepte', total: 390 },
  { nome: 'Metotrexato', total: 340 },
  { nome: 'Omalizumabe', total: 280 },
  { nome: 'Secuquinumabe', total: 210 },
];

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#cbd5e1'];

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,.08)] ${className}`}>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-5 text-slate-950">
      <Card className="overflow-hidden">
        <div className="grid min-h-[280px] lg:grid-cols-[.9fr_1.1fr]">
          <div className="p-8 lg:p-10">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">
              Gestão inteligente
            </p>

            <h1 className="mt-5 max-w-xl text-4xl font-black leading-[1.02] tracking-[-0.055em] md:text-5xl">
              Rastreabilidade que transforma a saúde pública.
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600">
              Transparência, segurança e confiança em cada etapa da cadeia farmacêutica.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Blockchain', text: 'Imutável', icon: Link2 },
                { label: 'QR Code', text: 'Seguro', icon: QrCode },
                { label: 'Auditoria', text: 'Completa', icon: ShieldCheck },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                    <Icon className="text-blue-600" size={20} />
                    <p className="mt-3 text-xs font-black">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[280px] bg-gradient-to-br from-blue-50 via-slate-100 to-cyan-50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(59,130,246,.35),transparent_32%)]" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="w-full max-w-lg rounded-[32px] bg-white/70 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-white">
                    <QrCode size={32} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                      Lote rastreado
                    </p>
                    <p className="text-3xl font-black tracking-[-0.05em]">ADA-2026-042</p>
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  {['Hash SHA-256 validado', 'Temperatura conforme', 'Dispensação pseudonimizada'].map((x) => (
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
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="p-5">
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${kpi.color}`}>
                  <Icon size={22} />
                </div>
                <span className="flex items-center gap-1 text-xs font-black text-emerald-600">
                  {kpi.trend} <ArrowUpRight size={14} />
                </span>
              </div>
              <p className="mt-5 text-xs font-semibold text-slate-500">{kpi.label}</p>
              <p className="mt-1 text-3xl font-black tracking-[-0.05em]">{kpi.value}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_.9fr]">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">Movimentações</h2>
              <p className="text-xs text-slate-500">Últimos 7 dias</p>
            </div>
            <Activity className="text-blue-600" size={20} />
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={linhaData}>
              <defs>
                <linearGradient id="mov" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip />
              <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="url(#mov)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-black">Dispensações por unidade</h2>
          <p className="text-xs text-slate-500">Distribuição operacional</p>

          <div className="mt-6 grid items-center gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={donutData} dataKey="value" innerRadius={58} outerRadius={88} paddingAngle={4}>
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {donutData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-xs font-bold text-slate-700">{d.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_.9fr]">
        <Card className="p-6">
          <h2 className="text-lg font-black">Top medicamentos</h2>
          <p className="text-xs text-slate-500">Maior volume de dispensações</p>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis type="category" dataKey="nome" tick={{ fontSize: 11, fill: '#64748b' }} width={100} />
              <Tooltip />
              <Bar dataKey="total" fill="#2563eb" radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-black">Alertas críticos</h2>
          <p className="text-xs text-slate-500">Eventos que exigem atenção</p>

          <div className="mt-6 space-y-4">
            {[
              { title: 'Temperatura fora do padrão', desc: 'UPA Pau Miúdo', icon: Thermometer, color: 'text-red-500 bg-red-50' },
              { title: 'Lote próximo do vencimento', desc: 'ADA-2025-041 vence em 12 dias', icon: AlertTriangle, color: 'text-orange-500 bg-orange-50' },
              { title: 'Estoque baixo', desc: 'Dipirona 500mg', icon: Package, color: 'text-blue-500 bg-blue-50' },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.title} className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${a.color}`}>
                    <Icon size={19} />
                  </div>
                  <div>
                    <p className="text-sm font-black">{a.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{a.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
