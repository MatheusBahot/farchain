import {
  Controller, Get, Post, Patch, Body, Param,
  Query, UseGuards, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { FarmacovigilanciaService } from './farmacovigilancia.service';
import { CreateFarmacovigilanciaDto } from './dto/create-fv.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('farmacovigilancia')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'farmacovigilancia', version: '1' })
export class FarmacovigilanciaController {
  constructor(private readonly fvService: FarmacovigilanciaService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar evento de farmacovigilância' })
  registrar(
    @Body() dto: CreateFarmacovigilanciaDto,
    @CurrentUser('id') usuarioId: string,
  ) {
    return this.fvService.registrar(dto, usuarioId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar eventos de farmacovigilância' })
  listar(
    @Query('pagina', new DefaultValuePipe(1), ParseIntPipe) pagina: number,
    @Query('limite', new DefaultValuePipe(20), ParseIntPipe) limite: number,
    @Query('loteId') loteId?: string,
    @Query('status') status?: string,
    @Query('gravidade') gravidade?: string,
  ) {
    return this.fvService.listar(pagina, limite, { loteId, status, gravidade });
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Estatísticas de farmacovigilância' })
  estatisticas() {
    return this.fvService.estatisticas();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do evento' })
  atualizarStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('resolucao') resolucao?: string,
  ) {
    return this.fvService.atualizarStatus(id, status, resolucao);
  }
}
