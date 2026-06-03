import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TemperaturaService } from './temperatura.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('temperatura')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'temperatura', version: '1' })
export class TemperaturaController {
  constructor(private readonly temperaturaService: TemperaturaService) {}

  @Post()
  registrar(@Body() data: any) {
    return this.temperaturaService.registrar(data);
  }

  @Get('lote/:loteId')
  historico(@Param('loteId') loteId: string) {
    return this.temperaturaService.historicoPorLote(loteId);
  }
}
