import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from '@store/themeStore';

import PublicLayout       from '@components/layouts/PublicLayout';
import DashboardLayout    from '@components/layouts/DashboardLayout';
import ProtectedRoute     from '@components/auth/ProtectedRoute';

import LandingPage        from '@pages/public/LandingPage';
import LoginPage          from '@pages/auth/LoginPage';
import RastreioPublicoPage from '@pages/public/RastreioPublicoPage';

import DashboardPage      from '@pages/dashboard/DashboardPage';
import MedicamentosPage   from '@pages/medicamentos/MedicamentosPage';
import LotesPage          from '@pages/lotes/LotesPage';
import MovimentacoesPage  from '@pages/movimentacoes/MovimentacoesPage';
import DispensacoesPage   from '@pages/dispensacoes/DispensacoesPage';
import BlockchainPage     from '@pages/blockchain/BlockchainPage';
import FarmacovigilanciaPage from '@pages/farmacovigilancia/FarmacovigilanciaPage';
import UnidadesPage       from '@pages/unidades/UnidadesPage';
import DistritosPage      from '@pages/distritos/DistritosPage';
import AuditoriaPage      from '@pages/auditoria/AuditoriaPage';
import UsuariosPage       from '@pages/usuarios/UsuariosPage';
import PerfilPage         from '@pages/perfil/PerfilPage';
import ConfiguracoesPage  from '@pages/configuracoes/ConfiguracoesPage';

export default function App() {
  const { darkMode } = useThemeStore();

  // Aplicar classe dark no HTML
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Forçar dark mode na montagem inicial
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Routes>
      {/* Públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/"                 element={<LandingPage />} />
        <Route path="/login"            element={<LoginPage />} />
        <Route path="/rastreio/:hash"   element={<RastreioPublicoPage />} />
      </Route>

      {/* Protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index                    element={<DashboardPage />} />
        <Route path="medicamentos"      element={<MedicamentosPage />} />
        <Route path="lotes"             element={<LotesPage />} />
        <Route path="movimentacoes"     element={<MovimentacoesPage />} />
        <Route path="dispensacoes"      element={<DispensacoesPage />} />
        <Route path="blockchain"        element={<BlockchainPage />} />
        <Route path="farmacovigilancia" element={<FarmacovigilanciaPage />} />
        <Route path="unidades"          element={<UnidadesPage />} />
        <Route path="distritos"         element={<DistritosPage />} />
        <Route path="auditoria"         element={<AuditoriaPage />} />
        <Route path="usuarios"          element={<UsuariosPage />} />
        <Route path="perfil"            element={<PerfilPage />} />
        <Route path="configuracoes"     element={<ConfiguracoesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
