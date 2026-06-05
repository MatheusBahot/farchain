import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  FileCheck2,
  Lock,
  Pill,
  QrCode,
  ShieldCheck,
  Thermometer,
  Truck,
} from 'lucide-react';

const modules = [
  { title: 'Rastreabilidade', text: 'Histórico do lote da origem até a dispensação.', icon: QrCode },
  { title: 'Blockchain', text: 'Eventos críticos registrados em ledger imutável.', icon: Database },
  { title: 'Cadeia fria', text: 'Controle de temperatura e alertas operacionais.', icon: Thermometer },
  { title: 'Auditoria', text: 'Trilha completa para gestão e conformidade.', icon: FileCheck2 },
  { title: 'Dashboard', text: 'Indicadores claros para tomada de decisão.', icon: BarChart3 },
  { title: 'Segurança', text: 'LGPD, autenticação e perfis institucionais.', icon: Lock },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-neutral-950">
      <Header />
      <Hero />
      <About />
      <Modules />
      <Blockchain />
      <Security />
      <CTA />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/75 backdrop-blur-2xl border-b border-black/5">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/images/logo/farmachain-logo.png"
            alt="FarmaChain"
            className="h-8 w-8 rounded-xl object-contain"
          />
          <span className="text-sm font-bold">FarmaChain</span>
        </Link>

        <div className="hidden items-center gap-8 text-[13px] font-medium text-neutral-500 md:flex">
          <a href="#sobre" className="hover:text-neutral-950">Sobre</a>
          <a href="#modulos" className="hover:text-neutral-950">Módulos</a>
          <a href="#blockchain" className="hover:text-neutral-950">Blockchain</a>
          <a href="#seguranca" className="hover:text-neutral-950">Segurança</a>
        </div>

        <Link
          to="/login"
          className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
        >
          Entrar
        </Link>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-28 pb-20 px-6">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-blue-600 shadow-sm ring-1 ring-black/5">
            <ShieldCheck size={14} />
            Plataforma de rastreabilidade farmacêutica
          </div>

          <h1 className="max-w-2xl text-[2.9rem] font-black leading-[1.02] tracking-[-0.055em] md:text-[4.6rem]">
            Tecnologia para acompanhar cada medicamento com confiança.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-neutral-600 md:text-lg">
            O FarmaChain conecta logística, auditoria, blockchain e segurança
            do paciente em uma experiência simples, visual e institucional.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500"
            >
              Acessar plataforma <ArrowRight size={17} />
            </Link>

            <a
              href="#sobre"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-neutral-900 shadow-sm ring-1 ring-black/5 hover:bg-neutral-50"
            >
              Conhecer solução
            </a>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {[
              ['100%', 'auditável'],
              ['QR', 'por lote'],
              ['LGPD', 'seguro'],
            ].map(([value, label]) => (
              <div key={value} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <p className="text-xl font-black tracking-[-0.04em]">{value}</p>
                <p className="mt-1 text-xs text-neutral-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-blue-200/40 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2.3rem] bg-white p-3 shadow-[0_30px_100px_rgba(15,23,42,.16)]">
            <img
              src="/images/hero-pharma.png"
              alt="Rastreabilidade farmacêutica FarmaChain"
              className="h-[360px] w-full rounded-[1.8rem] object-cover md:h-[520px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="sobre" className="px-6 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,.10)]">
          <img
            src="/images/dashboard.png"
            alt="Dashboard FarmaChain"
            className="h-[360px] w-full rounded-[1.5rem] object-cover"
          />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">
            Sobre a plataforma
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] md:text-5xl">
            Uma visão clara para uma cadeia complexa.
          </h2>
          <p className="mt-5 text-base leading-8 text-neutral-600">
            A gestão farmacêutica envolve lotes, validade, transporte, armazenamento,
            dispensação e eventos de segurança. O FarmaChain organiza esses dados
            em uma interface objetiva, visual e auditável.
          </p>

          <div className="mt-8 space-y-4">
            {[
              'Rastreamento por lote, QR Code e hash.',
              'Auditoria de movimentações e dispensações.',
              'Indicadores para gestores, farmacêuticos e auditores.',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 text-emerald-500" size={18} />
                <p className="text-sm font-medium text-neutral-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Modules() {
  return (
    <section id="modulos" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">
            Módulos
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] md:text-5xl">
            Tudo que a operação precisa em um só ambiente.
          </h2>
          <p className="mt-5 text-base leading-8 text-neutral-600">
            Uma central simples para operar, acompanhar e auditar a cadeia do medicamento.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="rounded-[1.8rem] bg-white p-7 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-black tracking-[-0.03em]">{m.title}</h3>
                <p className="mt-3 text-sm leading-7 text-neutral-600">{m.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Blockchain() {
  return (
    <section id="blockchain" className="px-6 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 rounded-[2.5rem] bg-neutral-950 p-6 text-white shadow-2xl md:p-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem]">
          <img
            src="/images/blockchain.png"
            alt="Blockchain farmacêutica"
            className="h-[360px] w-full object-cover"
          />
        </div>

        <div className="p-2 md:p-6">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-300">
            Blockchain
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] md:text-5xl">
            Cada evento importante vira uma prova de integridade.
          </h2>
          <p className="mt-5 text-base leading-8 text-neutral-300">
            O ledger registra eventos críticos de forma encadeada, permitindo
            validação de histórico, auditoria contínua e rastreabilidade com confiança.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {['Cadastro de lote', 'Entrada em estoque', 'Movimentação', 'Dispensação'].map((x) => (
              <div key={x} className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
                <p className="text-sm font-bold">{x}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Security() {
  return (
    <section id="seguranca" className="px-6 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">
            Segurança e farmacovigilância
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] md:text-5xl">
            Segurança do paciente no centro da operação.
          </h2>
          <p className="mt-5 text-base leading-8 text-neutral-600">
            Eventos adversos, queixas técnicas e auditorias podem ser associados
            ao lote rastreado, fortalecendo a vigilância e a resposta institucional.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ['LGPD', 'Dados protegidos'],
              ['JWT', 'Acesso seguro'],
              ['RBAC', 'Perfis por função'],
              ['Auditoria', 'Histórico verificável'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <p className="text-lg font-black">{title}</p>
                <p className="mt-1 text-sm text-neutral-500">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,.10)]">
            <img
              src="/images/farmacovigilancia.png"
              alt="Farmacovigilância"
              className="h-[260px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,.10)]">
            <img
              src="/images/auditoria.png"
              alt="Auditoria"
              className="h-[260px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-6 py-24 text-center">
      <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-white px-8 py-16 shadow-[0_24px_80px_rgba(15,23,42,.10)] ring-1 ring-black/5">
        <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] md:text-5xl">
          Uma plataforma para tornar a logística farmacêutica mais segura.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-neutral-600">
          Minimalista na experiência. Robusta na arquitetura. Pensada para
          rastreabilidade, auditoria e segurança do paciente.
        </p>
        <Link
          to="/login"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-sm font-black text-white hover:bg-blue-500"
        >
          Entrar no FarmaChain <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-10 text-sm text-neutral-500">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-neutral-300 pt-8 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} FarmaChain · Salvador, BA</p>
        <p>React · NestJS · PostgreSQL · Blockchain SHA-256</p>
      </div>
    </footer>
  );
}
