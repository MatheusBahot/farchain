import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Eye, EyeOff, LogIn, Shield, Loader2,
  Lock, Link2, CheckCircle2, Activity,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@services/api';
import { useAuthStore } from '@store/authStore';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha obrigatória'),
});
type Form = z.infer<typeof schema>;

const demos = [
  { label: 'Admin',         email: 'admin@farchain.gov.br',         role: 'SUPER_ADMIN' },
  { label: 'Farmacêutico',  email: 'farmaceutico@farchain.gov.br',   role: 'FARMACEUTICO' },
  { label: 'Auditor',       email: 'auditor@farchain.gov.br',        role: 'AUDITOR' },
  { label: 'Gestora',       email: 'gestora@farchain.gov.br',        role: 'GESTOR_MUNICIPAL' },
];

const features = [
  { icon: Link2,        label: 'Blockchain SHA-256', desc: 'Ledger imutável permissionado' },
  { icon: Shield,       label: 'LGPD Compliant',     desc: 'CPF anonimizado via hash' },
  { icon: Activity,     label: 'Tempo real',          desc: 'Monitoramento contínuo' },
  { icon: CheckCircle2, label: '100% Auditável',      desc: 'Trilha completa de eventos' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register, handleSubmit, setValue,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      const result = await authApi.login(data.email, data.senha);

      // Suporta dois formatos de resposta possíveis
      const usuario     = result?.usuario     || result?.user     || result;
      const accessToken = result?.accessToken || result?.token    || '';
      const refreshToken= result?.refreshToken || '';

      if (!accessToken) throw new Error('Token não recebido');

      setAuth(usuario, accessToken);
      if (refreshToken) localStorage.setItem('farchain-refresh', refreshToken);

      toast.success(`Bem-vindo, ${usuario?.nome?.split(' ')[0] || 'usuário'}!`);
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (Array.isArray(msg)) {
        toast.error(msg[0]);
      } else {
        toast.error(msg || 'E-mail ou senha incorretos');
      }
    } finally {
      setLoading(false);
    }
  };

  const preencherDemo = (email: string) => {
    setValue('email', email);
    setValue('senha', 'FarChain@2024');
  };

  return (
    <div className="min-h-screen bg-grafite-950 flex">

      {/* ── Painel esquerdo — visual ── */}
      <div className="hidden lg:flex flex-col w-[55%] relative overflow-hidden">

        {/* Fundo com gradiente e grid */}
        <div className="absolute inset-0 bg-gradient-to-br from-grafite-950 via-primary-950/40 to-grafite-900" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        {/* Blobs decorativos */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full
                        bg-primary-600/15 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 rounded-full
                        bg-teal-500/15 blur-3xl animate-float" />

        <div className="relative z-10 flex flex-col h-full px-14 py-12">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500
                            flex items-center justify-center shadow-glow-blue">
              <Link2 size={18} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-xl leading-none">
                Far<span className="text-primary-400">Chain</span>
              </span>
              <p className="text-[10px] text-grafite-500 leading-none">CEAF · SUS · ANVISA</p>
            </div>
          </div>

          {/* Conteúdo central */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                              bg-primary-500/10 border border-primary-500/20 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                <span className="text-xs text-primary-300 font-medium">
                  Blockchain Permissionado · SHA-256
                </span>
              </div>

              <h1 className="font-display text-[2.8rem] font-bold text-white leading-[1.1] mb-5">
                Rastreabilidade<br />farmacêutica de<br />
                <span className="text-gradient">padrão mundial</span>
              </h1>

              <p className="text-grafite-400 text-lg leading-relaxed">
                Plataforma integrada de auditoria, transparência e
                segurança para medicamentos do Componente Especializado
                da Assistência Farmacêutica — CEAF/SUS.
              </p>
            </motion.div>

            {/* Features grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 gap-3 mt-10"
            >
              {features.map((f) => (
                <div key={f.label}
                  className="flex items-start gap-3 p-4 rounded-2xl
                             bg-white/[0.03] border border-white/[0.07]
                             hover:border-primary-500/20 transition-colors duration-300">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20
                                  flex items-center justify-center shrink-0">
                    <f.icon size={15} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.label}</p>
                    <p className="text-xs text-grafite-500 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Chain visual */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center gap-2"
            >
              {['Fabricante','CAF','Unidade','Paciente'].map((s, i, arr) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08]
                                  text-xs text-grafite-400 font-medium whitespace-nowrap">
                    {s}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex items-center gap-0.5">
                      <div className="w-4 h-px bg-primary-500/40" />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500/60" />
                      <div className="w-4 h-px bg-primary-500/40" />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
            <p className="text-xs text-grafite-600 mt-2">
              ⛓ Cada etapa registrada imutavelmente no blockchain
            </p>
          </div>

          <p className="text-xs text-grafite-700">
            © {new Date().getFullYear()} FarChain · Salvador, BA · Brasil
          </p>
        </div>
      </div>

      {/* ── Painel direito — formulário ── */}
      <div className="flex-1 flex items-center justify-center px-8 py-12
                      bg-grafite-950 border-l border-grafite-800/50">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500
                            flex items-center justify-center">
              <Link2 size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-xl">
              Far<span className="text-primary-400">Chain</span>
            </span>
          </div>

          {/* Título */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">
              Acessar plataforma
            </h2>
            <p className="text-grafite-400 text-sm">
              Use suas credenciais institucionais para entrar
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            {/* E-mail */}
            <div>
              <label className="block text-sm font-medium text-grafite-300 mb-1.5">
                E-mail institucional
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="usuario@sus.gov.br"
                autoComplete="email"
                className={`w-full px-4 py-3 rounded-xl text-sm text-white
                            bg-grafite-800/80 border transition-all duration-200
                            placeholder-grafite-500 focus:outline-none focus:ring-2
                            ${errors.email
                              ? 'border-danger-500 focus:ring-danger-500/20'
                              : 'border-grafite-700 focus:border-primary-500 focus:ring-primary-500/20'
                            }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-danger-400">{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-grafite-300 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  {...register('senha')}
                  type={showSenha ? 'text' : 'password'}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl text-sm text-white
                              bg-grafite-800/80 border transition-all duration-200
                              placeholder-grafite-500 focus:outline-none focus:ring-2
                              ${errors.senha
                                ? 'border-danger-500 focus:ring-danger-500/20'
                                : 'border-grafite-700 focus:border-primary-500 focus:ring-primary-500/20'
                              }`}
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             text-grafite-500 hover:text-grafite-300 transition-colors"
                  tabIndex={-1}
                >
                  {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.senha && (
                <p className="mt-1.5 text-xs text-danger-400">{errors.senha.message}</p>
              )}
            </div>

            {/* Botão submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5
                         px-6 py-3.5 rounded-xl font-semibold text-sm text-white
                         bg-gradient-to-r from-primary-600 to-primary-500
                         hover:from-primary-500 hover:to-primary-400
                         shadow-lg shadow-primary-500/20
                         transition-all duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed
                         mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Autenticando...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Entrar no Sistema
                </>
              )}
            </button>
          </form>

          {/* Demos */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-grafite-800" />
              <p className="text-xs text-grafite-500 font-medium">
                Acesso de demonstração
              </p>
              <div className="flex-1 h-px bg-grafite-800" />
            </div>

            <p className="text-[11px] text-grafite-600 mb-2.5 text-center">
              Senha padrão: <span className="font-mono text-grafite-500">FarChain@2024</span>
            </p>

            <div className="grid grid-cols-2 gap-2">
              {demos.map((d) => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => preencherDemo(d.email)}
                  className="group flex flex-col items-start px-3.5 py-2.5 rounded-xl
                             bg-grafite-800/60 border border-grafite-700/50
                             hover:border-primary-500/40 hover:bg-primary-500/5
                             transition-all duration-150 text-left"
                >
                  <span className="text-xs font-semibold text-white group-hover:text-primary-300
                                   transition-colors">
                    {d.label}
                  </span>
                  <span className="text-[10px] text-grafite-500 truncate w-full mt-0.5">
                    {d.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Segurança */}
          <div className="mt-8 flex items-center justify-center gap-2
                          text-[11px] text-grafite-600">
            <Lock size={11} />
            <span>JWT · Argon2id · LGPD · Criptografia end-to-end</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
