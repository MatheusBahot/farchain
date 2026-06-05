import PageShell from '@components/ui/PageShell';

export default function PerfilPage() {
  return (
    <PageShell
      eyebrow="Perfil"
      title="Minha conta institucional."
      subtitle="Visualize dados do usuário, permissões, unidade vinculada e configurações de segurança."
      primaryAction="Atualizar perfil"
      tableTitle="Resumo da conta"
      variant="cards"
    />
  );
}
