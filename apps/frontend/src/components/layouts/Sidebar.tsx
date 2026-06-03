import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Pill, Package, ArrowLeftRight, Syringe,
  Link2, AlertTriangle, Building2, Map, Shield, Users,
  Settings, LogOut,
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { authApi } from '@services/api';
import clsx from 'clsx';

const nav = [
  { to: '/dashboard',                  icon: LayoutDashboard, label: 'Dashboard',      exact: true },
  { to: '/dashboard/medicamentos',     icon: Pill,             label: 'Medicamentos'            },
  { to: '/dashboard/lotes',            icon: Package,          label: 'Lotes'                   },
  { to: '/dashboard/movimentacoes',    icon: ArrowLeftRight,   label: 'Movimentações'           },
  { to: '/dashboard/dispensacoes',     icon: Syringe,          label: 'Dispensações'            },
  { to: '/dashboard/blockchain',       icon: Link2,            label: 'Blockchain'              },
  { to: '/dashboard/farmacovigilancia',icon: AlertTriangle,    label: 'Farmacovigilância'       },
  { to: '/dashboard/unidades',         icon: Building2,        label: 'Unidades'                },
  { to: '/dashboard/distritos',        icon: Map,              label: 'Distritos'               },
  { to: '/dashboard/auditoria',        icon: Shield,           label: 'Auditoria'               },
  { to: '/dashboard/usuarios',         icon: Users,            label: 'Usuários'                },
  { to: '/dashboard/configuracoes',    icon: Settings,         label: 'Configurações'           },
];

interface Props { isOpen: boolean; onClose?: () => void; }

export default function Sidebar({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await authApi.logout();
    logout();
    localStorage.removeItem('farchain-refresh');
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 240, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="h-full bg-grafite-900 border-r border-grafite-800
                     flex flex-col shrink-0 overflow-hidden"
        >
          {/* Logo */}
          <div className="h-14 flex items-center px-5 border-b border-grafite-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500
                              flex items-center justify-center shrink-0">
                <Link2 size={14} className="text-white" />
              </div>
              <div className="leading-none">
                <span className="font-display font-bold text-white text-base">
                  Far<span className="text-primary-400">Chain</span>
                </span>
                <p className="text-[9px] text-grafite-600 leading-none">CEAF / SUS</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-3 no-scrollbar">
            <p className="text-[9px] font-semibold text-grafite-600 uppercase
                          tracking-widest px-5 mb-2">
              Menu
            </p>

            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-5 py-2.5 text-sm font-medium',
                    'transition-all duration-150 relative group',
                    isActive
                      ? [
                          'text-white bg-primary-600/10',
                          'before:absolute before:left-0 before:top-2 before:bottom-2',
                          'before:w-0.5 before:bg-primary-500 before:rounded-r',
                        ]
                      : 'text-grafite-500 hover:text-grafite-200 hover:bg-grafite-800/60',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={16}
                      className={clsx(
                        'shrink-0 transition-colors',
                        isActive ? 'text-primary-400' : 'text-grafite-500 group-hover:text-grafite-300',
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t border-grafite-800 p-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                         text-sm font-medium text-grafite-500
                         hover:text-danger-400 hover:bg-danger-500/8
                         transition-all duration-150"
            >
              <LogOut size={16} />
              Sair da plataforma
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
