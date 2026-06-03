import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'dashboard', version: '1' })
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('resumo')
  @ApiOperation({ summary: 'Resumo geral da plataforma' })
  resumo() {
    return this.dashboardService.resumoGeral();
  }

  @Get('dispensacoes-por-mes')
  @ApiOperation({ summary: 'Dispensações por mês (12 meses)' })
  dispensacoesMes() {
    return this.dashboardService.dispensacoesPorMes();
  }

  @Get('top-medicamentos')
  @ApiOperation({ summary: 'Top 10 medicamentos mais dispensados' })
  topMedicamentos() {
    return this.dashboardService.topMedicamentosDispensados();
  }

  @Get('estoque-unidades')
  @ApiOperation({ summary: 'Estoque consolidado por unidade' })
  estoquePorUnidade() {
    return this.dashboardService.estoquePorUnidade();
  }

  @Get('alertas')
  @ApiOperation({ summary: 'Alertas ativos do sistema' })
  alertas() {
    return this.dashboardService.alertasAtivos();
  }
}
