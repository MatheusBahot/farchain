import PageShell from '@components/ui/PageShell';

export default function FarmacovigilanciaPage() {
  return (
    <PageShell
      eyebrow="Segurança do paciente"
      title="Farmacovigilância conectada ao lote."
      subtitle="Registre eventos adversos, queixas técnicas e investigações vinculadas ao histórico rastreável."
      primaryAction="Novo evento"
      tableTitle="Eventos de farmacovigilância"
      stats={[
        { label: 'Eventos', value: '214', trend: '+4%' },
        { label: 'Abertos', value: '38', trend: 'Atenção' },
        { label: 'Graves', value: '6', trend: '-1%' },
        { label: 'Encerrados', value: '176', trend: '+9%' },
      ]}
      rows={[
        { item: 'RAM #204', status: 'Em análise', unidade: 'Adalimumabe · Lote ADA-2026-042', data: 'Hoje' },
        { item: 'Queixa #198', status: 'Aberta', unidade: 'Metotrexato · embalagem', data: 'Ontem' },
        { item: 'RAM #183', status: 'Encerrada', unidade: 'Omalizumabe · leve', data: '3 dias' },
      ]}
    />
  );
}
