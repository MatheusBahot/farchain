import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async resumoGeral() {
    const agora = new Date();
    const trinta = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dataVenc30 = new Date(agora.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [
      totalMedicamentos,
      totalLotes,
      lotesAtivos,
      lotesVencendo,
      totalBlockchain,
      totalDispensacoes,
      dispLast30,
      totalFarmacovig,
      fvAbertos,
      totalUnidades,
      estoqueBaixo,
    ] = await Promise.all([
      this.prisma.medicamento.count({ where: { ativo: true } }),
      this.prisma.lote.count(),
      this.prisma.lote.count({ where: { statusSanitario: 'ATIVO' } }),
      this.prisma.lote.count({
        where: {
          statusSanitario: 'ATIVO',
          dataValidade: { gte: agora, lte: dataVenc30 },
        },
      }),
      this.prisma.blocoBlockchain.count(),
      this.prisma.dispensacao.count(),
      this.prisma.dispensacao.count({ where: { dataDispensacao: { gte: trinta } } }),
      this.prisma.farmacoVigilancia.count(),
      this.prisma.farmacoVigilancia.count({ where: { status: 'ABERTO' } }),
      this.prisma.unidadeSaude.count({ where: { ativo: true } }),
      this.prisma.estoqueLote.count({ where: { quantidade: { lte: 10 } } }),
    ]);

    return {
      medicamentos: { total: totalMedicamentos },
      lotes: { total: totalLotes, ativos: lotesAtivos, vencendo30Dias: lotesVencendo },
      blockchain: { totalBlocos: totalBlockchain },
      dispensacoes: { total: totalDispensacoes, ultimos30Dias: dispLast30 },
      farmacovigilancia: { total: totalFarmacovig, abertos: fvAbertos },
      unidades: { total: totalUnidades },
      alertas: { estoqueBaixo },
    };
  }

  async dispensacoesPorMes() {
    const resultado = await this.prisma.$queryRaw<any[]>`
      SELECT
        TO_CHAR(data_dispensacao, 'YYYY-MM') as mes,
        COUNT(*) as total,
        SUM(quantidade) as quantidade
      FROM dispensacoes
      WHERE data_dispensacao >= NOW() - INTERVAL '12 months'
      GROUP BY mes
      ORDER BY mes ASC
    `;
    return resultado;
  }

  async topMedicamentosDispensados() {
    const resultado = await this.prisma.$queryRaw<any[]>`
      SELECT
        m.dcb,
        m.nome_comercial,
        COUNT(d.id) as dispensacoes,
        SUM(d.quantidade) as quantidade_total
      FROM dispensacoes d
      JOIN medicamentos m ON d.medicamento_id = m.id
      GROUP BY m.id, m.dcb, m.nome_comercial
      ORDER BY dispensacoes DESC
      LIMIT 10
    `;
    return resultado;
  }

  async estoquePorUnidade() {
    return this.prisma.estoqueLote.groupBy({
      by: ['unidadeId'],
      _sum: { quantidade: true },
      _count: true,
    });
  }

  async alertasAtivos() {
    const agora = new Date();
    const trinta = new Date(agora.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [vencendo, fvAbertos, estoqueZero] = await Promise.all([
      this.prisma.lote.findMany({
        where: {
          statusSanitario: 'ATIVO',
          dataValidade: { gte: agora, lte: trinta },
        },
        include: { medicamento: { select: { dcb: true } } },
        orderBy: { dataValidade: 'asc' },
        take: 10,
      }),
      this.prisma.farmacoVigilancia.findMany({
        where: { status: 'ABERTO' },
        include: { lote: { include: { medicamento: { select: { dcb: true } } } } },
        orderBy: { dataCadastro: 'desc' },
        take: 10,
      }),
      this.prisma.estoqueLote.findMany({
        where: { quantidade: 0 },
        include: {
          lote: { include: { medicamento: { select: { dcb: true } } } },
          unidade: { select: { nome: true } },
        },
        take: 10,
      }),
    ]);

    return { vencendo, fvAbertos, estoqueZero };
  }
}
