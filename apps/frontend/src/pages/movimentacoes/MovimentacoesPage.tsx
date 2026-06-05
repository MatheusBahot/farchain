import PageShell from '@components/ui/PageShell';

export default function MovimentacoesPage() {
  return (
    <PageShell
      eyebrow="Logística farmacêutica"
      title="Movimentações rastreadas em tempo real."
      subtitle="Acompanhe entradas, saídas, transferências e transporte entre unidades com auditoria integrada."
      primaryAction="Nova movimentação"
      tableTitle="Fluxo de movimentações"
      variant="timeline"
      stats={[
        { label: 'Movimentações', value: '8.753', trend: '+18%' },
        { label: 'Hoje', value: '118', trend: '+9%' },
        { label: 'Em trânsito', value: '42', trend: 'OK' },
        { label: 'Auditadas', value: '100%', trend: 'OK' },
      ]}
    />
  );
}
