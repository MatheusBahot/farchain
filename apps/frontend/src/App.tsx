import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from '@store/themeStore';
import { useAuthStore } from '@store/authStore';

// Layout
import PublicLayout from '@components/layouts/PublicLayout';
import DashboardLayout from '@components/layouts/DashboardLayout';

// Pages - Públicas
import LandingPage from '@pages/public/LandingPage';
import LoginPage from '@pages/auth/LoginPage';
import RastreioPublicoPage from '@pages/public/RastreioPublicoPage';

// Pages - Dashboard (protegidas)
import DashboardPage from '@pages/dashboard/DashboardPage';
import MedicamentosPage from '@pages/medicamentos/MedicamentosPage';
import LotesPage from '@pages/lotes/LotesPage';
import MovimentacoesPage from '@pages/movimentacoes/MovimentacoesPage';
import DispensacoesPage from '@pages/dispensacoes/DispensacoesPage';
import BlockchainPage from '@pages/blockchain/BlockchainPage';
import FarmacovigilanciaPage from '@pages/farmacovigilancia/FarmacovigilanciaPage';
import UnidadesPage from '@pages/unidades/UnidadesPage';
import DistritosPage from '@pages/distritos/DistritosPage';
import AuditoriaPage from '@pages/auditoria/AuditoriaPage';
import UsuariosPage from '@pages/usuarios/UsuariosPage';
import PerfilPage from '@pages/perfil/PerfilPage';
import ConfiguracoesPage from '@pages/configuracoes/ConfiguracoesPage';

// Guard
import ProtectedRoute from '@components/auth/ProtectedRoute';

export default function App() {
  const { darkMode } = useThemeStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/rastreio/:hash" element={<RastreioPublicoPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Rotas Protegidas - Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="medicamentos" element={<MedicamentosPage />} />
        <Route path="lotes" element={<LotesPage />} />
        <Route path="movimentacoes" element={<MovimentacoesPage />} />
        <Route path="dispensacoes" element={<DispensacoesPage />} />
        <Route path="blockchain" element={<BlockchainPage />} />
        <Route path="farmacovigilancia" element={<FarmacovigilanciaPage />} />
        <Route path="unidades" element={<UnidadesPage />} />
        <Route path="distritos" element={<DistritosPage />} />
        <Route path="auditoria" element={<AuditoriaPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="perfil" element={<PerfilPage />} />
        <Route path="configuracoes" element={<ConfiguracoesPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
