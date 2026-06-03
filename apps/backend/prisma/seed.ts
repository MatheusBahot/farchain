import { PrismaClient, Role, FormaFarmaceutica, ClasseCEAF } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do FarChain...');

  // ============================================================
  // DISTRITOS SANITÁRIOS DE SALVADOR/BA
  // ============================================================
  const distritosData = [
    { codigo: 'I',    nome: 'Distrito Sanitário I — Itapagipe',             populacao: 150000 },
    { codigo: 'II',   nome: 'Distrito Sanitário II — Centro Histórico',     populacao: 90000 },
    { codigo: 'III',  nome: 'Distrito Sanitário III — Liberdade',           populacao: 280000 },
    { codigo: 'IV',   nome: 'Distrito Sanitário IV — Subúrbio Ferroviário', populacao: 350000 },
    { codigo: 'V',    nome: 'Distrito Sanitário V — Barra/Rio Vermelho',    populacao: 200000 },
    { codigo: 'VI',   nome: 'Distrito Sanitário VI — Brotas',               populacao: 310000 },
    { codigo: 'VII',  nome: 'Distrito Sanitário VII — Itapuã',              populacao: 420000 },
    { codigo: 'VIII', nome: 'Distrito Sanitário VIII — Pau da Lima',        populacao: 380000 },
    { codigo: 'IX',   nome: 'Distrito Sanitário IX — Cabula/Beiru',         populacao: 340000 },
    { codigo: 'X',    nome: 'Distrito Sanitário X — Boca do Rio',           populacao: 290000 },
    { codigo: 'XI',   nome: 'Distrito Sanitário XI — Cajazeiras',           populacao: 450000 },
    { codigo: 'XII',  nome: 'Distrito Sanitário XII — Valéria',             populacao: 180000 },
  ];

  const distritos: Record<string, any> = {};
  for (const d of distritosData) {
    const distrito = await prisma.distritoSanitario.upsert({
      where: { codigo: d.codigo },
      update: {},
      create: { codigo: d.codigo, nome: d.nome, municipio: 'Salvador', uf: 'BA', populacao: d.populacao },
    });
    distritos[d.codigo] = distrito;
  }
  console.log('✅ 12 Distritos Sanitários criados');

  // ============================================================
  // UNIDADES DE SAÚDE
  // ============================================================
  const caf = await prisma.unidadeSaude.upsert({
    where: { cnes: '9999999' },
    update: {},
    create: {
      cnes: '9999999',
      nome: 'Centro de Assistência Farmacêutica de Salvador — CAF Central',
      tipo: 'CAF',
      ehCAF: true,
      logradouro: 'Av. ACM',
      municipio: 'Salvador',
      uf: 'BA',
      cep: '40155-740',
      latitude: -12.9704,
      longitude: -38.5124,
      distritoId: distritos['V'].id,
    },
  });

  const unidades = [
    { cnes: '0000001', nome: 'UBS Itapagipe', tipo: 'UBS', bairro: 'Itapagipe', distritoKey: 'I', lat: -12.9020, lng: -38.5130 },
    { cnes: '0000002', nome: 'UBS Liberdade', tipo: 'UBS', bairro: 'Liberdade', distritoKey: 'III', lat: -12.9320, lng: -38.5050 },
    { cnes: '0000003', nome: 'UBS Cajazeiras', tipo: 'UBS', bairro: 'Cajazeiras', distritoKey: 'XI', lat: -12.8930, lng: -38.4050 },
    { cnes: '0000004', nome: 'UBS Pau da Lima', tipo: 'UBS', bairro: 'Pau da Lima', distritoKey: 'VIII', lat: -12.9120, lng: -38.4300 },
    { cnes: '0000005', nome: 'Policlínica Bonocô', tipo: 'Policlínica', bairro: 'Bonocô', distritoKey: 'VI', lat: -12.9500, lng: -38.4700 },
    { cnes: '0000006', nome: 'Hospital Geral do Estado', tipo: 'Hospital', bairro: 'Brotas', distritoKey: 'VI', lat: -12.9600, lng: -38.4900 },
  ];

  const unidadesCriadas: Record<string, any> = { CAF: caf };
  for (const u of unidades) {
    const unidade = await prisma.unidadeSaude.upsert({
      where: { cnes: u.cnes },
      update: {},
      create: {
        cnes: u.cnes,
        nome: u.nome,
        tipo: u.tipo,
        bairro: u.bairro,
        municipio: 'Salvador',
        uf: 'BA',
        distritoId: distritos[u.distritoKey].id,
        latitude: u.lat,
        longitude: u.lng,
        ativo: true,
      },
    });
    unidadesCriadas[u.cnes] = unidade;
  }
  console.log('✅ Unidades de saúde criadas');

  // ============================================================
  // USUÁRIOS
  // ============================================================
  const senhaHash = await argon2.hash('FarChain@2024', {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  const usuarios = [
    { nome: 'Administrador FarChain', email: 'admin@farchain.gov.br', cpf: '00000000001', role: Role.SUPER_ADMIN },
    { nome: 'Dr. Carlos Menezes — Farmacêutico CAF', email: 'farmaceutico@farchain.gov.br', cpf: '00000000002', role: Role.FARMACEUTICO, crfNumero: 'CRF-BA 12345', unidadeCnes: '9999999' },
    { nome: 'Ana Lima — Gestora Municipal', email: 'gestora@farchain.gov.br', cpf: '00000000003', role: Role.GESTOR_MUNICIPAL },
    { nome: 'João Auditoria', email: 'auditor@farchain.gov.br', cpf: '00000000004', role: Role.AUDITOR },
    { nome: 'Maria Operadora CAF', email: 'operador@farchain.gov.br', cpf: '00000000005', role: Role.OPERADOR_CAF, unidadeCnes: '9999999' },
    { nome: 'Pedro Visualizador', email: 'viewer@farchain.gov.br', cpf: '00000000006', role: Role.VISUALIZADOR },
  ];

  for (const u of usuarios) {
    const unidadeId = u.unidadeCnes ? unidadesCriadas[u.unidadeCnes]?.id : undefined;
    await prisma.usuario.upsert({
      where: { email: u.email },
      update: {},
      create: {
        nome: u.nome,
        email: u.email,
        cpf: u.cpf,
        senhaHash,
        role: u.role,
        ativo: true,
        emailVerificado: true,
        crfNumero: u.crfNumero,
        unidadeId,
      },
    });
  }
  console.log('✅ Usuários criados (senha padrão: FarChain@2024)');

  // ============================================================
  // MEDICAMENTOS CEAF (BIOLOGICOS REAIS)
  // ============================================================
  const medicamentos = [
    {
      dcb: 'ADALIMUMABE',
      nomeComercial: 'Humira',
      principioAtivo: 'adalimumabe',
      fabricante: 'AbbVie',
      distribuidor: 'AbbVie Brasil',
      registroSanitario: '1.2345.0001.001-1',
      classeTerapeutica: 'Imunossupressor / Anti-TNF',
      subclasse: 'Anticorpo monoclonal',
      formaFarmaceutica: FormaFarmaceutica.SERINGA_PREENCHIDA,
      concentracao: '40mg/0,8mL',
      apresentacao: '2 seringas preenchidas',
      viaAdministracao: 'Subcutânea',
      classeCEAF: ClasseCEAF.COMPONENTE_I_A,
      protocoloClinico: 'PCDT Artrite Reumatoide / Doença de Crohn',
      cid10: 'M05,M06,K50,K51,L40',
      temperaturaMin: 2,
      temperaturaMax: 8,
      requireCadeiaFria: true,
      condicoesArmazenamento: 'Refrigerado entre 2°C e 8°C. Não congelar. Proteger da luz.',
      custoCentral: 4521.00,
    },
    {
      dcb: 'ETANERCEPTE',
      nomeComercial: 'Enbrel',
      principioAtivo: 'etanercepte',
      fabricante: 'Pfizer',
      distribuidor: 'Pfizer Brasil',
      registroSanitario: '1.2345.0002.001-1',
      classeTerapeutica: 'Imunossupressor / Anti-TNF',
      subclasse: 'Proteína de fusão',
      formaFarmaceutica: FormaFarmaceutica.SERINGA_PREENCHIDA,
      concentracao: '50mg/1mL',
      apresentacao: '4 seringas preenchidas',
      viaAdministracao: 'Subcutânea',
      classeCEAF: ClasseCEAF.COMPONENTE_I_A,
      protocoloClinico: 'PCDT Artrite Reumatoide / Espondiloartrite',
      cid10: 'M05,M06,M45',
      temperaturaMin: 2,
      temperaturaMax: 8,
      requireCadeiaFria: true,
      condicoesArmazenamento: 'Refrigerado entre 2°C e 8°C. Não congelar.',
      custoCentral: 3890.00,
    },
    {
      dcb: 'SECUQUINUMABE',
      nomeComercial: 'Cosentyx',
      principioAtivo: 'secuquinumabe',
      fabricante: 'Novartis',
      distribuidor: 'Novartis Brasil',
      registroSanitario: '1.2345.0003.001-1',
      classeTerapeutica: 'Imunossupressor / Anti-IL-17A',
      subclasse: 'Anticorpo monoclonal',
      formaFarmaceutica: FormaFarmaceutica.CANETA_APLICADORA,
      concentracao: '150mg/mL',
      apresentacao: '1 caneta aplicadora',
      viaAdministracao: 'Subcutânea',
      classeCEAF: ClasseCEAF.COMPONENTE_I_A,
      protocoloClinico: 'PCDT Psoríase / Espondiloartrite',
      cid10: 'L40,M45,M07',
      temperaturaMin: 2,
      temperaturaMax: 8,
      requireCadeiaFria: true,
      condicoesArmazenamento: 'Refrigerado entre 2°C e 8°C.',
      custoCentral: 6200.00,
    },
    {
      dcb: 'METOTREXATO',
      nomeComercial: 'Metotrexato',
      principioAtivo: 'metotrexato',
      fabricante: 'Farmácias Públicas',
      distribuidor: 'Farmanguinhos',
      registroSanitario: '1.2345.0004.001-1',
      classeTerapeutica: 'Antineoplásico / Imunossupressor',
      subclasse: 'Antimetabólito',
      formaFarmaceutica: FormaFarmaceutica.COMPRIMIDO,
      concentracao: '2,5mg',
      apresentacao: '60 comprimidos',
      viaAdministracao: 'Oral',
      classeCEAF: ClasseCEAF.COMPONENTE_I_B,
      protocoloClinico: 'PCDT Artrite Reumatoide / Psoríase',
      cid10: 'M05,M06,L40',
      requireCadeiaFria: false,
      condicoesArmazenamento: 'Temperatura ambiente (15°C a 30°C). Proteger da luz e umidade.',
      custoCentral: 85.00,
    },
    {
      dcb: 'OMALIZUMABE',
      nomeComercial: 'Xolair',
      principioAtivo: 'omalizumabe',
      fabricante: 'Novartis',
      distribuidor: 'Novartis Brasil',
      registroSanitario: '1.2345.0005.001-1',
      classeTerapeutica: 'Antialérgico / Anti-IgE',
      subclasse: 'Anticorpo monoclonal',
      formaFarmaceutica: FormaFarmaceutica.PO_INJETAVEL,
      concentracao: '150mg',
      apresentacao: '1 frasco-ampola',
      viaAdministracao: 'Subcutânea',
      classeCEAF: ClasseCEAF.COMPONENTE_I_A,
      protocoloClinico: 'PCDT Asma Grave',
      cid10: 'J45',
      temperaturaMin: 2,
      temperaturaMax: 8,
      requireCadeiaFria: true,
      condicoesArmazenamento: 'Refrigerado entre 2°C e 8°C. Após reconstituição, utilizar em 8h.',
      custoCentral: 3450.00,
    },
    {
      dcb: 'IMUNOGLOBULINA HUMANA',
      nomeComercial: 'Octagam',
      principioAtivo: 'imunoglobulina humana normal',
      fabricante: 'Octapharma',
      distribuidor: 'Octapharma Brasil',
      registroSanitario: '1.2345.0006.001-1',
      classeTerapeutica: 'Imunoglobulina',
      formaFarmaceutica: FormaFarmaceutica.SOLUCAO_INJETAVEL,
      concentracao: '100mg/mL',
      apresentacao: '1 frasco 200mL',
      viaAdministracao: 'Intravenosa',
      classeCEAF: ClasseCEAF.COMPONENTE_I_A,
      protocoloClinico: 'PCDT Imunodeficiências Primárias',
      cid10: 'D80,D81,D82,D83',
      temperaturaMin: 2,
      temperaturaMax: 8,
      requireCadeiaFria: true,
      condicoesArmazenamento: 'Refrigerado entre 2°C e 8°C. Não congelar.',
      custoCentral: 8900.00,
    },
  ];

  const medsCriados: Record<string, any> = {};
  for (const m of medicamentos) {
    const med = await prisma.medicamento.upsert({
      where: { registroSanitario: m.registroSanitario! },
      update: {},
      create: m as any,
    });
    medsCriados[m.dcb] = med;
  }
  console.log('✅ Medicamentos CEAF cadastrados');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('  Admin:        admin@farchain.gov.br     / FarChain@2024');
  console.log('  Farmacêutico: farmaceutico@farchain.gov.br / FarChain@2024');
  console.log('  Gestora:      gestora@farchain.gov.br   / FarChain@2024');
  console.log('  Auditor:      auditor@farchain.gov.br   / FarChain@2024');
}

main()
  .catch((e) => { console.error('❌ Erro no seed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
