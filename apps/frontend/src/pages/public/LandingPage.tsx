import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Link2, Shield, Search, BarChart3, Thermometer, AlertTriangle,
  QrCode, ArrowRight, ChevronDown, CheckCircle2, Globe2,
  Package, Syringe, FileText, Lock, Zap, Users, Building2,
  Activity, Database, Cpu,
} from 'lucide-react';

// ============================================================
// Animação reutilizável
// ============================================================
function FadeInSection({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// Componentes de seção
// ============================================================
function SectionBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                     bg-primary-500/10 border border-primary-500/20 
                     text-primary-400 text-xs font-semibold tracking-wide uppercase mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
      {label}
    </span>
  );
}

// ============================================================
// LANDING PAGE
// ============================================================
export default function LandingPage() {
  return (
    <div className="bg-grafite-950 text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <StatsSection />
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

// ============================================================
// NAVBAR
// ============================================================
function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center
                 bg-grafite-950/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="container-farchain flex items-center justify-between w-full px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 
                          flex items-center justify-center shadow-glow-blue">
            <Link2 size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl">
            Far<span className="text-primary-400">Chain</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {['Solução', 'Blockchain', 'Funcionalidades', 'Segurança'].map((item) => (
            
              key={item}
              href={`#${item.toLowerCase()}`}
              className="px-4 py-2 rounded-lg text-sm text-grafite-400 hover:text-white 
                         hover:bg-white/5 transition-all duration-150"
            >
              {item}
            </a>
          ))}
        </nav>

        <Link
          to="/login"
          className="btn-primary text-sm px-5 py-2.5 shadow-glow-blue"
        >
          Acessar Plataforma <ArrowRight size={15} />
        </Link>
      </div>
    </motion.header>
  );
}

// ============================================================
// HERO
// ============================================================
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-grafite-950 via-primary-950/30 to-grafite-950" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full 
                      bg-primary-600/10 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full 
                      bg-teal-500/10 blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="container-farchain relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                            bg-primary-500/10 border border-primary-500/20 mb-8">
              <Shield size={14} className="text-primary-400" />
              <span className="text-sm text-primary-300 font-medium">
                Blockchain Permissionado · SHA-256 · LGPD Compliant
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 text-balance"
          >
            Rastreabilidade farmacêutica{' '}
            <span className="text-gradient">baseada em blockchain</span>{' '}
            para o SUS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-grafite-300 leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            O FarChain garante transparência total, auditoria imutável e segurança 
            na cadeia logística de medicamentos de alto custo do CEAF, 
            protegendo pacientes e gestores do SUS.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login" className="btn-primary text-base px-8 py-4 shadow-glow-blue">
              Acessar Plataforma <ArrowRight size={18} />
            </Link>
            <a href="#solução" className="btn-secondary text-base px-8 py-4">
              Conhecer a Solução <ChevronDown size={18} />
            </a>
          </motion.div>

          {/* Chain visual */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-20 relative"
          >
            <div className="flex items-center justify-center gap-0 overflow-x-auto no-scrollbar py-4">
              {[
                { icon: Package, label: 'Fabricante', color: 'primary' },
                { icon: Building2, label: 'CAF Central', color: 'teal' },
                { icon: ArrowRight, label: '', color: 'gray', isArrow: true },
                { icon: Building2, label: 'Unidade', color: 'primary' },
                { icon: Syringe, label: 'Paciente', color: 'teal' },
              ].map((step, i) =>
                step.isArrow ? (
                  <div key={i} className="flex items-center px-2">
                    <div className="w-12 h-px bg-gradient-to-r from-primary-500/50 to-teal-500/50" />
                    <ArrowRight size={14} className="text-grafite-600" />
                  </div>
                ) : (
                  <div key={i} className="flex flex-col items-center gap-2 mx-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
                                    ${step.color === 'primary' 
                                      ? 'bg-primary-500/20 border border-primary-500/30'
                                      : 'bg-teal-500/20 border border-teal-500/30'}`}>
                      <step.icon size={22} className={step.color === 'primary' ? 'text-primary-400' : 'text-teal-400'} />
                    </div>
                    <span className="text-xs text-grafite-500 whitespace-nowrap">{step.label}</span>
                  </div>
                )
              )}
            </div>
            <p className="text-center text-xs text-grafite-600 mt-2">
              ⛓️ Cada etapa registrada imutavelmente na blockchain
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// STATS
// ============================================================
function StatsSection() {
  const stats = [
    { valor: '12', label: 'Distritos Sanitários', desc: 'Salvador, BA' },
    { valor: '+200', label: 'Medicamentos CEAF', desc: 'Catalogados e rastreáveis' },
    { valor: '100%', label: 'Auditável', desc: 'Blockchain imutável' },
    { valor: 'LGPD', label: 'Conformidade', desc: 'Dados pseudonimizados' },
  ];

  return (
    <section className="py-16 border-y border-white/5 bg-grafite-900/50">
      <div className="container-farchain px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <FadeInSection key={stat.label} delay={i * 0.1}>
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-gradient mb-1">
                  {stat.valor}
                </p>
                <p className="font-semibold text-white text-sm">{stat.label}</p>
                <p className="text-grafite-500 text-xs mt-1">{stat.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PROBLEMA
// ============================================================
function ProblemaSection() {
  const problemas = [
    {
      icon: AlertTriangle,
      titulo: 'Falta de rastreabilidade',
      desc: 'Medicamentos de alto custo percorrem centenas de quilômetros sem registro confiável de cada etapa da cadeia logística.',
      cor: 'danger',
    },
    {
      icon: Thermometer,
      titulo: 'Cadeia fria vulnerável',
      desc: 'Biológicos como adalimumabe e etanercepte exigem controle rigoroso de temperatura, mas falhas são frequentes e não detectadas.',
      cor: 'warning',
    },
    {
      icon: FileText,
      titulo: 'Auditoria manual e frágil',
      desc: 'Processos baseados em papel ou planilhas são vulneráveis a erros, adulterações e perdas, dificultando a responsabilização.',
      cor: 'danger',
    },
    {
      icon: Users,
      titulo: 'Paciente sem informação',
      desc: 'O paciente não tem acesso a informações sobre o medicamento que recebe, comprometendo sua segurança e autonomia.',
      cor: 'warning',
    },
  ];

  return (
    <section className="py-24 px-6" id="problema">
      <div className="container-farchain">
        <FadeInSection className="text-center mb-16">
          <SectionBadge label="O Problema" />
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Os desafios da rastreabilidade<br />farmacêutica no SUS
          </h2>
          <p className="text-grafite-400 text-lg max-w-2xl mx-auto">
            O Componente Especializado da Assistência Farmacêutica enfrenta 
            desafios críticos que comprometem a segurança dos pacientes e 
            a eficiência do sistema público de saúde.
          </p>
        </FadeInSection>

        <div className="grid md:grid-cols-2 gap-6">
          {problemas.map((p, i) => (
            <FadeInSection key={p.titulo} delay={i * 0.1}>
              <div className="card p-6 hover:border-danger-500/30 transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center
                                 ${p.cor === 'danger' 
                                   ? 'bg-danger-500/10 border border-danger-500/20'
                                   : 'bg-warning-500/10 border border-warning-500/20'}`}>
                  <p.icon size={22} className={p.cor === 'danger' ? 'text-danger-400' : 'text-warning-400'} />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{p.titulo}</h3>
                <p className="text-grafite-400 leading-relaxed">{p.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SOLUÇÃO
// ============================================================
function SolucaoSection() {
  const recursos = [
    { icon: Link2, titulo: 'Blockchain SHA-256', desc: 'Ledger imutável que registra cada evento da cadeia farmacêutica com hash criptográfico.' },
    { icon: QrCode, titulo: 'QR Code Criptografado', desc: 'Rastreamento por QR Code com consulta pública segura sem exposição de dados pessoais.' },
    { icon: Thermometer, titulo: 'Monitoramento Térmico', desc: 'Alertas automáticos para desconformidades de temperatura em medicamentos biológicos.' },
    { icon: BarChart3, titulo: 'Inteligência Analítica', desc: 'Dashboard com indicadores estratégicos, gráficos interativos e exportação de dados.' },
    { icon: Shield, titulo: 'Farmacovigilância', desc: 'Registro de RAM, queixas técnicas e eventos adversos vinculados ao lote blockchain.' },
    { icon: Globe2, titulo: 'Gestão por Distrito', desc: 'Controle descentralizado pelos 12 Distritos Sanitários de Salvador/BA.' },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-grafite-950 to-primary-950/20" id="solução">
      <div className="container-farchain">
        <FadeInSection className="text-center mb-16">
          <SectionBadge label="A Solução" />
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            FarChain: ecossistema completo de<br />
            <span className="text-gradient">rastreabilidade farmacêutica</span>
          </h2>
          <p className="text-grafite-400 text-lg max-w-2xl mx-auto">
            Uma plataforma tecnológica de padrão institucional que integra 
            blockchain, IoT, farmacovigilância e inteligência analítica 
            para garantir a segurança da cadeia farmacêutica do SUS.
          </p>
        </FadeInSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recursos.map((r, i) => (
            <FadeInSection key={r.titulo} delay={i * 0.08}>
              <div className="card-hover p-6 group">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20
                                flex items-center justify-center mb-4 
                                group-hover:bg-primary-500/20 transition-colors">
                  <r.icon size={22} className="text-primary-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{r.titulo}</h3>
                <p className="text-grafite-400 text-sm leading-relaxed">{r.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// BLOCKCHAIN
// ============================================================
function BlockchainSection() {
  const eventos = [
    { tipo: 'CRIACAO_LOTE', hash: 'a3f8...1b2c', ts: '09:14:23', status: 'ok' },
    { tipo: 'ENTRADA_ESTOQUE', hash: 'b7d2...9e4f', ts: '10:02:11', status: 'ok' },
    { tipo: 'MOVIMENTACAO_CAF', hash: 'c1e5...3a8d', ts: '11:30:47', status: 'ok' },
    { tipo: 'DISPENSACAO', hash: 'd9f3...7c2a', ts: '14:15:09', status: 'ok' },
  ];

  return (
    <section className="py-24 px-6" id="blockchain">
      <div className="container-farchain">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeInSection>
            <SectionBadge label="Blockchain Permissionado" />
            <h2 className="font-display text-4xl font-bold text-white mb-6">
              Ledger imutável para cada evento farmacêutico
            </h2>
            <p className="text-grafite-400 leading-relaxed mb-8">
              O FarChain implementa um ledger blockchain permissionado com 
              SHA-256, onde cada evento relevante gera um bloco encadeado 
              criptograficamente, garantindo imutabilidade e rastreabilidade completa.
            </p>
            <div className="space-y-4">
              {[
                'Cadastro de medicamento e lote',
                'Entrada, movimentação e distribuição',
                'Dispensação ao paciente (dados anonimizados)',
                'Eventos de farmacovigilância',
                'Alertas de temperatura e cadeia fria',
                'Auditorias e recolhimentos sanitários',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-teal-400 shrink-0" />
                  <span className="text-grafite-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            {/* Visualização do ledger */}
            <div className="bg-grafite-900 rounded-3xl border border-grafite-800 p-6 font-mono">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-danger-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-warning-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-success-500" />
                <span className="text-grafite-500 text-xs ml-2">farchain.ledger</span>
              </div>
              <div className="space-y-3">
                {eventos.map((ev, i) => (
                  <motion.div
                    key={ev.hash}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                    className="bg-grafite-800/50 rounded-xl p-4 border border-grafite-700/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-primary-400 text-xs font-semibold">{ev.tipo}</span>
                      <span className="text-grafite-500 text-xs">{ev.ts}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-grafite-500 text-xs">SHA-256:</span>
                      <span className="text-teal-400 text-xs">{ev.hash}</span>
                      <span className="text-xs ml-auto">
                        <span className="inline-flex items-center gap-1 text-success-500">
                          <CheckCircle2 size={10} /> íntegro
                        </span>
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-grafite-800 flex items-center justify-between">
                <span className="text-grafite-500 text-xs">⛓️ Cadeia validada</span>
                <span className="text-success-500 text-xs font-semibold">● 4 blocos · 0 adulterações</span>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FUNCIONALIDADES
// ============================================================
function FuncionalidadesSection() {
  const funcionalidades = [
    { icon: Package, titulo: 'Gestão de Lotes', desc: 'Cadastro completo com rastreabilidade por número de lote, GTIN e serialização SNCM.' },
    { icon: QrCode, titulo: 'QR Code por Lote', desc: 'QR Codes criptografados para consulta pública com validação de autenticidade.' },
    { icon: Activity, titulo: 'Cadeia Fria IoT', desc: 'Integração com sensores IoT para monitoramento contínuo de temperatura e umidade.' },
    { icon: Database, titulo: 'Exportação de Dados', desc: 'Exportação para CSV, XLSX, PDF e JSON com integração Power BI e Metabase.' },
    { icon: Cpu, titulo: 'IA Preditiva', desc: 'Previsão de ruptura de estoque e detecção de anomalias com machine learning.' },
    { icon: Globe2, titulo: 'Mapa Geográfico', desc: 'Visualização espacial das movimentações no mapa de Salvador/BA com Leaflet.' },
  ];

  return (
    <section className="py-24 px-6 bg-grafite-900/30" id="funcionalidades">
      <div className="container-farchain">
        <FadeInSection className="text-center mb-16">
          <SectionBadge label="Funcionalidades" />
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Tudo que a gestão farmacêutica precisa
          </h2>
        </FadeInSection>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funcionalidades.map((f, i) => (
            <FadeInSection key={f.titulo} delay={i * 0.08}>
              <div className="card p-6 group hover:border-teal-500/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20
                                flex items-center justify-center mb-4">
                  <f.icon size={18} className="text-teal-400" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{f.titulo}</h3>
                <p className="text-grafite-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// BENEFICIÁRIOS
// ============================================================
function BeneficiariosSection() {
  const grupos = [
    {
      titulo: 'Pacientes',
      icon: Users,
      cor: 'primary',
      beneficios: [
        'Consulta pública do histórico do medicamento via QR Code',
        'Garantia de autenticidade e qualidade do produto',
        'Proteção total dos dados pessoais (LGPD)',
      ],
    },
    {
      titulo: 'Farmacêuticos',
      icon: Syringe,
      cor: 'teal',
      beneficios: [
        'Dispensação com rastreabilidade completa',
        'Alertas automáticos de vencimento e cadeia fria',
        'Farmacovigilância integrada ao blockchain',
      ],
    },
    {
      titulo: 'Gestores e Auditores',
      icon: BarChart3,
      cor: 'primary',
      beneficios: [
        'Dashboard analítico com KPIs em tempo real',
        'Trilha de auditoria imutável e completa',
        'Relatórios exportáveis para órgãos de controle',
      ],
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="container-farchain">
        <FadeInSection className="text-center mb-16">
          <SectionBadge label="Para quem é" />
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Benefícios para todo o ecossistema do SUS
          </h2>
        </FadeInSection>
        <div className="grid md:grid-cols-3 gap-8">
          {grupos.map((g, i) => (
            <FadeInSection key={g.titulo} delay={i * 0.15}>
              <div className="card p-8 h-full">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6
                                 ${g.cor === 'primary'
                                   ? 'bg-primary-500/10 border border-primary-500/20'
                                   : 'bg-teal-500/10 border border-teal-500/20'}`}>
                  <g.icon size={22} className={g.cor === 'primary' ? 'text-primary-400' : 'text-teal-400'} />
                </div>
                <h3 className="font-display font-bold text-white text-xl mb-5">{g.titulo}</h3>
                <ul className="space-y-3">
                  {g.beneficios.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <CheckCircle2 size={15} className="text-teal-400 shrink-0 mt-0.5" />
                      <span className="text-grafite-300 text-sm leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SEGURANÇA
// ============================================================
function SegurancaSection() {
  const itens = [
    { label: 'JWT + Refresh Tokens', desc: 'Autenticação stateless com renovação automática segura' },
    { label: 'Argon2id', desc: 'Hash de senhas resistente a GPU e ASIC' },
    { label: 'RBAC Granular', desc: 'Controle de acesso baseado em perfis e permissões' },
    { label: 'LGPD Compliant', desc: 'CPF e dados pessoais anonimizados via SHA-256' },
    { label: 'Rate Limiting', desc: 'Proteção contra DDoS e força bruta' },
    { label: 'Audit Log Imutável', desc: 'Trilha completa de todas as ações críticas' },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-grafite-950 to-grafite-900/50" id="segurança">
      <div className="container-farchain">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeInSection>
            <SectionBadge label="Segurança Avançada" />
            <h2 className="font-display text-4xl font-bold text-white mb-6">
              Segurança de padrão<br />
              <span className="text-gradient">corporativo e governamental</span>
            </h2>
            <p className="text-grafite-400 leading-relaxed mb-8">
              O FarChain implementa as melhores práticas de segurança da informação, 
              conformidade com a LGPD e preparação para integração com ICP-Brasil 
              e assinaturas digitais legalmente válidas.
            </p>
            <Link to="/login" className="btn-primary">
              Acessar com Segurança <Lock size={16} />
            </Link>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {itens.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card p-5 hover:border-teal-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={14} className="text-teal-400" />
                    <span className="font-semibold text-white text-sm">{item.label}</span>
                  </div>
                  <p className="text-grafite-500 text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CTA
// ============================================================
function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="container-farchain">
        <FadeInSection>
          <div className="relative rounded-3xl overflow-hidden text-center p-16
                          bg-gradient-to-br from-primary-900 via-primary-800 to-teal-900
                          border border-primary-700/50">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 
                            bg-primary-400/20 blur-3xl" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                              bg-white/10 border border-white/20 mb-6">
                <Zap size={14} className="text-yellow-400" />
                <span className="text-sm text-white font-medium">Disponível para implantação</span>
              </div>
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                Pronto para transformar a rastreabilidade<br />farmacêutica no seu município?
              </h2>
              <p className="text-primary-200 text-lg mb-8 max-w-xl mx-auto">
                Acesse a plataforma FarChain e conheça como a tecnologia blockchain 
                pode garantir a segurança dos medicamentos do SUS.
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl
                                           bg-white text-primary-800 font-bold text-base
                                           hover:bg-primary-50 transition-all duration-200
                                           shadow-glow-blue hover:shadow-2xl">
                Acessar FarChain <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="container-farchain">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 
                            flex items-center justify-center">
              <Link2 size={16} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-white">
                Far<span className="text-primary-400">Chain</span>
              </span>
              <p className="text-xs text-grafite-500">Rastreabilidade Farmacêutica CEAF/SUS</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-grafite-500">
            <span>© 2024 FarChain</span>
            <span>•</span>
            <span>LGPD Compliant</span>
            <span>•</span>
            <span>Blockchain SHA-256</span>
            <span>•</span>
            <span>Salvador, BA — Brasil</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
