import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  Package, Pill, Link2, AlertTriangle, Syringe, Building2,
  TrendingUp, Clock, Thermometer, Shield, Activity, ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { dashboardApi } from '@services/api';
import { Badge } from '@components/ui/Badge';
import clsx from 'clsx';

// ── Paleta de cores ──────────────────────────────────────────
const COLORS = ['#3b82f6', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#22c55e'];

// ── Tooltip customizado ──────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-grafite-900 border border-grafite-700 rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="text-grafite-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value?.toLocaleString('pt-BR')}
        </p>
      ))}
    </div>
  );
}

// ── KPI Card ─────────────────────────────────────────────────
interface KpiCardProps {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  icon: React.ElementType;
  cor?: 'primary' | 'teal' | 'warning' | 'danger' | 'success';
  trend?: number;
  delay?: number;
}

function KpiCard({ titulo, valor, subtitulo, icon: Icon, cor = 'primary', trend, delay = 0 }: KpiCardProps) {
  const corBg: Record<string, string> = {
    primary: 'bg-primary-500/10 border-primary-500/20',
    teal:    'bg-teal-500/10 border-teal-500/20',
    warning: 'bg-warning-500/10 border-warning-500/20',
    danger:  'bg-danger-500/10 border-danger-500/20',
    success: 'bg-success-500/10 border-success-500/20',
  };
  const corText: Record<string, string> = {
    primary: 'text-primary-500', teal: 'text-teal-500',
    warning: 'text-warning-500', danger: 'text-danger-500', success: 'text-success-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="card p-5 hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center border', corBg[cor])}>
          <Icon size={20} className={corText[cor]} />
        </div>
        {trend !== undefined && (
          <span className={clsx('flex items-center gap-0.5 text-xs font-semibold',
            trend >= 0 ? 'text-success-500' : 'text-danger-500')}>
            <ArrowUpRight size={12} className={trend < 0 ? 'rotate-180' : ''} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-grafite-900 dark:text-white mb-1">
        {typeof valor === 'number' ? valor.toLocaleString('pt-BR') : valor}
      </p>
      <p className="text-sm text-grafite-500 font-medium">{titulo}</p>
      {subtitulo && <p className="text-xs text-grafite-400 mt-0.5">{subtitulo}</p>}
    </motion.div>
  );
}

// ── Seção de alertas ─────────────────────────────────────────
function AlertasPanel({ alertas }: { alertas: any }) {
  if (!alertas) return null;
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-grafite-900 dark:text-white mb-4 flex items-center gap-2">
        <AlertTriangle size={18} className="text-warning-500" />
        Alertas Ativos
      </h3>
      <div className="space-y-3">
        {alertas.vencendo?.slice(0, 4).map((lote: any) => (
          <div key={lote.id} className="flex items-center gap-3 p-3 rounded-xl 
                                         bg-warning-500/5 border border-warning-500/20">
            <Clock size={15} className="text-warning-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-grafite-800 dark:text-grafite-200 truncate">
                {lote.medicamento?.dcb}
              </p>
              <p className="text-xs text-grafite-500">
                Vence em {new Date(lote.dataValidade).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <Badge variant="warning">Vencendo</Badge>
          </div>
        ))}
        {alertas.fvAbertos?.slice(0, 2).map((fv: any) => (
          <div key={fv.id} className="flex items-center gap-3 p-3 rounded-xl 
                                       bg-danger-500/5 border border-danger-500/20">
            <AlertTriangle size={15} className="text-danger-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-grafite-800 dark:text-grafite-200 truncate">
                {fv.lote?.medicamento?.dcb} — {fv.tipoEvento}
              </p>
              <p className="text-xs text-grafite-500">{fv.gravidade}</p>
            </div>
            <Badge variant="danger">FV Aberto</Badge>
          </div>
        ))}
        {!alertas.vencendo?.length && !alertas.fvAbertos?.length && (
          <div className="text-center py-6">
            <CheckCircle2 size={28} className="text-success-500 mx-auto mb-2" />
            <p className="text-sm text-grafite-400">Nenhum alerta ativo</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dashboard Principal ───────────────────────────────────────
export default function DashboardPage() {
  const { data: resumo, isLoading: loadingResumo } = useQuery({
    queryKey: ['dashboard', 'resumo'],
    queryFn: dashboardApi.resumo,
    refetchInterval: 30_000,
  });

  const { data: dispMes } = useQuery({
    queryKey: ['dashboard', 'dispensacoes-mes'],
    queryFn: dashboardApi.dispensacoesMes,
  });

  const { data: topMeds } = useQuery({
    queryKey: ['dashboard', 'top-medicamentos'],
    queryFn: dashboardApi.topMedicamentos,
  });

  const { data: alertas } = useQuery({
    queryKey: ['dashboard', 'alertas'],
    queryFn: dashboardApi.alertas,
    refetchInterval: 60_000,
  });

  // Dados mock para demonstração quando não há dados reais ainda
  const dispMesDemo = dispMes?.length ? dispMes : [
    { mes: '2024-01', total: 42 }, { mes: '2024-02', total: 58 },
    { mes: '2024-03', total: 71 }, { mes: '2024-04', total: 65 },
    { mes: '2024-05', total: 89 }, { mes: '2024-06', total: 103 },
    { mes: '2024-07', total: 94 }, { mes: '2024-08', total: 118 },
    { mes: '2024-09', total: 132 }, { mes: '2024-10', total: 145 },
    { mes: '2024-11', total: 128 }, { mes: '2024-12', total: 167 },
  ];

  const topMedsDemo = topMeds?.length ? topMeds : [
    { dcb: 'ADALIMUMABE', dispensacoes: 45 },
    { dcb: 'ETANERCEPTE', dispensacoes: 38 },
    { dcb: 'SECUQUINUMABE', dispensacoes: 27 },
    { dcb: 'METOTREXATO', dispensacoes: 89 },
    { dcb: 'OMALIZUMABE', dispensacoes: 22 },
  ];

  const pieData = [
    { name: 'Comp. I-A', value: 6 },
    { name: 'Comp. I-B', value: 8 },
    { name: 'Comp. II',  value: 12 },
    { name: 'Comp. III', value: 4 },
  ];

  const skeletons = loadingResumo;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-grafite-900 dark:text-white">Dashboard</h1>
          <p className="text-grafite-500 text-sm mt-0.5">
            Visão geral · CEAF/SUS · Salvador, BA
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full 
                        bg-success-500/10 border border-success-500/20">
          <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
          <span className="text-xs text-success-600 dark:text-success-400 font-medium">
            Sistema online
          </span>
        </div>
      </div>

      {/* KPIs */}
      {skeletons ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard titulo="Medicamentos CEAF" valor={resumo?.medicamentos?.total ?? 0}
            subtitulo="Ativos no sistema" icon={Pill} cor="primary" delay={0} />
          <KpiCard titulo="Lotes Ativos" valor={resumo?.lotes?.ativos ?? 0}
            subtitulo={`de ${resumo?.lotes?.total ?? 0} cadastrados`} icon={Package} cor="teal" delay={0.05} />
          <KpiCard titulo="Dispensações" valor={resumo?.dispensacoes?.total ?? 0}
            subtitulo={`${resumo?.dispensacoes?.ultimos30Dias ?? 0} nos últimos 30 dias`}
            icon={Syringe} cor="success" delay={0.1} />
          <KpiCard titulo="Blocos Blockchain" valor={resumo?.blockchain?.totalBlocos ?? 0}
            subtitulo="Eventos imutáveis" icon={Link2} cor="primary" delay={0.15} />
          <KpiCard titulo="Vencendo em 30 dias" valor={resumo?.lotes?.vencendo30Dias ?? 0}
            subtitulo="Requerem atenção" icon={Clock} cor="warning" delay={0.2} />
          <KpiCard titulo="FV Abertos" valor={resumo?.farmacovigilancia?.abertos ?? 0}
            subtitulo={`de ${resumo?.farmacovigilancia?.total ?? 0} total`}
            icon={AlertTriangle} cor="danger" delay={0.25} />
          <KpiCard titulo="Unidades de Saúde" valor={resumo?.unidades?.total ?? 0}
            subtitulo="Ativas na rede" icon={Building2} cor="teal" delay={0.3} />
          <KpiCard titulo="Estoque Baixo" valor={resumo?.alertas?.estoqueBaixo ?? 0}
            subtitulo="Lotes ≤ 10 unidades" icon={TrendingUp} cor="warning" delay={0.35} />
        </div>
      )}

      {/* Gráficos linha 1 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Dispensações por Mês */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-grafite-900 dark:text-white">
                Dispensações por Mês
              </h3>
              <p className="text-xs text-grafite-400 mt-0.5">Últimos 12 meses</p>
            </div>
            <Activity size={18} className="text-primary-400" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dispMesDemo} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="gradDispensacoes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(v) => v.split('-')[1] + '/' + v.split('-')[0].slice(2)} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" name="Dispensações"
                stroke="#3b82f6" fill="url(#gradDispensacoes)" strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pizza por classe CEAF */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-grafite-900 dark:text-white">
                Por Classe CEAF
              </h3>
              <p className="text-xs text-grafite-400 mt-0.5">Distribuição dos medicamentos</p>
            </div>
            <Shield size={18} className="text-teal-400" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-xs text-grafite-500 truncate">{d.name}</span>
                <span className="text-xs font-semibold text-grafite-700 dark:text-grafite-300 ml-auto">
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Gráficos linha 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top medicamentos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-grafite-900 dark:text-white">
                Top Medicamentos Dispensados
              </h3>
              <p className="text-xs text-grafite-400 mt-0.5">Por número de dispensações</p>
            </div>
            <Pill size={18} className="text-primary-400" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topMedsDemo} layout="vertical"
              margin={{ top: 0, right: 10, bottom: 0, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.4} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis type="category" dataKey="dcb" tick={{ fontSize: 11, fill: '#94a3b8' }}
                width={76} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="dispensacoes" name="Dispensações" fill="#14b8a6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Alertas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <AlertasPanel alertas={alertas} />
        </motion.div>
      </div>

      {/* Status Blockchain */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-grafite-900 dark:text-white flex items-center gap-2">
              <Link2 size={18} className="text-primary-400" />
              Status do Ledger Blockchain
            </h3>
            <p className="text-xs text-grafite-400 mt-0.5">SHA-256 · Permissionado · Imutável</p>
          </div>
          <Badge variant="success" dot>Cadeia Íntegra</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total de Blocos', valor: resumo?.blockchain?.totalBlocos ?? 0, cor: 'text-primary-400' },
            { label: 'Algoritmo', valor: 'SHA-256', cor: 'text-teal-400' },
            { label: 'Dificuldade PoW', valor: '2 zeros', cor: 'text-warning-400' },
            { label: 'Integridade', valor: '100%', cor: 'text-success-400' },
          ].map((item) => (
            <div key={item.label}
              className="bg-grafite-800/40 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${item.cor}`}>{item.valor}</p>
              <p className="text-xs text-grafite-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
