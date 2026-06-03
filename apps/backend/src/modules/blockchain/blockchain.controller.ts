import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('blockchain')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'blockchain', version: '1' })
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('blocos')
  @ApiOperation({ summary: 'Listar blocos do ledger' })
  async listarBlocos(
    @Query('pagina') pagina = 1,
    @Query('limite') limite = 10,
  ) {
    return this.blockchainService.obterBlocos(+pagina, +limite);
  }

  @Get('validar')
  @ApiOperation({ summary: 'Validar integridade da cadeia' })
  async validarCadeia() {
    return this.blockchainService.validarCadeia();
  }

  @Get('lote/:loteId')
  @ApiOperation({ summary: 'Histórico blockchain de um lote' })
  async historicoLote(@Param('loteId') loteId: string) {
    return this.blockchainService.obterHistoricoLote(loteId);
  }
}
