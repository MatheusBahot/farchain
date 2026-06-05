import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '@services/api';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const data = response.data?.data || response.data;

      localStorage.setItem('farchain-token', data.accessToken);
      localStorage.setItem('farchain-refresh-token', data.refreshToken);
      localStorage.setItem('farchain-user', JSON.stringify(data.usuario));

      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,.12)] border border-slate-200">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <ShieldCheck size={26} />
        </div>

        <h1 className="mt-8 text-4xl font-black tracking-[-0.055em] text-slate-950">
          Acesse o FarmaChain.
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          Plataforma de rastreabilidade farmacêutica com blockchain, QR Code,
          auditoria e farmacovigilância.
        </p>

        <form onSubmit={entrar} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
              E-mail
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Mail size={18} className="text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
              Senha
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Lock size={18} className="text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar na plataforma'}
            <ArrowRight size={17} />
          </button>
        </form>
      </section>
    </main>
  );
}
