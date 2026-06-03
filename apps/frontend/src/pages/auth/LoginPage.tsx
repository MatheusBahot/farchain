import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link2, Eye, EyeOff, LogIn, Shield, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@services/api';
import { useAuthStore } from '@store/authStore';
import clsx from 'clsx';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

const demoUsers = [
  { label: 'Admin', email: 'admin@farchain.gov.br' },
  { label: 'Farmacêutico', email: 'farmaceutico@farchain.gov.br' },
  { label: 'Auditor', email: 'auditor@farchain.gov.br' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const result = await authApi.login(data.email, data.senha);
      setAuth(result.usuario, result.accessToken);
      if (result.refreshToken) {
        localStorage.setItem('farchain-refresh', result.refreshToken);
      }
      toast.success(`Bem-vindo, ${result.usuario.nome.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Credenciais inválidas';
      toast.error(typeof msg === 'string' ? msg : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grafite-950 flex">
      {/* Lado esquerdo — visual */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col w-1/2 relative overflow-hidden"
      >
        {/* Background com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-grafite-900 to-teal-950" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        {/* Orbs decorativos */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-teal-500/20 blur-3xl animate-pulse-slow" />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 
                            flex items-center justify-center shadow-glow-blue">
              <Link2 size={20} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-2xl">
                Far<span className="text-primary-400">Chain</span>
              </span>
              <p className="text-xs text-grafite-400">CEAF · SUS · ANVISA</p>
            </div>
          </div>

          {/* Conteúdo central */}
          <div className="flex-1 flex flex-col justify-center max-w-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                              bg-primary-500/20 border border-primary-500/30 mb-6">
                <Shield size={12} className="text-primary-400" />
                <span className="text-xs text-primary-300 font-medium">
                  Blockchain Permissionado · SHA-256
                </span>
              </div>
              <h1 className="font-display text-4xl font-bold text-white leading-tight mb-4">
                Rastreabilidade farmacêutica de{' '}
                <span className="text-gradient">padrão mundial</span>
              </h1>
              <p className="text-grafite-400 text-lg leading-relaxed">
                Plataforma integrada de auditoria, transparência e segurança 
                para medicamentos do Componente Especializado da Assistência 
                Farmacêutica — CEAF/SUS.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 mt-10"
            >
              {[
                { valor: '100%', label: 'Auditável' },
                { valor: '⛓️', label: 'Blockchain' },
                { valor: 'LGPD', label: 'Compliant' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
                >
                  <p className="text-xl font-bold text-white">{stat.valor}</p>
                  <p className="text-xs text-grafite-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <p className="text-xs text-grafite-600">
            © 2024 FarChain · Assistência Farmacêutica · Salvador, BA
          </p>
        </div>
      </motion.div>

      {/* Lado direito — formulário */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 
                            flex items-center justify-center">
              <Link2 size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-2xl">
              Far<span className="text-primary-400">Chain</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Acessar plataforma</h2>
          <p className="text-grafite-400 text-sm mb-8">
            Use suas credenciais institucionais para entrar
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* E-mail */}
            <div>
              <label className="block text-sm font-medium text-grafite-300 mb-1.5">
                E-mail institucional
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="usuario@sus.gov.br"
                className={clsx(
                  'w-full px-4 py-3 rounded-xl bg-grafite-800 text-white placeholder-grafite-500',
                  'border transition-all duration-200 focus:outline-none focus:ring-2',
                  errors.email
                    ? 'border-danger-500 focus:ring-danger-500/30'
                    : 'border-grafite-700 focus:border-primary-500 focus:ring-primary-500/20',
                )}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-danger-400">{errors.email.message}</p>
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
                  placeholder="••••••••••••"
                  className={clsx(
                    'w-full px-4 py-3 pr-12 rounded-xl bg-grafite-800 text-white placeholder-grafite-500',
                    'border transition-all duration-200 focus:outline-none focus:ring-2',
                    errors.senha
                      ? 'border-danger-500 focus:ring-danger-500/30'
                      : 'border-grafite-700 focus:border-primary-500 focus:ring-primary-500/20',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-grafite-500 hover:text-grafite-300 transition-colors"
                >
                  {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.senha && (
                <p className="mt-1 text-xs text-danger-400">{errors.senha.message}</p>
              )}
            </div>

            {/* Botão login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3.5 text-base mt-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Autenticando...</>
              ) : (
                <><LogIn size={18} /> Entrar no Sistema</>
              )}
            </button>
          </form>

          {/* Demo users */}
          <div className="mt-8">
            <p className="text-xs text-grafite-500 mb-3 text-center">
              Acessos de demonstração (senha: FarChain@2024)
            </p>
            <div className="grid grid-cols-3 gap-2">
              {demoUsers.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => {
                    setValue('email', u.email);
                    setValue('senha', 'FarChain@2024');
                  }}
                  className="text-xs px-3 py-2 rounded-lg bg-grafite-800 border border-grafite-700
                             text-grafite-400 hover:text-primary-400 hover:border-primary-700
                             transition-all duration-150 text-center"
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs text-grafite-600">
            <Shield size={12} />
            <span>Conexão criptografada · JWT · Argon2id · LGPD</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
