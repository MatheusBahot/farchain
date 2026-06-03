import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import * as crypto from 'crypto';

@Injectable()
export class LotesService {
  constructor(
    private prisma: PrismaService,
    private blockchain: BlockchainService,
  ) {}

  private gerarHashLote(dto: CreateLoteDto, uuid: string): string {
    const conteudo = JSON.stringify({ uuid, ...dto, ts: Date.now() });
    return crypto.createHash('sha256').update(conteudo).digest('hex');
  }

  async criar(dto: CreateLoteDto, usuarioId: string) {
    const medicamento = await this.prisma.medicamento.findUnique({
      where: { id: dto.medicamentoId },
    });
    if (!medicamento) throw new NotFoundException('Medicamento não encontrado');

    const dataVal = new Date(dto.dataValidade);
    if (dataVal <= new Date()) {
      throw new BadRequestException('Data de validade deve ser futura');
    }

    const hashCriptografico = this.gerarHashLote(dto, crypto.randomUUID());

    const lote = await this.prisma.lote.create({
      data: {
        medicamentoId: dto.medicamentoId,
        numeroLote: dto.numeroLote,
        fabricante: dto.fabricante,
        dataFabricacao: new Date(dto.dataFabricacao),
        dataValidade: dataVal,
        quantidadeProduzida: dto.quantidadeProduzida,
        quantidadeRecebida: dto.quantidadeRecebida,
        notaFiscal: dto.notaFiscal,
        fornecedor: dto.fornecedor,
        observacoes: dto.observacoes,
        hashCriptografico,
        statusSanitario: 'ATIVO',
      },
      include: { medicamento: true },
    });

    // Criar estoque inicial se unidade fornecida
    if (dto.unidadeDestinoId) {
      await this.prisma.estoqueLote.create({
        data: {
          loteId: lote.id,
          unidadeId: dto.unidadeDestinoId,
          quantidade: dto.quantidadeRecebida,
        },
      });
    }

    // Registrar na blockchain
    const hashBloco = await this.blockchain.adicionarBloco(
      {
        loteId: lote.id,
        numeroLote: lote.numeroLote,
        medicamento: medicamento.dcb,
        quantidade: lote.quantidadeRecebida,
        hashLote: hashCriptografico,
      },
      'CRIACAO_LOTE',
      lote.id,
      'Lote',
      usuarioId,
    );

    return { ...lote, hashBloco };
  }

  async listar(pagina = 1, limite = 20, filtros?: any) {
    const skip = (pagina - 1) * limite;
    const where: any = {};

    if (filtros?.medicamentoId) where.medicamentoId = filtros.medicamentoId;
    if (filtros?.status) where.statusSanitario = filtros.status;
    if (filtros?.vencendoEm) {
      const data = new Date();
      data.setDate(data.getDate() + parseInt(filtros.vencendoEm));
      where.dataValidade = { lte: data };
    }

    const [dados, total] = await Promise.all([
      this.prisma.lote.findMany({
        where,
        skip,
        take: limite,
        orderBy: { dataValidade: 'asc' },
        include: {
          medicamento: { select: { dcb: true, nomeComercial: true, formaFarmaceutica: true } },
          estoque: {
            include: { unidade: { select: { nome: true } } },
          },
          _count: { select: { movimentacoes: true, dispensacoes: true } },
        },
      }),
      this.prisma.lote.count({ where }),
    ]);

    return { dados, total, pagina, limite };
  }

  async buscarPorId(id: string) {
    const lote = await this.prisma.lote.findUnique({
      where: { id },
      include: {
        medicamento: true,
        estoque: { include: { unidade: true } },
        movimentacoes: {
          include: {
            usuario: { select: { nome: true, role: true } },
            origem: { select: { nome: true } },
            destino: { select: { nome: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        dispensacoes: {
          orderBy: { dataDispensacao: 'desc' },
          take: 10,
        },
        temperaturas: {
          orderBy: { timestamp: 'desc' },
          take: 50,
        },
        eventosBlockchain: {
          include: { bloco: true },
          orderBy: { timestamp: 'asc' },
        },
      },
    });
    if (!lote) throw new NotFoundException('Lote não encontrado');
    return lote;
  }

  async buscarPorHash(hash: string) {
    const lote = await this.prisma.lote.findFirst({
      where: {
        OR: [
          { hashCriptografico: hash },
          { qrCodeHash: hash },
          { identificadorUnico: hash },
        ],
      },
      include: {
        medicamento: true,
        estoque: { include: { unidade: { select: { nome: true, municipio: true } } } },
        movimentacoes: {
          orderBy: { createdAt: 'asc' },
          include: {
            origem: { select: { nome: true } },
            destino: { select: { nome: true } },
          },
        },
        eventosBlockchain: { orderBy: { timestamp: 'asc' } },
      },
    });
    if (!lote) throw new NotFoundException('Lote não encontrado');
    return lote;
  }

  async atualizarStatus(id: string, status: string, usuarioId: string) {
    await this.buscarPorId(id);
    const lote = await this.prisma.lote.update({
      where: { id },
      data: { statusSanitario: status as any },
    });

    await this.blockchain.adicionarBloco(
      { loteId: id, statusAnterior: lote.statusSanitario, novoStatus: status },
      'BLOQUEIO',
      id,
      'Lote',
      usuarioId,
    );

    return lote;
  }

  async proximosVencimentos(dias = 30) {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + dias);

    return this.prisma.lote.findMany({
      where: {
        statusSanitario: 'ATIVO',
        dataValidade: { lte: dataLimite, gte: new Date() },
      },
      include: {
        medicamento: { select: { dcb: true, nomeComercial: true } },
        estoque: { include: { unidade: { select: { nome: true } } } },
      },
      orderBy: { dataValidade: 'asc' },
    });
  }
}
