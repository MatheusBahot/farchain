import {
  Controller, Get, Post, Body, Query, UseGuards,
  ParseIntPipe, DefaultValuePipe, Ip,
} from '@nestjs/common';
import { MovimentacoesService } from './movimentacoes.service';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('movimentacoes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'movimentacoes', version: '1' })
export class MovimentacoesController {
  constructor(private readonly movimentacoesService: MovimentacoesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar movimentação de lote' })
  criar(
    @Body() dto: CreateMovimentacaoDto,
    @CurrentUser('id') usuarioId: string,
    @Ip() ip: string,
  ) {
    return this.movimentacoesService.criar(dto, usuarioId, ip);
  }

  @Get()
  @ApiOperation({ summary: 'Listar movimentações' })
  listar(
    @Query('pagina', new DefaultValuePipe(1), ParseIntPipe) pagina: number,
    @Query('limite', new DefaultValuePipe(20), ParseIntPipe) limite: number,
    @Query('loteId') loteId?: string,
    @Query('tipo') tipo?: string,
    @Query('unidadeId') unidadeId?: string,
  ) {
    return this.movimentacoesService.listar(pagina, limite, { loteId, tipo, unidadeId });
  }
}
