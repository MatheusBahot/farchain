import {
  Controller, Get, Post, Put, Delete, Body,
  Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { MedicamentosService } from './medicamentos.service';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('medicamentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'medicamentos', version: '1' })
export class MedicamentosController {
  constructor(private readonly medicamentosService: MedicamentosService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.FARMACEUTICO)
  @ApiOperation({ summary: 'Cadastrar medicamento CEAF' })
  criar(@Body() dto: CreateMedicamentoDto) {
    return this.medicamentosService.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar medicamentos' })
  listar(
    @Query('pagina', new DefaultValuePipe(1), ParseIntPipe) pagina: number,
    @Query('limite', new DefaultValuePipe(20), ParseIntPipe) limite: number,
    @Query('busca') busca?: string,
    @Query('classeCEAF') classeCEAF?: string,
  ) {
    return this.medicamentosService.listar(pagina, limite, busca, classeCEAF);
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Estatísticas dos medicamentos' })
  estatisticas() {
    return this.medicamentosService.estatisticas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de um medicamento' })
  buscarPorId(@Param('id') id: string) {
    return this.medicamentosService.buscarPorId(id);
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.FARMACEUTICO)
  @ApiOperation({ summary: 'Atualizar medicamento' })
  atualizar(@Param('id') id: string, @Body() dto: UpdateMedicamentoDto) {
    return this.medicamentosService.atualizar(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Desativar medicamento' })
  desativar(@Param('id') id: string) {
    return this.medicamentosService.desativar(id);
  }
}
