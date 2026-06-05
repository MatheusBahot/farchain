import PageShell from '@components/ui/PageShell';

export default function UnidadesPage() {
  return (
    <PageShell
      eyebrow="Rede assistencial"
      title="Unidades de saúde integradas."
      subtitle="Gerencie CAF, unidades dispensadoras, localização, vínculo distrital e status operacional."
      primaryAction="Nova unidade"
      tableTitle="Unidades cadastradas"
      variant="cards"
      stats={[
        { label: 'Unidades', value: '128', trend: '+3%' },
        { label: 'Ativas', value: '121', trend: 'OK' },
        { label: 'CAF', value: '12', trend: 'OK' },
        { label: 'Distritos', value: '12', trend: 'OK' },
      ]}
      rows={[
        { item: 'CEAF Salvador', status: 'CAF', unidade: 'Centro · Salvador BA', data: 'Ativa' },
        { item: 'Policlínica Itapuã', status: 'Unidade', unidade: 'Itapuã · Salvador BA', data: 'Ativa' },
        { item: 'UPA São Marcos', status: 'Unidade', unidade: 'São Marcos · Salvador BA', data: 'Ativa' },
      ]}
    />
  );
}
