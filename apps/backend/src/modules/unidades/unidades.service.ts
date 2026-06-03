import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UnidadesService {
  constructor(private prisma: PrismaService) {}

  async listar(busca?: string) {
    const where: any = { ativo: true };
    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { municipio: { contains: busca, mode: 'insensitive' } },
      ];
    }
    return this.prisma.unidadeSaude.findMany({
      where,
      include: {
        distrito: { select: { nome: true } },
        _count: { select: { usuarios: true } },
      },
      orderBy: { nome: 'asc' },
    });
  }

  async buscarPorId(id: string) {
    const u = await this.prisma.unidadeSaude.findUnique({
      where: { id },
      include: {
        distrito: true,
        usuarios: { select: { id: true, nome: true, role: true } },
        estoque: {
          include: {
            lote: { include: { medicamento: { select: { dcb: true } } } },
          },
        },
      },
    });
    if (!u) throw new NotFoundException('Unidade não encontrada');
    return u;
  }

  async criar(data: any) {
    return this.prisma.unidadeSaude.create({ data });
  }

  async atualizar(id: string, data: any) {
    return this.prisma.unidadeSaude.update({ where: { id }, data });
  }
}
