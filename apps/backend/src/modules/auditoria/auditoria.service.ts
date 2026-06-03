import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AuditoriaService {
  constructor(private prisma: PrismaService) {}

  async listar(pagina = 1, limite = 50, filtros?: any) {
    const skip = (pagina - 1) * limite;
    const where: any = {};
    if (filtros?.usuarioId) where.usuarioId = filtros.usuarioId;
    if (filtros?.acao) where.acao = { contains: filtros.acao, mode: 'insensitive' };
    if (filtros?.entidade) where.entidade = filtros.entidade;

    const [dados, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limite,
        orderBy: { timestamp: 'desc' },
        include: {
          usuario: { select: { nome: true, email: true, role: true } },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { dados, total, pagina, limite };
  }
}
