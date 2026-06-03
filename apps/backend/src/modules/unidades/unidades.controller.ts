import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UnidadesService } from './unidades.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('unidades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'unidades', version: '1' })
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar unidades de saúde' })
  listar(@Query('busca') busca?: string) {
    return this.unidadesService.listar(busca);
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.unidadesService.buscarPorId(id);
  }

  @Post()
  criar(@Body() data: any) {
    return this.unidadesService.criar(data);
  }

  @Put(':id')
  atualizar(@Param('id') id: string, @Body() data: any) {
    return this.unidadesService.atualizar(id, data);
  }
}
