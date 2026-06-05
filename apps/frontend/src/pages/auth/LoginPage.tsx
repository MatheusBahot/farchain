import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Link2,
  Loader2,
  Lock,
  Shield,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import { authApi } from '@services/api';
import { useAuthStore } from '@store/authStore';

const demos = [
  { label: 'Admin', email: 'admin@farchain.gov.br', role: 'SUPER_ADMIN' },
  { label: 'Farmacêutico', email: 'farmaceutico@farchain.gov.br', role: 'FARMACEUTICO' },
  { label: 'Gestora', email: 'gestora@farchain.gov.br', role: 'GESTOR_MUNICIPAL' },
  { label: 'Auditor', email: 'auditor@farchain.gov.br', role: 'AUDITOR' },
];

const features = [
  { icon: Link2, label: 'Blockchain SHA-256' },
  { icon: Shield, label: 'LGPD' },
  { icon: Activity, label: 'Tempo real' },
  { icon: CheckCircle2, label: 'Auditoria' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('admin@farchain.gov.br');
  const [senha, setSenha] = useState('FarChain@2024');
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authApi.login(email, senha);

      console.log('LOGIN RESPONSE:', result);

      const usuario =
        result?.usuario ||
        result?.user ||
        result?.data?.usuario ||
        result?.data?.user;

      const accessToken =
        result?.accessToken ||
        result?.access_token ||
        result?.token ||
        result?.data?.accessToken ||
        result?.data?.access_token ||
        result?.data?.token;

      const refreshToken =
        result?.refreshToken ||
        result?.refresh_token ||
        result?.data?.refreshToken ||
        result?.data?.refresh_token;

      if (!accessToken) {
        console.error('Resposta sem token:', result);
        throw new Error('Token não recebido');
      }

      const usuarioFinal =
        usuario || {
          id: 'local',
          nome: email.split('@')[0],
          email,
          role: 'USUARIO',
        };

      setAuth(usuarioFinal, accessToken, refreshToken);

      localStorage.setItem('farchain-token', accessToken);

      if (refreshToken) {
        localStorage.setItem('farchain-refresh', refreshToken);
      }

      toast.success(`Bem-vindo, ${usuarioFinal.nome?.split(' ')[0] || 'usuário'}!`);

      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('LOGIN ERROR:', err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.erro ||
        err?.message ||
        'E-mail ou senha incorretos';

      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  function preencherDemo(emailDemo: string) {
    setEmail(emailDemo);
    setSenha('FarChain@2024');
  }

  return (
    <main className="min-h-screen bg-[#05070d] text-white grid lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden lg:flex relative overflow-hidden p-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.28),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(20,184,166,0.20),transparent_34%)]" />
        <div className="relative z-10 flex flex-col justify-between w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white text-[#05070d] flex items-center justify-center">
              <Link2 size={18} />
            </div>
            <span className="text-xl font-black">
              Farma<span className="text-primary-400">Chain</span>
            </span>
          </Link>

          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary-300"
            >
              CEAF · SUS · Blockchain
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-7 text-6xl font-black leading-none tracking-[-0.06em]"
            >
              Entrar na cadeia de rastreabilidade.
            </motion.h1>

            <p className="mt-6 text-lg leading-8 text-grafite-300">
              Gestão de medicamentos, lotes, movimentações, dispensações,
              farmacovigilância e auditoria imutável em um só ambiente.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <f.icon className="text-primary-300 mb-4" size={22} />
                  <p className="font-bold">{f.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-grafite-600">
            © {new Date().getFullYear()} FarmaChain · Salvador, BA
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 shadow-2xl"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-[-0.04em]">
              Acessar plataforma
            </h1>
            <p className="mt-2 text-sm text-grafite-400">
              Use as credenciais de demonstração ou seu usuário institucional.
            </p>
          </div>

          <form onSubmit={entrar} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-grafite-300">
                E-mail
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-2xl border border-white/10 bg-[#080b13] px-4 py-4 text-sm outline-none transition focus:border-primary-400"
                placeholder="admin@farchain.gov.br"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-grafite-300">
                Senha
              </label>
              <div className="relative">
                <input
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  type={showSenha ? 'text' : 'password'}
                  className="w-full rounded-2xl border border-white/10 bg-[#080b13] px-4 py-4 pr-12 text-sm outline-none transition focus:border-primary-400"
                  placeholder="FarChain@2024"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-grafite-500 hover:text-white"
                >
                  {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-500 px-5 py-4 font-black text-white transition hover:bg-primary-400 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Autenticando...
                </>
              ) : (
                <>
                  Entrar no sistema
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-grafite-500">demonstração</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {demos.map((d) => (
              <button
                key={d.email}
                type="button"
                onClick={() => preencherDemo(d.email)}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-primary-400/60"
              >
                <p className="text-sm font-bold">{d.label}</p>
                <p className="mt-1 truncate text-[10px] text-grafite-500">{d.role}</p>
              </button>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-grafite-500">
            <Lock size={13} />
            Senha padrão: FarChain@2024
          </div>
        </motion.div>
      </section>
    </main>
  );
}
