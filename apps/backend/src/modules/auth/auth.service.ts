import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async validarCredenciais(email: string, senha: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email, ativo: true },
    });

    if (!usuario) return null;

    const senhaValida = await argon2.verify(usuario.senhaHash, senha);
    if (!senhaValida) return null;

    return usuario;
  }

  async login(usuario: any, ip?: string) {
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      role: usuario.role,
      unidadeId: usuario.unidadeId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('app.jwt.secret'),
        expiresIn: this.config.get('app.jwt.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('app.jwt.refreshSecret'),
        expiresIn: this.config.get('app.jwt.refreshExpiresIn'),
      }),
    ]);

    // Salvar hash do refresh token
    const refreshTokenHash = await argon2.hash(refreshToken);
    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        refreshTokenHash,
        ultimoLogin: new Date(),
      },
    });

    // Log de auditoria
    await this.prisma.auditLog.create({
      data: {
        usuarioId: usuario.id,
        acao: 'LOGIN',
        entidade: 'Usuario',
        entidadeId: usuario.id,
        ip: ip || null,
      },
    });

    this.logger.log(`Login: ${usuario.email} [${usuario.role}]`);

    return {
      accessToken,
      refreshToken,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        unidadeId: usuario.unidadeId,
        avatarUrl: usuario.avatarUrl,
      },
    };
  }

  async refreshTokens(usuarioId: string, refreshToken: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario || !usuario.refreshTokenHash) {
      throw new UnauthorizedException('Acesso negado');
    }

    const tokenValido = await argon2.verify(usuario.refreshTokenHash, refreshToken);
    if (!tokenValido) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    return this.login(usuario);
  }

  async logout(usuarioId: string) {
    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { refreshTokenHash: null },
    });

    await this.prisma.auditLog.create({
      data: {
        usuarioId,
        acao: 'LOGOUT',
        entidade: 'Usuario',
        entidadeId: usuarioId,
      },
    });
  }

  async criarSenhaHash(senha: string): Promise<string> {
    return argon2.hash(senha, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
  }

  async perfil(usuarioId: string) {
    return this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        role: true,
        ativo: true,
        mfaAtivo: true,
        avatarUrl: true,
        telefone: true,
        crfNumero: true,
        ultimoLogin: true,
        createdAt: true,
        unidade: {
          select: { id: true, nome: true, tipo: true, municipio: true },
        },
      },
    });
  }
}
