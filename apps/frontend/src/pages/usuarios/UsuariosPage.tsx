import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Search } from 'lucide-react';
import { api } from '@services/api';
import { Table } from '@components/ui/Table';
import { Pagination } from '@components/ui/Pagination';
import { Badge } from '@components/ui/Badge';
import { Input } from '@components/ui/Input';
import { PageSpinner } from '@components/ui/Spinner';
import { usePagination } from '@hooks/usePagination';
import { useDebounce } from '@hooks/useDebounce';

const roleCor: Record<string, string> = {
  SUPER_ADMIN:'danger', ADMIN:'danger', GESTOR_ESTADUAL:'warning',
  GESTOR_MUNICIPAL:'warning', FARMACEUTICO:'primary', OPERADOR_CAF:'teal',
  AUDITOR:'primary', VISUALIZADOR:'gray', PACIENTE:'gray',
};

export default function UsuariosPage() {
  const [busca, setBusca] = useState('');
  const buscaD = useDebounce(busca);
  const { pagina, limite, irParaPagina } = usePagination(20);

  const { data, isLoading } = useQuery({
    queryKey: ['usuarios', pagina, buscaD],
    queryFn: () => api.get('/usuarios', { params: { pagina, limite, busca: buscaD } }).then(r => r.data.data),
  });

  const columns = [
    { key: 'nome', label: 'Nome',
      render: (r: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
            {r.nome?.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-grafite-900 dark:text-white text-sm">{r.nome}</p>
            <p className="text-xs text-grafite-400">{r.email}</p>
          </div>
        </div>
      )},
    { key: 'role', label: 'Perfil',
      render: (r: any) => <Badge variant={(roleCor[r.role] as any) ?? 'gray'}>{r.role}</Badge> },
    { key: 'unidade', label: 'Unidade',
      render: (r: any) => <span className="text-sm text-grafite-500">{r.unidade?.nome ?? '—'}</span> },
    { key: 'ativo', label: 'Status',
      render: (r: any) => <Badge variant={r.ativo ? 'success' : 'gray'} dot>{r.ativo ? 'Ativo' : 'Inativo'}</Badge> },
    { key: 'ultimoLogin', label: 'Último Login',
      render: (r: any) => (
        <span className="text-xs text-grafite-400">
          {r.ultimoLogin ? new Date(r.ultimoLogin).toLocaleDateString('pt-BR') : '—'}
        </span>
      )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-grafite-900 dark:text-white flex items-center gap-2">
          <Users size={22} className="text-primary-500" /> Usuários
        </h1>
        <p className="text-grafite-500 text-sm mt-0.5">Gestão de acesso e perfis da plataforma</p>
      </div>
      <div className="card p-4">
        <Input placeholder="Buscar por nome ou e-mail..." value={busca}
          onChange={e => { setBusca(e.target.value); irParaPagina(1); }}
          leftIcon={<Search size={16} />} />
      </div>
      {isLoading ? <PageSpinner /> : (
        <>
          <Table columns={columns} data={data?.dados ?? []} />
          {data && <Pagination pagina={pagina} total={data.total} limite={limite} onChange={irParaPagina} />}
        </>
      )}
    </div>
  );
}
