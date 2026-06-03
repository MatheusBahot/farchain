import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Link2, Shield, Search, BarChart3, Thermometer, AlertTriangle,
  QrCode, ArrowRight, CheckCircle2, Globe2, Package, Syringe,
  Lock, Activity, Database, ChevronRight, Star,
} from 'lucide-react';

/* ── Animação de entrada ao rolar ── */
function Reveal({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'left' | 'right';
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const variants = {
    up:    { hidden: { opacity: 0, y: 40 },  visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 40 },  visible: { opacity: 1, x: 0 } },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants[direction]}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Label de seção ── */
function SectionLabel({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                    bg-primary-500/10 border border-primary-500/20 mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
      <span className="text-xs font-semibold text-primary-300 uppercase tracking-widest">
        {text}
      </span>
    </div>
  );
}

/* ── Divisor decorativo ── */
function Divider() {
  return (
    <div className="flex items-center gap-4 my-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-grafite-700" />
      <div className="w-1.5 h-1.5 rounded-full bg-grafite-600" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-grafite-700" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="bg-grafite-950 text-white overflow-x-hidden font-sans">
      <Navbar />
      <HeroSection />
      <BandSection />
      <ProblemaSection />
      <SolucaoSection />
      <BlockchainSection />
      <FuncionalidadesSection />
      <BeneficiariosSection />
      <SegurancaSection />
      <CTASection />
      <Footer />
    </div>
  );
}

/* ── NAVBAR ─────────────────────────────────────────────────── */
function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 inset-x-0 z-50 h-16
                 bg-grafite-950/80 backdrop-blur-xl
                 border-b border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500
                          flex items-center justify-center">
            <Link2 size={16} className="text-white" />
          </div>
          <div className="leading-none">
            <span className="font-display font-bold text-[1.15rem] text-white">
              Far<span className="text-primary-400">Chain</span>
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          {['Solução', 'Blockchain', 'Funcionalidades', 'Segurança'].map((item) => (
            
              key={item}
              href={`#${item.toLowerCase()}`}
              className="px-4 py-2 rounded-lg text-sm text-grafite-400
                         hover:text-white hover:bg-white/5 transition-all duration-150"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <Link
          to="/login"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                     text-white bg-primary-600 hover:bg-primary-500
                     transition-all duration-200 shadow-lg shadow-primary-500/20"
        >
          Acessar Plataforma <ArrowRight size={15} />
        </Link>
      </div>
    </motion.nav>
  );
}

/* ── HERO ───────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">

      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-grafite-950 via-[#060d1f] to-grafite-950" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.15]" />

      {/* Blobs */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full
                      bg-primary-600/8 blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full
                      bg-teal-500/8 blur-[120px] animate-float"
           style={{ animationDelay: '3s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full
                       bg-white/[0.04] border border-white/[0.1] mb-10"
          >
            <Shield size={14} className="text-primary-400" />
            <span className="text-sm text-grafite-300">
              Blockchain Permissionado · SHA-256 · LGPD Compliant
            </span>
          </motion.div>

          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-[4.5rem] font-bold leading-[1.05]
                       tracking-[-0.02em] mb-6"
          >
            Todo medicamento
            <br />
            deixa um{' '}
            <span className="text-gradient">rastro</span>
            <br />
            no sistema.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-grafite-400 leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Plataforma para gestão de medicamentos, lotes, movimentações,
            dispensações, farmacovigilância e auditoria imutável na
            assistência farmacêutica.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/login"
              className="flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-base
                         text-white bg-gradient-to-r from-primary-600 to-primary-500
                         hover:from-primary-500 hover:to-primary-400
                         shadow-xl shadow-primary-500/25 transition-all duration-200
                         hover:scale-[1.02]"
            >
              Acessar Sistema <ArrowRight size={18} />
            </Link>
            
              href="#solução"
              className="flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-base
                         border border-grafite-700 text-grafite-300
                         hover:border-primary-500/50 hover:text-white hover:bg-primary-500/5
                         transition-all duration-200"
            >
              Conhecer solução <ChevronRight size={18} />
            </a>
          </motion.div>

          {/* Cadeia logística visual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 relative"
          >
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {[
                { label: 'Fabricante',  icon: '🏭' },
                { label: 'CAF Central', icon: '🏥' },
                { label: 'Unidade',     icon: '💊' },
                { label: 'Paciente',    icon: '👤' },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.1]
                                    flex items-center justify-center text-2xl
                                    hover:border-primary-500/30 transition-colors">
                      {step.icon}
                    </div>
                    <span className="text-xs text-grafite-500 font-medium">{step.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex items-center gap-1 pb-5">
                      <div className="w-8 h-px bg-gradient-to-r from-primary-500/30 to-teal-500/30" />
                      <div className="w-2 h-2 rounded-full bg-primary-500/40" />
                      <div className="w-8 h-px bg-gradient-to-r from-teal-500/30 to-primary-500/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-grafite-600 mt-4">
              ⛓ Cada etapa registrada imutavelmente na blockchain · SHA-256
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── BAND DE STATS ─────────────────────────────────────────── */
function BandSection() {
  const stats = [
    { valor: '12',   label: 'Distritos Sanitários',  desc: 'Salvador, BA' },
    { valor: '+200', label: 'Medicamentos CEAF',      desc: 'Rastreáveis' },
    { valor: '100%', label: 'Auditável',              desc: 'Blockchain imutável' },
    { valor: 'LGPD', label: 'Conformidade',           desc: 'Dados pseudonimizados' },
  ];

  return (
    <section className="border-y border-grafite-800/60 bg-grafite-900/30 py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-display text-4xl font-bold text-gradient mb-1">{s.valor}</p>
              <p className="font-semibold text-white text-sm">{s.label}</p>
              <p className="text-xs text-grafite-500 mt-0.5">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PROBLEMA ──────────────────────────────────────────────── */
function ProblemaSection() {
  const problemas = [
    { icon: AlertTriangle, titulo: 'Falta de rastreabilidade',
      desc: 'Medicamentos percorrem centenas de km sem registro confiável de cada etapa logística.' },
    { icon: Thermometer, titulo: 'Cadeia fria vulnerável',
      desc: 'Biológicos como adalimumabe exigem controle rigoroso que falhas não são detectadas a tempo.' },
    { icon: Search, titulo: 'Auditoria manual e frágil',
      desc: 'Processos em papel são vulneráveis a erros, adulterações e perdas difíceis de rastrear.' },
    { icon: Shield, titulo: 'Paciente sem proteção',
      desc: 'O paciente não tem acesso a informações sobre o medicamento que recebe, comprometendo segurança.' },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <SectionLabel text="O Problema" />
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Os desafios da rastreabilidade
            <br />farmacêutica no SUS
          </h2>
          <p className="text-grafite-400 text-lg max-w-2xl mx-auto leading-relaxed">
            O CEAF enfrenta desafios críticos que comprometem a segurança
            dos pacientes e a eficiência do sistema público de saúde.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5">
          {problemas.map((p, i) => (
            <Reveal key={p.titulo} delay={i * 0.1}>
              <div className="group flex gap-5 p-6 rounded-2xl bg-grafite-900/60
                              border border-grafite-800 hover:border-danger-500/20
                              transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-danger-500/10 border border-danger-500/20
                                flex items-center justify-center shrink-0
                                group-hover:bg-danger-500/15 transition-colors">
                  <p.icon size={20} className="text-danger-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">{p.titulo}</h3>
                  <p className="text-grafite-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SOLUÇÃO ───────────────────────────────────────────────── */
function SolucaoSection() {
  const recursos = [
    { icon: Link2,       titulo: 'Blockchain SHA-256',     desc: 'Ledger imutável com blocos encadeados criptograficamente.' },
    { icon: QrCode,      titulo: 'QR Code Criptografado',  desc: 'Consulta pública segura sem exposição de dados pessoais.' },
    { icon: Thermometer, titulo: 'Monitoramento Térmico',  desc: 'Alertas automáticos para desconformidades de temperatura.' },
    { icon: BarChart3,   titulo: 'Inteligência Analítica', desc: 'Dashboard com indicadores estratégicos em tempo real.' },
    { icon: AlertTriangle,titulo: 'Farmacovigilância',     desc: 'Registro de RAM e queixas vinculados ao lote blockchain.' },
    { icon: Globe2,      titulo: 'Gestão por Distrito',    desc: '12 Distritos Sanitários de Salvador/BA integrados.' },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-grafite-950 via-primary-950/10 to-grafite-950"
             id="solução">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <SectionLabel text="A Solução" />
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Mais que controle.
            <br />
            <span className="text-gradient">Entregamos rastreabilidade.</span>
          </h2>
          <p className="text-grafite-400 text-lg max-w-xl mx-auto leading-relaxed">
            Plataforma de padrão institucional que integra blockchain,
            IoT, farmacovigilância e analytics.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recursos.map((r, i) => (
            <Reveal key={r.titulo} delay={i * 0.07}>
              <div className="group p-6 rounded-2xl bg-grafite-900/60 border border-grafite-800
                              hover:border-primary-500/25 hover:bg-grafite-900
                              transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20
                                flex items-center justify-center mb-4
                                group-hover:bg-primary-500/15 transition-colors">
                  <r.icon size={20} className="text-primary-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{r.titulo}</h3>
                <p className="text-grafite-400 text-sm leading-relaxed">{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── BLOCKCHAIN ────────────────────────────────────────────── */
function BlockchainSection() {
  const eventos = [
    { tipo: 'CRIACAO_LOTE',   hash: 'a3f8b2c1...', ts: '09:14',  status: 'ok' },
    { tipo: 'ENTRADA_ESTOQUE',hash: 'b7d29e4f...', ts: '10:02',  status: 'ok' },
    { tipo: 'MOVIMENTACAO',   hash: 'c1e53a8d...', ts: '11:30',  status: 'ok' },
    { tipo: 'DISPENSACAO',    hash: 'd9f37c2a...', ts: '14:15',  status: 'ok' },
    { tipo: 'FARMACOVIG.',    hash: 'e2a41f9b...', ts: '15:42',  status: 'ok' },
  ];

  return (
    <section className="py-24 px-6" id="blockchain">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Texto */}
          <Reveal direction="left">
            <SectionLabel text="Blockchain Permissionado" />
            <h2 className="font-display text-4xl font-bold text-white mb-6">
              Ledger imutável para
              <br />cada evento farmacêutico
            </h2>
            <p className="text-grafite-400 leading-relaxed mb-8 text-lg">
              Cada evento relevante gera um bloco encadeado criptograficamente,
              garantindo rastreabilidade e imutabilidade completa da cadeia.
            </p>
            <div className="space-y-3">
              {[
                'Cadastro de medicamento e lote com hash único',
                'Entrada, movimentação e distribuição por unidade',
                'Dispensação anonimizada (LGPD) com registro blockchain',
                'Eventos de farmacovigilância vinculados ao lote',
                'Alertas de temperatura e falhas de cadeia fria',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={15} className="text-teal-400 shrink-0" />
                  <span className="text-grafite-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Terminal visual */}
          <Reveal direction="right" delay={0.15}>
            <div className="rounded-2xl border border-grafite-700 bg-grafite-900 overflow-hidden">
              {/* Barra do terminal */}
              <div className="flex items-center gap-2 px-5 py-3
                              bg-grafite-800/80 border-b border-grafite-700">
                <span className="w-3 h-3 rounded-full bg-danger-500/70" />
                <span className="w-3 h-3 rounded-full bg-warning-500/70" />
                <span className="w-3 h-3 rounded-full bg-success-500/70" />
                <span className="text-grafite-500 text-xs ml-2 font-mono">
                  farchain.ledger — live
                </span>
                <span className="ml-auto flex items-center gap-1.5 text-xs text-success-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
                  online
                </span>
              </div>

              {/* Blocos */}
              <div className="p-4 space-y-3 font-mono">
                {eventos.map((ev, i) => (
                  <motion.div
                    key={ev.hash}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.12 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl
                               bg-grafite-800/60 border border-grafite-700/60
                               hover:border-primary-500/30 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary-500/15 flex items-center
                                    justify-center text-xs font-bold text-primary-400">
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-primary-300">{ev.tipo}</p>
                      <p className="text-[10px] text-teal-500/80 truncate">{ev.hash}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-grafite-500">{ev.ts}</p>
                      <p className="text-[10px] text-success-400">✓ íntegro</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="px-5 py-3 bg-grafite-800/30 border-t border-grafite-700/50
                              flex items-center justify-between">
                <span className="text-xs text-grafite-500 font-mono">⛓ {eventos.length} blocos</span>
                <span className="text-xs text-success-400 font-semibold">● Cadeia íntegra</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── FUNCIONALIDADES ─────────────────────────────────────────── */
function FuncionalidadesSection() {
  const items = [
    { icon: Package,  titulo: 'Gestão de Lotes',          desc: 'Cadastro com GTIN, serialização e rastreabilidade SNCM.' },
    { icon: QrCode,   titulo: 'QR Code por Lote',          desc: 'QR criptografados com validação pública de autenticidade.' },
    { icon: Thermometer,titulo:'Cadeia Fria IoT',          desc: 'Integração com sensores para monitoramento contínuo.' },
    { icon: Database, titulo: 'Exportação de Dados',       desc: 'CSV, XLSX, PDF e JSON · Power BI · Metabase.' },
    { icon: Activity, titulo: 'IA Preditiva',              desc: 'Previsão de ruptura e detecção de anomalias.' },
    { icon: Globe2,   titulo: 'Mapa Geográfico',           desc: 'Visualização espacial com Leaflet/OpenStreetMap.' },
  ];

  return (
    <section className="py-24 px-6 bg-grafite-900/20" id="funcionalidades">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <SectionLabel text="Funcionalidades" />
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Tudo que a gestão
            <br />farmacêutica precisa
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <Reveal key={item.titulo} delay={i * 0.07}>
              <div className="group flex gap-4 p-6 rounded-2xl bg-grafite-900/60
                              border border-grafite-800
                              hover:border-teal-500/25 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20
                                flex items-center justify-center shrink-0
                                group-hover:bg-teal-500/15 transition-colors">
                  <item.icon size={18} className="text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">{item.titulo}</h3>
                  <p className="text-grafite-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── BENEFICIÁRIOS ─────────────────────────────────────────── */
function BeneficiariosSection() {
  const grupos = [
    {
      titulo: 'Pacientes',
      icon: '👤',
      itens: [
        'Consulta pública do histórico via QR Code',
        'Garantia de autenticidade e qualidade',
        'Proteção total dos dados (LGPD)',
      ],
    },
    {
      titulo: 'Farmacêuticos',
      icon: '💊',
      itens: [
        'Dispensação com rastreabilidade completa',
        'Alertas automáticos de vencimento',
        'Farmacovigilância integrada ao blockchain',
      ],
    },
    {
      titulo: 'Gestores',
      icon: '📊',
      itens: [
        'Dashboard analítico com KPIs em tempo real',
        'Trilha de auditoria imutável',
        'Relatórios exportáveis para controle',
      ],
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <SectionLabel text="Para quem é" />
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Benefícios para todo
            <br />o ecossistema do SUS
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {grupos.map((g, i) => (
            <Reveal key={g.titulo} delay={i * 0.12}>
              <div className="p-8 rounded-2xl bg-grafite-900/60 border border-grafite-800
                              hover:border-primary-500/20 transition-all duration-300 h-full">
                <div className="text-4xl mb-5">{g.icon}</div>
                <h3 className="font-display font-bold text-white text-xl mb-5">{g.titulo}</h3>
                <ul className="space-y-3">
                  {g.itens.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 size={15} className="text-teal-400 shrink-0 mt-0.5" />
                      <span className="text-grafite-300 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SEGURANÇA ─────────────────────────────────────────────── */
function SegurancaSection() {
  const itens = [
    { label: 'JWT + Refresh Tokens', desc: 'Autenticação stateless com renovação automática' },
    { label: 'Argon2id',             desc: 'Hash de senhas resistente a GPU e ASIC' },
    { label: 'RBAC Granular',        desc: '9 perfis com controle de acesso por endpoint' },
    { label: 'LGPD Compliant',       desc: 'CPF e dados pessoais anonimizados via SHA-256' },
    { label: 'Rate Limiting',        desc: 'Proteção contra DDoS e força bruta' },
    { label: 'Audit Log Imutável',   desc: 'Trilha completa de todas as ações críticas' },
  ];

  return (
    <section className="py-24 px-6" id="segurança">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <Reveal direction="left">
            <SectionLabel text="Segurança Avançada" />
            <h2 className="font-display text-4xl font-bold text-white mb-6">
              Segurança de padrão
              <br />
              <span className="text-gradient">corporativo e governamental</span>
            </h2>
            <p className="text-grafite-400 leading-relaxed mb-8 text-lg">
              Implementamos as melhores práticas de segurança da informação,
              conformidade com a LGPD e preparação para ICP-Brasil.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                         font-semibold text-sm text-white
                         bg-primary-600 hover:bg-primary-500
                         transition-all duration-200"
            >
              Acessar com Segurança <Lock size={15} />
            </Link>
          </Reveal>

          <Reveal direction="right" delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              {itens.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="p-5 rounded-2xl bg-grafite-900/60 border border-grafite-800
                             hover:border-teal-500/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={13} className="text-teal-400" />
                    <span className="font-semibold text-white text-sm">{item.label}</span>
                  </div>
                  <p className="text-grafite-500 text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── CTA ───────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden text-center py-20 px-8
                          bg-gradient-to-br from-primary-900 via-[#0c1e4a] to-teal-900
                          border border-primary-700/30">

            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2
                            w-96 h-24 bg-primary-400/15 blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                              bg-white/10 border border-white/20 mb-6">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-white font-medium">
                  Disponível para implantação em municípios
                </span>
              </div>
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                Pronto para transformar
                <br />
                a rastreabilidade farmacêutica?
              </h2>
              <p className="text-primary-200 text-lg mb-10 max-w-xl mx-auto">
                Acesse o FarChain e veja como a blockchain garante a segurança
                dos medicamentos do SUS na prática.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl
                           font-bold text-base text-primary-900 bg-white
                           hover:bg-primary-50 transition-all duration-200
                           shadow-2xl hover:scale-[1.02]"
              >
                Acessar FarChain <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── FOOTER ────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-grafite-800/60 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center
                        justify-between gap-8 mb-10">

          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500
                              flex items-center justify-center">
                <Link2 size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-white">
                Far<span className="text-primary-400">Chain</span>
              </span>
            </div>
            <p className="text-xs text-grafite-500 leading-relaxed">
              Plataforma de rastreabilidade farmacêutica para o Componente
              Especializado da Assistência Farmacêutica — CEAF/SUS.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-semibold text-white mb-3">Plataforma</p>
              <ul className="space-y-2 text-grafite-400">
                {['Dashboard','Medicamentos','Lotes','Blockchain'].map(l => (
                  <li key={l}>
                    <Link to="/login" className="hover:text-white transition-colors">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-3">Conformidade</p>
              <ul className="space-y-2 text-grafite-400">
                {['LGPD','ANVISA','SNCM','Lei 11.903/2009'].map(l => (
                  <li key={l} className="text-grafite-500 text-xs">{l}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Divider />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
          <p className="text-xs text-grafite-600">
            © {new Date().getFullYear()} FarChain · Assistência Farmacêutica · Salvador, BA
          </p>
          <div className="flex items-center gap-4 text-xs text-grafite-600">
            <span>Blockchain SHA-256</span>
            <span>·</span>
            <span>LGPD Compliant</span>
            <span>·</span>
            <span>NestJS · React · PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
