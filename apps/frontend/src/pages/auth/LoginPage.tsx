import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { api } from '@services/api';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@farchain.gov.br');
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
    <main className="min-h-screen bg-[#f5f5f7] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500">
              <ShieldCheck size={22} />
            </div>
            <strong className="text-lg">FarmaChain</strong>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-300">
              Blockchain farmacêutica
            </p>
            <h1 className="mt-5 max-w-xl text-6xl font-black leading-[0.95] tracking-[-0.07em]">
              Rastreabilidade segura para medicamentos.
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-slate-300">
              Gestão de lotes, dispensação, QR Code, auditoria, hash do paciente
              e histórico completo do medicamento.
            </p>
          </div>

          <p className="text-xs text-slate-500">
            CEAF · SUS · PostgreSQL · SHA-256 · QR Code
          </p>
        </section>

        <section className="flex items-center justify-center p-6">
          <form
            onSubmit={entrar}
            className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,.12)]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Lock size={24} />
            </div>

            <h2 className="mt-8 text-4xl font-black tracking-[-0.055em]">
              Entrar.
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Acesse a plataforma institucional FarmaChain.
            </p>

            <div className="mt-8 space-y-4">
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
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="seu@email.com"
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
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Digite sua senha"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-500 disabled:opacity-60"
              >
                {loading ? 'Entrando...' : 'Entrar na plataforma'}
                <ArrowRight size={17} />
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
