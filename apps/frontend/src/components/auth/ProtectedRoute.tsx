import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, accessToken } = useAuthStore();

  const persisted = localStorage.getItem('farchain-auth');
  const manualToken = localStorage.getItem('farchain-token');

  const hasToken =
    Boolean(accessToken) ||
    Boolean(manualToken) ||
    Boolean(persisted && persisted.includes('accessToken'));

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
