import {
  Controller, Get, Post, Put, Patch, Body,
  Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'usuarios', version: '1' })
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Criar novo usuário' })
  criar(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.criar(dto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.AUDITOR)
  @ApiOperation({ summary: 'Listar usuários' })
  listar(
    @Query('pagina', new DefaultValuePipe(1), ParseIntPipe) pagina: number,
    @Query('limite', new DefaultValuePipe(20), ParseIntPipe) limite: number,
    @Query('busca') busca?: string,
  ) {
    return this.usuariosService.listar(pagina, limite, busca);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  buscarPorId(@Param('id') id: string) {
    return this.usuariosService.buscarPorId(id);
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar usuário' })
  atualizar(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    return this.usuariosService.atualizar(id, dto);
  }

  @Patch(':id/status')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Ativar/desativar usuário' })
  alterarStatus(
    @Param('id') id: string,
    @Body('ativo') ativo: boolean,
  ) {
    return this.usuariosService.alterarStatus(id, ativo);
  }
}
