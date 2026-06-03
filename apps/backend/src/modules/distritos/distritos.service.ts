import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DistritosService {
  constructor(private prisma: PrismaService) {}

  async listar() {
    return this.prisma.distritoSanitario.findMany({
      include: {
        _count: { select: { unidades: true } },
        unidades: { select: { id: true, nome: true, tipo: true, ehCAF: true } },
      },
      orderBy: { codigo: 'asc' },
    });
  }

  async criar(data: any) {
    return this.prisma.distritoSanitario.create({ data });
  }
}
