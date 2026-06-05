import PageShell from '@components/ui/PageShell';

export default function AuditoriaPage() {
  return (
    <PageShell
      eyebrow="Trilha de auditoria"
      title="Toda ação crítica registrada."
      subtitle="Monitore autenticações, alterações, dispensações, bloqueios e eventos blockchain com visão cronológica."
      primaryAction="Exportar relatório"
      tableTitle="Atividade recente"
      variant="timeline"
      stats={[
        { label: 'Logs', value: '32.481', trend: '+12%' },
        { label: 'Hoje', value: '814', trend: '+6%' },
        { label: 'Críticos', value: '17', trend: 'Atenção' },
        { label: 'Integridade', value: '100%', trend: 'OK' },
      ]}
    />
  );
}
