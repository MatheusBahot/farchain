import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class QrCodeService {
  private readonly logger = new Logger(QrCodeService.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  private gerarHashPublico(loteId: string, salt: string): string {
    return crypto.createHash('sha256')
      .update(`${loteId}:${salt}:farchain`)
      .digest('hex')
      .substring(0, 32);
  }

  async gerarQrCodeLote(loteId: string): Promise<{
    qrCodeUrl: string;
    qrCodeHash: string;
    qrCodeBase64: string;
    urlPublica: string;
  }> {
    const lote = await this.prisma.lote.findUnique({ where: { id: loteId } });
    if (!lote) throw new Error('Lote não encontrado');

    const salt = crypto.randomBytes(16).toString('hex');
    const qrCodeHash = this.gerarHashPublico(loteId, salt);
    const baseUrl = this.config.get<string>('app.qrCode.baseUrl');
    const urlPublica = `${baseUrl}/${qrCodeHash}`;

    // Gerar imagem QR Code em base64
    const qrCodeBase64 = await QRCode.toDataURL(urlPublica, {
      errorCorrectionLevel: 'H',
      margin: 2,
      color: { dark: '#1e293b', light: '#ffffff' },
      width: 400,
    });

    // Salvar no banco
    await this.prisma.lote.update({
      where: { id: loteId },
      data: {
        qrCodeUrl: qrCodeBase64,
        qrCodeHash,
      },
    });

    this.logger.log(`QR Code gerado para lote ${loteId}: ${qrCodeHash}`);

    return {
      qrCodeUrl: qrCodeBase64,
      qrCodeHash,
      qrCodeBase64,
      urlPublica,
    };
  }

  async consultarPorHash(hash: string) {
    const lote = await this.prisma.lote.findFirst({
      where: {
        OR: [{ qrCodeHash: hash }, { hashCriptografico: hash }],
      },
      include: {
        medicamento: {
          select: {
            dcb: true,
            nomeComercial: true,
            principioAtivo: true,
            fabricante: true,
            formaFarmaceutica: true,
            concentracao: true,
            classeCEAF: true,
            classeTerapeutica: true,
            requireCadeiaFria: true,
          },
        },
        estoque: {
          include: {
            unidade: {
              select: { nome: true, tipo: true, municipio: true, uf: true },
            },
          },
        },
        movimentacoes: {
          orderBy: { createdAt: 'asc' },
          select: {
            tipo: true,
            quantidade: true,
            createdAt: true,
            origem: { select: { nome: true } },
            destino: { select: { nome: true } },
          },
        },
        eventosBlockchain: {
          orderBy: { timestamp: 'asc' },
          select: {
            tipoEvento: true,
            timestamp: true,
            hashDados: true,
            bloco: { select: { hashAtual: true, indice: true } },
          },
        },
      },
    });

    if (!lote) return null;

    const agora = new Date();
    const diasParaVencer = Math.ceil(
      (lote.dataValidade.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24),
    );

    let statusConsulta: string;
    if (lote.statusSanitario !== 'ATIVO') {
      statusConsulta = lote.statusSanitario;
    } else if (lote.dataValidade < agora) {
      statusConsulta = 'VENCIDO';
    } else if (diasParaVencer <= 30) {
      statusConsulta = 'VALIDADE_PROXIMA';
    } else {
      statusConsulta = 'INTEGRO';
    }

    // Remover dados sensíveis — retornar apenas dados públicos
    return {
      statusConsulta,
      diasParaVencer,
      lote: {
        identificadorUnico: lote.identificadorUnico,
        numeroLote: lote.numeroLote,
        fabricante: lote.fabricante,
        dataFabricacao: lote.dataFabricacao,
        dataValidade: lote.dataValidade,
        statusSanitario: lote.statusSanitario,
        hashCriptografico: lote.hashCriptografico,
      },
      medicamento: lote.medicamento,
      localizacaoAtual: lote.estoque.map((e) => ({
        unidade: e.unidade.nome,
        tipo: e.unidade.tipo,
        municipio: e.unidade.municipio,
        quantidade: e.quantidade,
      })),
      historico: lote.movimentacoes.map((m) => ({
        tipo: m.tipo,
        data: m.createdAt,
        origem: m.origem?.nome,
        destino: m.destino?.nome,
      })),
      blockchain: {
        totalEventos: lote.eventosBlockchain.length,
        ultimoHash: lote.eventosBlockchain.at(-1)?.bloco?.hashAtual,
        ultimoEvento: lote.eventosBlockchain.at(-1)?.tipoEvento,
      },
    };
  }
}
