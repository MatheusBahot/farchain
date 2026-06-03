import {
  Injectable, NotFoundException, ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async criar(dto: CreateUsuarioDto) {
    const existe = await this.prisma.usuario.findFirst({
      where: { OR: [{ email: dto.email }, { cpf: dto.cpf }] },
    });
    if (existe) throw new ConflictException('E-mail ou CPF já cadastrado');

    const senhaHash = await this.authService.criarSenhaHash(dto.senha);

    return this.prisma.usuario.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        cpf: dto.cpf,
        senhaHash,
        role: dto.role,
        unidadeId: dto.unidadeId,
        telefone: dto.telefone,
        crfNumero: dto.crfNumero,
      },
      select: {
        id: true, nome: true, email: true, role: true,
        unidadeId: true, ativo: true, createdAt: true,
      },
    });
  }

  async listar(pagina = 1, limite = 20, busca?: string) {
    const skip = (pagina - 1) * limite;
    const where = busca
      ? { OR: [
          { nome: { contains: busca, mode: 'insensitive' as any } },
          { email: { contains: busca, mode: 'insensitive' as any } },
        ]}
      : {};

    const [dados, total] = await Promise.all([
      this.prisma.usuario.findMany({
        where,
        skip,
        take: limite,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, nome: true, email: true, role: true,
          ativo: true, ultimoLogin: true, createdAt: true,
          unidade: { select: { nome: true } },
        },
      }),
      this.prisma.usuario.count({ where }),
    ]);

    return { dados, total, pagina, limite };
  }

  async buscarPorId(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true, nome: true, email: true, role: true,
        ativo: true, mfaAtivo: true, telefone: true,
        crfNumero: true, ultimoLogin: true, createdAt: true,
        unidade: { select: { id: true, nome: true, tipo: true } },
      },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    return usuario;
  }

  async atualizar(id: string, dto: UpdateUsuarioDto) {
    await this.buscarPorId(id);
    return this.prisma.usuario.update({
      where: { id },
      data: dto,
      select: {
        id: true, nome: true, email: true, role: true,
        ativo: true, updatedAt: true,
      },
    });
  }

  async alterarStatus(id: string, ativo: boolean) {
    await this.buscarPorId(id);
    return this.prisma.usuario.update({
      where: { id },
      data: { ativo },
      select: { id: true, nome: true, ativo: true },
    });
  }
}
