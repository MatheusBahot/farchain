import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import {
  Menu, Bell, Search, Moon, Sun, Link2,
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { useThemeStore } from '@store/themeStore';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { usuario } = useAuthStore();
  const { darkMode, toggleDarkMode } = useThemeStore();

  return (
    <div className="flex h-screen bg-grafite-950 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="h-14 bg-grafite-900 border-b border-grafite-800
                           flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-3">
            {/* Logo mobile + toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-grafite-400 hover:text-white
                         hover:bg-grafite-800 transition-colors"
            >
              <Menu size={18} />
            </button>

            {/* Busca */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-grafite-500" size={14} />
              <input
                type="text"
                placeholder="Buscar medicamentos, lotes..."
                className="pl-9 pr-4 py-2 rounded-xl bg-grafite-800 border border-grafite-700
                           text-sm text-grafite-300 placeholder-grafite-600
                           focus:outline-none focus:border-primary-500 w-60 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-grafite-400 hover:text-white
                         hover:bg-grafite-800 transition-colors"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notificações */}
            <button className="relative p-2 rounded-lg text-grafite-400 hover:text-white
                               hover:bg-grafite-800 transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5
                               bg-danger-500 rounded-full" />
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2.5 pl-2
                            border-l border-grafite-700 ml-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-teal-500
                              flex items-center justify-center text-white text-xs font-bold">
                {usuario?.nome?.charAt(0) ?? 'U'}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-white leading-none">
                  {usuario?.nome?.split(' ')[0]}
                </p>
                <p className="text-[10px] text-grafite-500 leading-none mt-0.5">
                  {usuario?.role}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 overflow-auto p-6 bg-grafite-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
