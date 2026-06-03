import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Pill, Package, ArrowLeftRight, Syringe,
  Link2, AlertTriangle, Building2, Map, Shield, Users,
  Settings, LogOut, ChevronRight, Thermometer,
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { authApi } from '@services/api';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/dashboard/medicamentos', label: 'Medicamentos', icon: Pill },
  { to: '/dashboard/lotes', label: 'Lotes', icon: Package },
  { to: '/dashboard/movimentacoes', label: 'Movimentações', icon: ArrowLeftRight },
  { to: '/dashboard/dispensacoes', label: 'Dispensações', icon: Syringe },
  { to: '/dashboard/blockchain', label: 'Blockchain', icon: Link2 },
  { to: '/dashboard/farmacovigilancia', label: 'Farmacovigilância', icon: AlertTriangle },
  { to: '/dashboard/unidades', label: 'Unidades', icon: Building2 },
  { to: '/dashboard/distritos', label: 'Distritos', icon: Map },
  { to: '/dashboard/auditoria', label: 'Auditoria', icon: Shield },
  { to: '/dashboard/usuarios', label: 'Usuários', icon: Users },
  { to: '/dashboard/configuracoes', label: 'Configurações', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    logout();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="h-full bg-grafite-900 dark:bg-grafite-950 border-r border-grafite-800 
                     flex flex-col shrink-0 overflow-hidden"
        >
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-grafite-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 
                              flex items-center justify-center">
                <Link2 size={16} className="text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-lg leading-none">
                  Far<span className="text-primary-400">Chain</span>
                </span>
                <p className="text-[10px] text-grafite-500 leading-none mt-0.5">CEAF/SUS</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
            <p className="text-[10px] font-semibold text-grafite-500 uppercase tracking-widest px-6 mb-3">
              Navegação
            </p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all duration-150',
                    'hover:bg-grafite-800 group relative',
                    isActive
                      ? 'text-white bg-grafite-800 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-0.5 before:bg-primary-500 before:rounded-r'
                      : 'text-grafite-400 hover:text-grafite-200',
                  )
                }
              >
                <item.icon size={17} className="shrink-0" />
                <span>{item.label}</span>
                <ChevronRight
                  size={14}
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-grafite-800 p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                         text-sm font-medium text-grafite-400 hover:text-danger-400
                         hover:bg-danger-500/10 transition-all duration-150"
            >
              <LogOut size={17} />
              Sair
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
