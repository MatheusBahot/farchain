import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class TemperaturaService {
  constructor(
    private prisma: PrismaService,
    private blockchain: BlockchainService,
  ) {}

  async registrar(data: {
    loteId: string;
    temperatura: number;
    umidade?: number;
    sensor?: string;
    localizacao?: string;
  }) {
    const lote = await this.prisma.lote.findUnique({
      where: { id: data.loteId },
      include: { medicamento: true },
    });
    if (!lote) throw new Error('Lote não encontrado');

    const conformidade =
      !lote.medicamento.requireCadeiaFria ||
      (lote.medicamento.temperaturaMin !== null &&
        lote.medicamento.temperaturaMax !== null &&
        data.temperatura >= lote.medicamento.temperaturaMin! &&
        data.temperatura <= lote.medicamento.temperaturaMax!);

    const registro = await this.prisma.registroTemperatura.create({
      data: {
        loteId: data.loteId,
        temperatura: data.temperatura,
        umidade: data.umidade,
        sensor: data.sensor,
        localizacao: data.localizacao,
        conformidade,
        alertaGerado: !conformidade,
      },
    });

    // Registrar na blockchain se houver desconformidade
    if (!conformidade) {
      await this.blockchain.adicionarBloco(
        {
          loteId: data.loteId,
          temperatura: data.temperatura,
          conformidade: false,
          medicamento: lote.medicamento.dcb,
          faixaPermitida: {
            min: lote.medicamento.temperaturaMin,
            max: lote.medicamento.temperaturaMax,
          },
        },
        'TEMPERATURA_ALERTA',
        data.loteId,
        'Lote',
      );

      await this.prisma.alerta.create({
        data: {
          tipo: 'TEMPERATURA_FORA_FAIXA',
          mensagem: `Temperatura ${data.temperatura}°C fora da faixa permitida para ${lote.medicamento.dcb}`,
          entidadeId: data.loteId,
          entidadeTipo: 'Lote',
          prioridade: 'ALTA',
        },
      });
    }

    return { ...registro, conformidade };
  }

  async historicoPorLote(loteId: string) {
    return this.prisma.registroTemperatura.findMany({
      where: { loteId },
      orderBy: { timestamp: 'desc' },
      take: 200,
    });
  }
}
