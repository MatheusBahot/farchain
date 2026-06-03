import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CreateFarmacovigilanciaDto } from './dto/create-fv.dto';

@Injectable()
export class FarmacovigilanciaService {
  constructor(
    private prisma: PrismaService,
    private blockchain: BlockchainService,
  ) {}

  async registrar(dto: CreateFarmacovigilanciaDto, usuarioId: string) {
    const lote = await this.prisma.lote.findUnique({ where: { id: dto.loteId } });
    if (!lote) throw new NotFoundException('Lote não encontrado');

    const evento = await this.prisma.farmacoVigilancia.create({
      data: {
        loteId: dto.loteId,
        usuarioId,
        tipoEvento: dto.tipoEvento,
        descricao: dto.descricao,
        gravidade: dto.gravidade,
        dataOcorrencia: new Date(dto.dataOcorrencia),
        acaoTomada: dto.acaoTomada,
        notificacaoRef: dto.notificacaoRef,
      },
      include: {
        lote: { include: { medicamento: { select: { dcb: true, nomeComercial: true } } } },
        usuario: { select: { nome: true, crfNumero: true } },
      },
    });

    await this.blockchain.adicionarBloco(
      {
        farmacovigilanciaId: evento.id,
        loteId: dto.loteId,
        tipoEvento: dto.tipoEvento,
        gravidade: dto.gravidade,
      },
      'FARMACOVIGILANCIA',
      evento.id,
      'FarmacoVigilancia',
      usuarioId,
    );

    return evento;
  }

  async listar(pagina = 1, limite = 20, filtros?: any) {
    const skip = (pagina - 1) * limite;
    const where: any = {};
    if (filtros?.loteId) where.loteId = filtros.loteId;
    if (filtros?.status) where.status = filtros.status;
    if (filtros?.gravidade) where.gravidade = filtros.gravidade;

    const [dados, total] = await Promise.all([
      this.prisma.farmacoVigilancia.findMany({
        where,
        skip,
        take: limite,
        orderBy: { dataCadastro: 'desc' },
        include: {
          lote: { include: { medicamento: { select: { dcb: true } } } },
          usuario: { select: { nome: true } },
        },
      }),
      this.prisma.farmacoVigilancia.count({ where }),
    ]);

    return { dados, total, pagina, limite };
  }

  async atualizarStatus(id: string, status: string, resolucao?: string) {
    return this.prisma.farmacoVigilancia.update({
      where: { id },
      data: { status: status as any, resolucao },
    });
  }

  async estatisticas() {
    const [total, abertos, porGravidade, porTipo] = await Promise.all([
      this.prisma.farmacoVigilancia.count(),
      this.prisma.farmacoVigilancia.count({ where: { status: 'ABERTO' } }),
      this.prisma.farmacoVigilancia.groupBy({
        by: ['gravidade'],
        _count: true,
      }),
      this.prisma.farmacoVigilancia.groupBy({
        by: ['tipoEvento'],
        _count: true,
      }),
    ]);
    return { total, abertos, porGravidade, porTipo };
  }
}
