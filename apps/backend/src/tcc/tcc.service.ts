import { Injectable, OnModuleInit } from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class TccService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.ensureTables();
  }

  private async ensureTables() {
    await this.prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS tcc_medicamentos_lotes (
        id TEXT PRIMARY KEY,
        medicamento TEXT NOT NULL,
        principio_ativo TEXT,
        fabricante TEXT,
        apresentacao TEXT,
        concentracao TEXT,
        classe_terapeutica TEXT,
        componente TEXT,
        registro_anvisa TEXT,
        temperatura TEXT,
        numero_lote TEXT NOT NULL,
        validade TEXT,
        origem TEXT,
        distribuidor TEXT,
        armazenamento TEXT,
        temperatura_minima TEXT,
        temperatura_maxima TEXT,
        quantidade_inicial TEXT,
        status TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await this.prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS tcc_dispensacoes (
        id TEXT PRIMARY KEY,
        nome TEXT,
        cpf TEXT,
        cns TEXT,
        data_nascimento TEXT,
        sexo TEXT,
        municipio TEXT,
        distrito_sanitario TEXT,
        unidade_saude TEXT,
        telefone TEXT,
        cid10 TEXT,
        diagnostico TEXT,
        medico TEXT,
        crm TEXT,
        data_prescricao TEXT,
        validade_prescricao TEXT,
        medicamento TEXT,
        lote TEXT,
        quantidade TEXT,
        data_dispensacao TEXT,
        farmaceutico TEXT,
        crf TEXT,
        local_dispensacao TEXT,
        temperatura_saida TEXT,
        status TEXT,
        paciente_hash TEXT,
        latitude TEXT,
        longitude TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await this.prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS tcc_blockchain (
        id TEXT PRIMARY KEY,
        indice INTEGER NOT NULL,
        tipo TEXT NOT NULL,
        hash_anterior TEXT NOT NULL,
        hash TEXT NOT NULL,
        payload JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
  }

  private sha256(data: any) {
    return createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  private async criarBloco(tipo: string, payload: any) {
    const ultimo = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT indice, hash
      FROM tcc_blockchain
      ORDER BY indice DESC
      LIMIT 1
    `);

    const indice = ultimo.length ? Number(ultimo[0].indice) + 1 : 1;
    const hashAnterior = ultimo.length ? ultimo[0].hash : 'GENESIS';
    const id = randomUUID();

    const hash = this.sha256({
      indice,
      tipo,
      hashAnterior,
      payload,
      timestamp: new Date().toISOString(),
    });

    await this.prisma.$executeRaw`
      INSERT INTO tcc_blockchain
      (id, indice, tipo, hash_anterior, hash, payload)
      VALUES (
        ${id},
        ${indice},
        ${tipo},
        ${hashAnterior},
        ${hash},
        ${JSON.stringify(payload)}::jsonb
      )
    `;

    return { id, indice, tipo, hashAnterior, hash, payload };
  }

  async registrarMedicamentoLote(body: any) {
    await this.ensureTables();

    const id = randomUUID();

    const payload = {
      registroId: id,
      medicamento: body.medicamento,
      principioAtivo: body.principioAtivo,
      fabricante: body.fabricante,
      apresentacao: body.apresentacao,
      concentracao: body.concentracao,
      classeTerapeutica: body.classeTerapeutica,
      componente: body.componente,
      registroAnvisa: body.registroAnvisa,
      temperatura: body.temperatura,
      numeroLote: body.numeroLote,
      validade: body.validade,
      origem: body.origem,
      distribuidor: body.distribuidor,
      armazenamento: body.armazenamento,
      temperaturaMinima: body.temperaturaMinima,
      temperaturaMaxima: body.temperaturaMaxima,
      quantidadeInicial: body.quantidadeInicial,
      status: body.status || 'Ativo',
    };

    await this.prisma.$executeRaw`
      INSERT INTO tcc_medicamentos_lotes (
        id, medicamento, principio_ativo, fabricante, apresentacao, concentracao,
        classe_terapeutica, componente, registro_anvisa, temperatura,
        numero_lote, validade, origem, distribuidor, armazenamento,
        temperatura_minima, temperatura_maxima, quantidade_inicial, status
      )
      VALUES (
        ${id}, ${payload.medicamento}, ${payload.principioAtivo}, ${payload.fabricante},
        ${payload.apresentacao}, ${payload.concentracao}, ${payload.classeTerapeutica},
        ${payload.componente}, ${payload.registroAnvisa}, ${payload.temperatura},
        ${payload.numeroLote}, ${payload.validade}, ${payload.origem}, ${payload.distribuidor},
        ${payload.armazenamento}, ${payload.temperaturaMinima}, ${payload.temperaturaMaxima},
        ${payload.quantidadeInicial}, ${payload.status}
      )
    `;

    const bloco1 = await this.criarBloco('CADASTRO_MEDICAMENTO_LOTE', payload);

    const bloco2 = await this.criarBloco('ARMAZENAMENTO_CAF', {
      medicamento: payload.medicamento,
      lote: payload.numeroLote,
      origem: payload.origem,
      distribuidor: payload.distribuidor,
      armazenamento: payload.armazenamento,
      temperatura: payload.temperatura,
      temperaturaMinima: payload.temperaturaMinima,
      temperaturaMaxima: payload.temperaturaMaxima,
      status: 'Medicamento acondicionado na CAF',
    });

    return {
      registrado: true,
      medicamentoLoteId: id,
      blocos: [bloco1, bloco2],
    };
  }

  async listarMedicamentosLotes() {
    await this.ensureTables();

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM tcc_medicamentos_lotes ORDER BY created_at DESC
    `);

    return rows.map((r) => ({
      id: r.id,
      medicamento: r.medicamento,
      principioAtivo: r.principio_ativo,
      fabricante: r.fabricante,
      apresentacao: r.apresentacao,
      concentracao: r.concentracao,
      classeTerapeutica: r.classe_terapeutica,
      componente: r.componente,
      registroAnvisa: r.registro_anvisa,
      temperatura: r.temperatura,
      numeroLote: r.numero_lote,
      validade: r.validade,
      origem: r.origem,
      distribuidor: r.distribuidor,
      armazenamento: r.armazenamento,
      temperaturaMinima: r.temperatura_minima,
      temperaturaMaxima: r.temperatura_maxima,
      quantidadeInicial: r.quantidade_inicial,
      status: r.status,
      createdAt: r.created_at,
    }));
  }

  async registrarDispensacao(body: any) {
    await this.ensureTables();

    const id = randomUUID();

    const pacienteHash = this.sha256({
      nome: body.nome,
      cpf: body.cpf,
      cns: body.cns,
    });

    const payload = {
      dispensacaoId: id,
      nome: body.nome,
      pacienteHash,
      cns: body.cns ? 'PSEUDONIMIZADO' : null,
      dataNascimento: body.dataNascimento,
      sexo: body.sexo,
      municipio: body.municipio,
      distritoSanitario: body.distritoSanitario,
      unidadeSaude: body.unidadeSaude,
      telefone: body.telefone ? 'PSEUDONIMIZADO' : null,
      cid10: body.cid10,
      diagnostico: body.diagnostico,
      medico: body.medico,
      crm: body.crm,
      dataPrescricao: body.dataPrescricao,
      validadePrescricao: body.validadePrescricao,
      medicamento: body.medicamento,
      lote: body.lote,
      quantidade: body.quantidade,
      dataDispensacao: body.dataDispensacao,
      farmaceutico: body.farmaceutico,
      crf: body.crf,
      localDispensacao: body.localDispensacao,
      temperaturaSaida: body.temperaturaSaida,
      status: body.status || 'Dispensado',
      latitude: body.latitude,
      longitude: body.longitude,
      gps: `${body.latitude || ''}, ${body.longitude || ''}`,
    };

    await this.prisma.$executeRaw`
      INSERT INTO tcc_dispensacoes (
        id, nome, cpf, cns, data_nascimento, sexo, municipio, distrito_sanitario,
        unidade_saude, telefone, cid10, diagnostico, medico, crm,
        data_prescricao, validade_prescricao, medicamento, lote, quantidade,
        data_dispensacao, farmaceutico, crf, local_dispensacao,
        temperatura_saida, status, paciente_hash, latitude, longitude
      )
      VALUES (
        ${id}, ${body.nome}, ${body.cpf}, ${body.cns}, ${body.dataNascimento},
        ${body.sexo}, ${body.municipio}, ${body.distritoSanitario},
        ${body.unidadeSaude}, ${body.telefone}, ${body.cid10}, ${body.diagnostico},
        ${body.medico}, ${body.crm}, ${body.dataPrescricao}, ${body.validadePrescricao},
        ${body.medicamento}, ${body.lote}, ${body.quantidade}, ${body.dataDispensacao},
        ${body.farmaceutico}, ${body.crf}, ${body.localDispensacao},
        ${body.temperaturaSaida}, ${payload.status}, ${pacienteHash},
        ${body.latitude}, ${body.longitude}
      )
    `;

    const blocoPrescricao = await this.criarBloco('PRESCRICAO_MEDICA', {
      medicamento: body.medicamento,
      lote: body.lote,
      cid10: body.cid10,
      diagnostico: body.diagnostico,
      medico: body.medico,
      crm: body.crm,
      dataPrescricao: body.dataPrescricao,
      validadePrescricao: body.validadePrescricao,
      pacienteHash,
    });

    const blocoDispensacao = await this.criarBloco('DISPENSACAO', payload);

    return {
      registrado: true,
      dispensacaoId: id,
      pacienteHash,
      blocos: [blocoPrescricao, blocoDispensacao],
    };
  }

  async listarDispensacoes() {
    await this.ensureTables();

    const rows = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM tcc_dispensacoes ORDER BY created_at DESC
    `);

    return rows.map((r) => ({
      id: r.id,
      nome: r.nome,
      cpf: r.cpf,
      cns: r.cns,
      dataNascimento: r.data_nascimento,
      sexo: r.sexo,
      municipio: r.municipio,
      distritoSanitario: r.distrito_sanitario,
      unidadeSaude: r.unidade_saude,
      telefone: r.telefone,
      cid10: r.cid10,
      diagnostico: r.diagnostico,
      medico: r.medico,
      crm: r.crm,
      dataPrescricao: r.data_prescricao,
      validadePrescricao: r.validade_prescricao,
      medicamento: r.medicamento,
      lote: r.lote,
      quantidade: r.quantidade,
      dataDispensacao: r.data_dispensacao,
      farmaceutico: r.farmaceutico,
      crf: r.crf,
      localDispensacao: r.local_dispensacao,
      temperaturaSaida: r.temperatura_saida,
      status: r.status,
      pacienteHash: r.paciente_hash,
      latitude: r.latitude,
      longitude: r.longitude,
      createdAt: r.created_at,
    }));
  }

  async listarBlockchain() {
    await this.ensureTables();

    return this.prisma.$queryRawUnsafe<any[]>(`
      SELECT
        id,
        indice,
        tipo,
        hash_anterior AS "hashAnterior",
        hash,
        payload,
        created_at AS "createdAt"
      FROM tcc_blockchain
      ORDER BY indice DESC
    `);
  }

  async rastrearPorLote(lote: string) {
    await this.ensureTables();

    const blocos = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT
        id,
        indice,
        tipo,
        hash_anterior AS "hashAnterior",
        hash,
        payload,
        created_at AS "createdAt"
      FROM tcc_blockchain
      WHERE payload::text ILIKE $1
      ORDER BY indice ASC
    `, `%${lote}%`);

    const medicamento = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT *
      FROM tcc_medicamentos_lotes
      WHERE numero_lote = $1
      LIMIT 1
    `, lote);

    const dispensacao = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT *
      FROM tcc_dispensacoes
      WHERE lote = $1
      ORDER BY created_at DESC
      LIMIT 1
    `, lote);

    return {
      lote,
      medicamento: medicamento[0] || null,
      dispensacao: dispensacao[0] || null,
      blocos,
      totalEventos: blocos.length,
    };
  }

  async resetarDemo() {
    await this.ensureTables();
    await this.prisma.$executeRawUnsafe(`DELETE FROM tcc_blockchain`);
    await this.prisma.$executeRawUnsafe(`DELETE FROM tcc_dispensacoes`);
    await this.prisma.$executeRawUnsafe(`DELETE FROM tcc_medicamentos_lotes`);
    return { resetado: true };
  }
}
