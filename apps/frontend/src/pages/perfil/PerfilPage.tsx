import { useQuery } from '@tanstack/react-query';
import { authApi } from '@services/api';
import { User, Mail, Shield, Building2, Clock } from 'lucide-react';
import { Badge } from '@components/ui/Badge';
import { PageSpinner } from '@components/ui/Spinner';

export default function PerfilPage() {
  const { data: perfil, isLoading } = useQuery({
    queryKey: ['auth', 'perfil'],
    queryFn: authApi.perfil,
  });

  if (isLoading) return <PageSpinner />;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-grafite-900 dark:text-white">Meu Perfil</h1>
      <div className="card p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500
                          flex items-center justify-center text-white text-3xl font-bold">
            {perfil?.nome?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-grafite-900 dark:text-white">{perfil?.nome}</h2>
            <p className="text-grafite-400 text-sm">{perfil?.email}</p>
            <div className="mt-2">
              <Badge variant="primary">{perfil?.role}</Badge>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Mail, label: 'E-mail', valor: perfil?.email },
            { icon: Shield, label: 'Perfil', valor: perfil?.role },
            { icon: Building2, label: 'Unidade', valor: perfil?.unidade?.nome ?? 'Não vinculado' },
            { icon: User, label: 'CRF', valor: perfil?.crfNumero ?? '—' },
            { icon: Clock, label: 'Último login',
              valor: perfil?.ultimoLogin ? new Date(perfil.ultimoLogin).toLocaleString('pt-BR') : '—' },
            { icon: Shield, label: 'MFA',
              valor: perfil?.mfaAtivo ? 'Habilitado' : 'Desabilitado' },
          ].map(item => (
            <div key={item.label} className="bg-grafite-50 dark:bg-grafite-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <item.icon size={14} className="text-grafite-400" />
                <span className="text-xs text-grafite-400">{item.label}</span>
              </div>
              <p className="text-sm font-medium text-grafite-900 dark:text-white">{item.valor}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
