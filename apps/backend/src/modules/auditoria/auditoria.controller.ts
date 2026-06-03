import { Controller, Get, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('auditoria')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.AUDITOR)
@Controller({ path: 'auditoria', version: '1' })
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get()
  listar(
    @Query('pagina', new DefaultValuePipe(1), ParseIntPipe) pagina: number,
    @Query('limite', new DefaultValuePipe(50), ParseIntPipe) limite: number,
    @Query('usuarioId') usuarioId?: string,
    @Query('acao') acao?: string,
    @Query('entidade') entidade?: string,
  ) {
    return this.auditoriaService.listar(pagina, limite, { usuarioId, acao, entidade });
  }
}
