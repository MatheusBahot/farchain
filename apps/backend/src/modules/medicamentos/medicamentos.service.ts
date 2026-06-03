import {
  Injectable, NotFoundException, ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';

@Injectable()
export class MedicamentosService {
  constructor(private prisma: PrismaService) {}

  async criar(dto: CreateMedicamentoDto) {
    if (dto.registroSanitario) {
      const existe = await this.prisma.medicamento.findFirst({
        where: { registroSanitario: dto.registroSanitario },
      });
      if (existe) throw new ConflictException('Registro sanitário já cadastrado');
    }

    return this.prisma.medicamento.create({ data: dto });
  }

  async listar(pagina = 1, limite = 20, busca?: string, classeCEAF?: string) {
    const skip = (pagina - 1) * limite;
    const where: any = { ativo: true };

    if (busca) {
      where.OR = [
        { dcb: { contains: busca, mode: 'insensitive' } },
        { nomeComercial: { contains: busca, mode: 'insensitive' } },
        { principioAtivo: { contains: busca, mode: 'insensitive' } },
      ];
    }

    if (classeCEAF) where.classeCEAF = classeCEAF;

    const [dados, total] = await Promise.all([
      this.prisma.medicamento.findMany({
        where,
        skip,
        take: limite,
        orderBy: { dcb: 'asc' },
        include: {
          _count: { select: { lotes: true } },
        },
      }),
      this.prisma.medicamento.count({ where }),
    ]);

    return { dados, total, pagina, limite, totalPaginas: Math.ceil(total / limite) };
  }

  async buscarPorId(id: string) {
    const med = await this.prisma.medicamento.findUnique({
      where: { id },
      include: {
        lotes: {
          where: { statusSanitario: 'ATIVO' },
          include: {
            estoque: { include: { unidade: { select: { nome: true, tipo: true } } } },
          },
          orderBy: { dataValidade: 'asc' },
        },
        _count: { select: { lotes: true, dispensacoes: true } },
      },
    });
    if (!med) throw new NotFoundException('Medicamento não encontrado');
    return med;
  }

  async atualizar(id: string, dto: UpdateMedicamentoDto) {
    await this.buscarPorId(id);
    return this.prisma.medicamento.update({ where: { id }, data: dto });
  }

  async desativar(id: string) {
    await this.buscarPorId(id);
    return this.prisma.medicamento.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async estatisticas() {
    const [total, cadeiaFria, porClasse] = await Promise.all([
      this.prisma.medicamento.count({ where: { ativo: true } }),
      this.prisma.medicamento.count({ where: { ativo: true, requireCadeiaFria: true } }),
      this.prisma.medicamento.groupBy({
        by: ['classeCEAF'],
        _count: true,
        where: { ativo: true },
      }),
    ]);
    return { total, cadeiaFria, porClasse };
  }
}
