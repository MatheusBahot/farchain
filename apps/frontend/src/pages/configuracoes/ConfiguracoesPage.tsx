import { Settings, Moon, Sun, Bell, Shield } from 'lucide-react';
import { useThemeStore } from '@store/themeStore';

export default function ConfiguracoesPage() {
  const { darkMode, toggleDarkMode } = useThemeStore();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-grafite-900 dark:text-white flex items-center gap-2">
        <Settings size={22} className="text-grafite-500" /> Configurações
      </h1>

      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-grafite-900 dark:text-white mb-4">Aparência</h2>
        <div className="flex items-center justify-between p-4 rounded-xl 
                        bg-grafite-50 dark:bg-grafite-800/50">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={18} className="text-primary-400" /> : <Sun size={18} className="text-warning-400" />}
            <div>
              <p className="font-medium text-grafite-900 dark:text-white text-sm">Modo Escuro</p>
              <p className="text-xs text-grafite-400">Interface com tema escuro (padrão FarChain)</p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${darkMode ? 'bg-primary-600' : 'bg-grafite-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${darkMode ? 'translate-x-5' : ''}`} />
          </button>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-grafite-900 dark:text-white mb-4">Segurança</h2>
        {[
          { icon: Shield, label: 'Autenticação JWT', desc: 'Tokens com expiração de 15 minutos', ativo: true },
          { icon: Bell, label: 'Alertas de Vencimento', desc: 'Notificações de lotes próximos ao vencimento', ativo: true },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-grafite-50 dark:bg-grafite-800/50">
            <div className="flex items-center gap-3">
              <item.icon size={18} className="text-primary-400" />
              <div>
                <p className="font-medium text-grafite-900 dark:text-white text-sm">{item.label}</p>
                <p className="text-xs text-grafite-400">{item.desc}</p>
              </div>
            </div>
            <span className={`text-xs font-semibold ${item.ativo ? 'text-success-500' : 'text-grafite-400'}`}>
              {item.ativo ? '● Ativo' : '○ Inativo'}
            </span>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-grafite-900 dark:text-white mb-2">Sobre o FarChain</h2>
        <div className="text-sm text-grafite-400 space-y-1">
          <p>Versão: 1.0.0</p>
          <p>Blockchain: SHA-256 Permissionado</p>
          <p>Stack: NestJS · Prisma · PostgreSQL · React · Tailwind</p>
          <p>Conformidade: LGPD · ANVISA · SNCM</p>
        </div>
      </div>
    </div>
  );
}
