import { Controller, Get, Post, Param, UseGuards, SetMetadata } from '@nestjs/common';
import { QrCodeService } from './qrcode.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

const Public = () => SetMetadata('isPublic', true);

@ApiTags('qrcode')
@Controller({ path: 'qrcode', version: '1' })
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Post('lote/:loteId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Gerar QR Code para lote' })
  gerarQrCode(@Param('loteId') loteId: string) {
    return this.qrCodeService.gerarQrCodeLote(loteId);
  }

  @Public()
  @Get('consultar/:hash')
  @ApiOperation({ summary: 'Consulta pública por hash do QR Code' })
  consultar(@Param('hash') hash: string) {
    return this.qrCodeService.consultarPorHash(hash);
  }
}
