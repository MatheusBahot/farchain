import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TccService } from './tcc.service';

@Controller('tcc')
export class TccController {
  constructor(private readonly service: TccService) {}

  @Post('medicamento-lote')
  registrarMedicamentoLote(@Body() body: any) {
    return this.service.registrarMedicamentoLote(body);
  }

  @Get('medicamentos-lotes')
  listarMedicamentosLotes() {
    return this.service.listarMedicamentosLotes();
  }

  @Get('blockchain')
  listarBlockchain() {
    return this.service.listarBlockchain();
  }

  @Post('dispensacao')
  registrarDispensacao(@Body() body: any) {
    return this.service.registrarDispensacao(body);
  }

  @Get('dispensacoes')
  listarDispensacoes() {
    return this.service.listarDispensacoes();
  }

  @Get('trace/:lote')
  rastrearPorLote(@Param('lote') lote: string) {
    return this.service.rastrearPorLote(lote);
  }

  @Delete('reset')
  resetarDemo() {
    return this.service.resetarDemo();
  }
}
