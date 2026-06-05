import PageShell from '@components/ui/PageShell';

export default function UsuariosPage() {
  return (
    <PageShell
      eyebrow="Controle de acesso"
      title="Usuários, perfis e permissões."
      subtitle="Gerencie administradores, farmacêuticos, auditores, gestores e operadores com RBAC institucional."
      primaryAction="Novo usuário"
      tableTitle="Usuários do sistema"
      variant="cards"
      stats={[
        { label: 'Usuários', value: '312', trend: '+8%' },
        { label: 'Ativos', value: '298', trend: '+5%' },
        { label: 'Auditores', value: '24', trend: 'OK' },
        { label: 'MFA', value: '86%', trend: '+9%' },
      ]}
      rows={[
        { item: 'Administrador FarmaChain', status: 'SUPER_ADMIN', unidade: 'Sistema central', data: 'Ativo' },
        { item: 'Farmacêutico CEAF', status: 'FARMACEUTICO', unidade: 'CEAF Salvador', data: 'Ativo' },
        { item: 'Auditor Municipal', status: 'AUDITOR', unidade: 'SMS Salvador', data: 'Ativo' },
      ]}
    />
  );
}
