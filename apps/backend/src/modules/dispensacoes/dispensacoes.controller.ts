import {
  Controller, Get, Post, Body, Query, UseGuards,
  ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { DispensacoesService } from './dispensacoes.service';
import { CreateDispensacaoDto } from './dto/create-dispensacao.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('dispensacoes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'dispensacoes', version: '1' })
export class DispensacoesController {
  constructor(private readonly dispensacoesService: DispensacoesService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.FARMACEUTICO, Role.OPERADOR_CAF)
  @ApiOperation({ summary: 'Registrar dispensação ao paciente' })
  dispensar(
    @Body() dto: CreateDispensacaoDto,
    @CurrentUser('id') usuarioId: string,
  ) {
    return this.dispensacoesService.dispensar(dto, usuarioId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar dispensações' })
  listar(
    @Query('pagina', new DefaultValuePipe(1), ParseIntPipe) pagina: number,
    @Query('limite', new DefaultValuePipe(20), ParseIntPipe) limite: number,
    @Query('unidadeId') unidadeId?: string,
    @Query('medicamentoId') medicamentoId?: string,
  ) {
    return this.dispensacoesService.listar(pagina, limite, { unidadeId, medicamentoId });
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Estatísticas de dispensação' })
  estatisticas() {
    return this.dispensacoesService.estatisticas();
  }
}
