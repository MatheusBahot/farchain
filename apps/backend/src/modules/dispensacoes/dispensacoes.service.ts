import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CreateDispensacaoDto } from './dto/create-dispensacao.dto';
import * as crypto from 'crypto';

@Injectable()
export class DispensacoesService {
  constructor(
    private prisma: PrismaService,
    private blockchain: BlockchainService,
  ) {}

  private hashDado(valor: string): string {
    return crypto.createHash('sha256').update(valor.replace(/\D/g, '')).digest('hex');
  }

  async dispensar(dto: CreateDispensacaoDto, usuarioId: string) {
    // Verificar lote
    const lote = await this.prisma.lote.findUnique({ where: { id: dto.loteId } });
    if (!lote || lote.statusSanitario !== 'ATIVO') {
      throw new BadRequestException('Lote indisponível para dispensação');
    }

    // Verificar data de validade
    if (lote.dataValidade < new Date()) {
      throw new BadRequestException('Lote vencido. Não é possível dispensar.');
    }

    // Verificar estoque
    const estoque = await this.prisma.estoqueLote.findUnique({
      where: { loteId_unidadeId: { loteId: dto.loteId, unidadeId: dto.unidadeId } },
    });
    if (!estoque || estoque.quantidade < dto.quantidade) {
      throw new BadRequestException('Quantidade insuficiente em estoque');
    }

    // Anonimizar dados do paciente (LGPD)
    const cpfHash = this.hashDado(dto.cpfPaciente);
    const cartaoSusHash = dto.cartaoSusPaciente
      ? this.hashDado(dto.cartaoSusPaciente)
      : undefined;

    // Upsert do paciente (identificação anônima)
    const paciente = await this.prisma.paciente.upsert({
      where: { cpfHash },
      update: {},
      create: { cpfHash, cartaoSusHash },
    });

    // Debitar estoque
    await this.prisma.estoqueLote.update({
      where: { loteId_unidadeId: { loteId: dto.loteId, unidadeId: dto.unidadeId } },
      data: { quantidade: { decrement: dto.quantidade } },
    });

    // Criar dispensação
    const dispensacao = await this.prisma.dispensacao.create({
      data: {
        loteId: dto.loteId,
        medicamentoId: dto.medicamentoId,
        pacienteId: paciente.id,
        unidadeId: dto.unidadeId,
        usuarioId,
        quantidade: dto.quantidade,
        dosagem: dto.dosagem,
        duracaoTratamento: dto.duracaoTratamento,
        cid10: dto.cid10,
        prescricaoRef: dto.prescricaoRef,
        observacoes: dto.observacoes,
      },
      include: {
        medicamento: { select: { dcb: true } },
        unidade: { select: { nome: true } },
        usuario: { select: { nome: true } },
      },
    });

    // Blockchain
    await this.blockchain.adicionarBloco(
      {
        dispensacaoId: dispensacao.id,
        loteId: dto.loteId,
        medicamentoId: dto.medicamentoId,
        pacienteHash: cpfHash,
        unidadeId: dto.unidadeId,
        quantidade: dto.quantidade,
      },
      'DISPENSACAO',
      dispensacao.id,
      'Dispensacao',
      usuarioId,
    );

    return dispensacao;
  }

  async listar(pagina = 1, limite = 20, filtros?: any) {
    const skip = (pagina - 1) * limite;
    const where: any = {};
    if (filtros?.unidadeId) where.unidadeId = filtros.unidadeId;
    if (filtros?.medicamentoId) where.medicamentoId = filtros.medicamentoId;

    const [dados, total] = await Promise.all([
      this.prisma.dispensacao.findMany({
        where,
        skip,
        take: limite,
        orderBy: { dataDispensacao: 'desc' },
        include: {
          medicamento: { select: { dcb: true, nomeComercial: true } },
          unidade: { select: { nome: true } },
          usuario: { select: { nome: true } },
          lote: { select: { numeroLote: true } },
        },
      }),
      this.prisma.dispensacao.count({ where }),
    ]);

    return { dados, total, pagina, limite };
  }

  async estatisticas() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const [total, hoje30dias, porMedicamento] = await Promise.all([
      this.prisma.dispensacao.count(),
      this.prisma.dispensacao.count({
        where: { dataDispensacao: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      }),
      this.prisma.dispensacao.groupBy({
        by: ['medicamentoId'],
        _count: { _all: true },
        _sum: { quantidade: true },
        orderBy: { _count: { medicamentoId: 'desc' } },
        take: 10,
      }),
    ]);

    return { total, ultimos30dias: hoje30dias, topMedicamentos: porMedicamento };
  }
}
