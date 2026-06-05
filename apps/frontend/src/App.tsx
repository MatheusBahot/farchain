import { Routes, Route, Navigate } from 'react-router-dom';

import DashboardLayout from '@components/layouts/DashboardLayout';
import ProtectedRoute from '@components/auth/ProtectedRoute';

import LandingPage from '@pages/public/LandingPage';
import TracePage from '@pages/trace/TracePage';
import LoginPage from '@pages/auth/LoginPage';

import DashboardPage from '@pages/dashboard/DashboardPage';
import MedicamentosPage from '@pages/medicamentos/MedicamentosPage';
import MovimentacoesPage from '@pages/movimentacoes/MovimentacoesPage';
import DispensacoesPage from '@pages/dispensacoes/DispensacoesPage';
import BlockchainPage from '@pages/blockchain/BlockchainPage';
import FarmacovigilanciaPage from '@pages/farmacovigilancia/FarmacovigilanciaPage';
import UnidadesPage from '@pages/unidades/UnidadesPage';
import DistritosPage from '@pages/distritos/DistritosPage';
import AuditoriaPage from '@pages/auditoria/AuditoriaPage';
import RelatoriosPage from '@pages/relatorios/RelatoriosPage';
import UsuariosPage from '@pages/usuarios/UsuariosPage';
import ConfiguracoesPage from '@pages/configuracoes/ConfiguracoesPage';
import PerfilPage from '@pages/perfil/PerfilPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/trace/:lote" element={<TracePage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/medicamentos" element={<MedicamentosPage />} />
        <Route path="/movimentacoes" element={<MovimentacoesPage />} />
        <Route path="/dispensacoes" element={<DispensacoesPage />} />
        <Route path="/blockchain" element={<BlockchainPage />} />
        <Route path="/farmacovigilancia" element={<FarmacovigilanciaPage />} />
        <Route path="/unidades" element={<UnidadesPage />} />
        <Route path="/distritos" element={<DistritosPage />} />
        <Route path="/auditoria" element={<AuditoriaPage />} />
        <Route path="/relatorios" element={<RelatoriosPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/configuracoes" element={<ConfiguracoesPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
