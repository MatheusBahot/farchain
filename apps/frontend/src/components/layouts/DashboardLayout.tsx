import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, Bell, Search, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { useThemeStore } from '@store/themeStore';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { usuario } = useAuthStore();
  const { darkMode, toggleDarkMode } = useThemeStore();

  return (
    <div className="flex h-screen bg-grafite-50 dark:bg-grafite-950 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-grafite-900 border-b border-grafite-200 dark:border-grafite-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn-ghost p-2 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-grafite-400" size={16} />
              <input
                type="text"
                placeholder="Buscar medicamentos, lotes..."
                className="pl-9 pr-4 py-2 rounded-xl bg-grafite-100 dark:bg-grafite-800 
                           text-sm text-grafite-700 dark:text-grafite-300
                           border border-transparent focus:border-primary-400
                           focus:outline-none w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="btn-ghost p-2 rounded-lg"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn-ghost p-2 rounded-lg relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-grafite-200 dark:border-grafite-700">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
                {usuario?.nome?.charAt(0) ?? 'U'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-grafite-800 dark:text-grafite-100">
                  {usuario?.nome?.split(' ')[0]}
                </p>
                <p className="text-xs text-grafite-500">{usuario?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
