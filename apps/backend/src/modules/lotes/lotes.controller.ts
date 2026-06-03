import {
  Controller, Get, Post, Patch, Body, Param,
  Query, UseGuards, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { LotesService } from './lotes.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { SetMetadata } from '@nestjs/common';

const Public = () => SetMetadata('isPublic', true);

@ApiTags('lotes')
@Controller({ path: 'lotes', version: '1' })
export class LotesController {
  constructor(private readonly lotesService: LotesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.FARMACEUTICO, Role.OPERADOR_CAF)
  @ApiOperation({ summary: 'Registrar novo lote' })
  criar(
    @Body() dto: CreateLoteDto,
    @CurrentUser('id') usuarioId: string,
  ) {
    return this.lotesService.criar(dto, usuarioId);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar lotes' })
  listar(
    @Query('pagina', new DefaultValuePipe(1), ParseIntPipe) pagina: number,
    @Query('limite', new DefaultValuePipe(20), ParseIntPipe) limite: number,
    @Query('medicamentoId') medicamentoId?: string,
    @Query('status') status?: string,
    @Query('vencendoEm') vencendoEm?: string,
  ) {
    return this.lotesService.listar(pagina, limite, { medicamentoId, status, vencendoEm });
  }

  @Get('vencimentos')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lotes próximos ao vencimento' })
  proximosVencimentos(
    @Query('dias', new DefaultValuePipe(30), ParseIntPipe) dias: number,
  ) {
    return this.lotesService.proximosVencimentos(dias);
  }

  @Public()
  @Get('rastreio/:hash')
  @ApiOperation({ summary: 'Consulta pública por hash/QR Code' })
  buscarPorHash(@Param('hash') hash: string) {
    return this.lotesService.buscarPorHash(hash);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Detalhes do lote' })
  buscarPorId(@Param('id') id: string) {
    return this.lotesService.buscarPorId(id);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.FARMACEUTICO)
  @ApiOperation({ summary: 'Atualizar status sanitário do lote' })
  atualizarStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @CurrentUser('id') usuarioId: string,
  ) {
    return this.lotesService.atualizarStatus(id, status, usuarioId);
  }
}
