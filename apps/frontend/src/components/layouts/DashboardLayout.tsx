import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Pill,
  ArrowLeftRight,
  Syringe,
  Link2,
  ShieldAlert,
  Building2,
  Map,
  FileText,
  Users,
  Settings,
  Download,
  LogOut,
  Bell,
  Search,
  Menu,
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Medicamentos', path: '/medicamentos', icon: Pill },
  { label: 'Movimentações', path: '/movimentacoes', icon: ArrowLeftRight },
  { label: 'Dispensações', path: '/dispensacoes', icon: Syringe },
  { label: 'Blockchain', path: '/blockchain', icon: Link2 },
  { label: 'Farmacovigilância', path: '/farmacovigilancia', icon: ShieldAlert },
  { label: 'Unidades', path: '/unidades', icon: Building2 },
  { label: 'Distritos', path: '/distritos', icon: Map },
  { label: 'Auditoria', path: '/auditoria', icon: FileText },
  { label: 'Relatórios', path: '/relatorios', icon: Download },
  { label: 'Usuários', path: '/usuarios', icon: Users },
  { label: 'Configurações', path: '/configuracoes', icon: Settings },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();

  function sair() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell min-h-screen text-[13px]">
      <aside className="fixed left-4 top-4 bottom-4 z-40 hidden w-72 rounded-[28px] bg-white/90 border border-slate-200 shadow-[0_24px_80px_rgba(15,23,42,.10)] backdrop-blur-xl lg:flex flex-col">
        <div className="px-6 py-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
              <Pill size={20} />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-slate-950">FarmaChain</p>
              <p className="text-[11px] text-slate-500">Rastreabilidade inteligente</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${
                    isActive ? 'app-nav-active' : 'app-nav-item'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <button
            onClick={sair}
            className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 font-bold text-red-500 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            Sair da plataforma
          </button>
        </div>
      </aside>

      <main className="lg:pl-[304px] min-h-screen">
        <header className="sticky top-0 z-30 px-4 pt-4">
          <div className="h-16 rounded-[24px] bg-white/88 border border-slate-200 shadow-[0_14px_50px_rgba(15,23,42,.08)] backdrop-blur-xl flex items-center justify-between px-5">
            <div className="flex items-center gap-4">
              <button className="lg:hidden h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Menu size={18} />
              </button>

              <div className="hidden md:flex items-center gap-3 w-[360px] h-10 rounded-2xl bg-slate-100 px-4 text-slate-500">
                <Search size={17} />
                <span>Buscar medicamentos, lotes, pacientes...</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Bell size={18} />
                <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                  3
                </span>
              </button>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">
                  {usuario?.nome?.[0] ?? 'A'}
                </div>
                <div className="hidden sm:block">
                  <p className="font-black text-slate-950 leading-tight">
                    {usuario?.nome ?? 'Administrador'}
                  </p>
                  <p className="text-[11px] text-slate-500">{usuario?.role ?? 'SUPER_ADMIN'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="p-4">
          <div className="min-h-[calc(100vh-104px)] rounded-[30px] bg-[#f5f5f7] p-2">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}
