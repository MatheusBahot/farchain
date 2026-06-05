import PageShell from '@components/ui/PageShell';

export default function ConfiguracoesPage() {
  return (
    <PageShell
      eyebrow="Configurações"
      title="Parâmetros da plataforma."
      subtitle="Configure segurança, integrações, blockchain, notificações, backup e preferências institucionais."
      primaryAction="Salvar alterações"
      tableTitle="Módulos configuráveis"
      variant="cards"
      stats={[
        { label: 'Integrações', value: '8', trend: 'OK' },
        { label: 'Backups', value: 'Diário', trend: 'OK' },
        { label: 'Segurança', value: 'Alta', trend: 'OK' },
        { label: 'Versão', value: '1.0.0', trend: 'OK' },
      ]}
      rows={[
        { item: 'Segurança', status: 'Ativo', unidade: 'JWT · RBAC · LGPD', data: 'Configurado' },
        { item: 'Blockchain', status: 'Ativo', unidade: 'SHA-256 · Ledger', data: 'Configurado' },
        { item: 'Notificações', status: 'Ativo', unidade: 'E-mail · Sistema', data: 'Configurado' },
      ]}
    />
  );
}
