import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';

@Injectable()
export class MovimentacoesService {
  constructor(
    private prisma: PrismaService,
    private blockchain: BlockchainService,
  ) {}

  async criar(dto: CreateMovimentacaoDto, usuarioId: string, ip?: string) {
    const lote = await this.prisma.lote.findUnique({ where: { id: dto.loteId } });
    if (!lote) throw new NotFoundException('Lote não encontrado');
    if (lote.statusSanitario !== 'ATIVO') {
      throw new BadRequestException(`Lote com status ${lote.statusSanitario} não pode ser movimentado`);
    }

    // Verificar estoque disponível na origem
    if (dto.origemId) {
      const estoque = await this.prisma.estoqueLote.findUnique({
        where: { loteId_unidadeId: { loteId: dto.loteId, unidadeId: dto.origemId } },
      });
      if (!estoque || estoque.quantidade < dto.quantidade) {
        throw new BadRequestException('Quantidade insuficiente em estoque na unidade de origem');
      }

      // Debitar da origem
      await this.prisma.estoqueLote.update({
        where: { loteId_unidadeId: { loteId: dto.loteId, unidadeId: dto.origemId } },
        data: { quantidade: { decrement: dto.quantidade } },
      });
    }

    // Creditar no destino
    if (dto.destinoId) {
      await this.prisma.estoqueLote.upsert({
        where: { loteId_unidadeId: { loteId: dto.loteId, unidadeId: dto.destinoId } },
        update: { quantidade: { increment: dto.quantidade } },
        create: { loteId: dto.loteId, unidadeId: dto.destinoId, quantidade: dto.quantidade },
      });
    }

    const movimentacao = await this.prisma.movimentacao.create({
      data: {
        loteId: dto.loteId,
        tipo: dto.tipo,
        quantidade: dto.quantidade,
        origemId: dto.origemId,
        destinoId: dto.destinoId,
        usuarioId,
        justificativa: dto.justificativa,
        documentoRef: dto.documentoRef,
        ip: ip || null,
      },
      include: {
        lote: { include: { medicamento: { select: { dcb: true } } } },
        origem: { select: { nome: true } },
        destino: { select: { nome: true } },
        usuario: { select: { nome: true, role: true } },
      },
    });

    // Blockchain
    const hashBloco = await this.blockchain.adicionarBloco(
      {
        tipo: dto.tipo,
        loteId: dto.loteId,
        quantidade: dto.quantidade,
        origemId: dto.origemId,
        destinoId: dto.destinoId,
        usuarioId,
      },
      'MOVIMENTACAO',
      movimentacao.id,
      'Movimentacao',
      usuarioId,
    );

    return { ...movimentacao, hashBloco };
  }

  async listar(pagina = 1, limite = 20, filtros?: any) {
    const skip = (pagina - 1) * limite;
    const where: any = {};
    if (filtros?.loteId) where.loteId = filtros.loteId;
    if (filtros?.tipo) where.tipo = filtros.tipo;
    if (filtros?.unidadeId) {
      where.OR = [{ origemId: filtros.unidadeId }, { destinoId: filtros.unidadeId }];
    }

    const [dados, total] = await Promise.all([
      this.prisma.movimentacao.findMany({
        where,
        skip,
        take: limite,
        orderBy: { createdAt: 'desc' },
        include: {
          lote: { include: { medicamento: { select: { dcb: true, nomeComercial: true } } } },
          origem: { select: { nome: true } },
          destino: { select: { nome: true } },
          usuario: { select: { nome: true } },
        },
      }),
      this.prisma.movimentacao.count({ where }),
    ]);

    return { dados, total, pagina, limite };
  }
}
