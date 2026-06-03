import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export interface BlocoData {
  indice: number;
  timestamp: string;
  dados: any;
  hashAnterior: string;
  nonce: number;
  dificuldade: number;
}

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);
  private difficulty: number;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.difficulty = this.config.get<number>('app.blockchain.difficulty', 2);
  }

  async onModuleInit() {
    await this.inicializarGenesis();
  }

  private calcularHash(bloco: BlocoData): string {
    const conteudo = JSON.stringify({
      indice: bloco.indice,
      timestamp: bloco.timestamp,
      dados: bloco.dados,
      hashAnterior: bloco.hashAnterior,
      nonce: bloco.nonce,
    });
    return crypto.createHash('sha256').update(conteudo).digest('hex');
  }

  private minerarBloco(bloco: BlocoData): { hash: string; nonce: number } {
    const prefixo = '0'.repeat(this.difficulty);
    let nonce = 0;
    let hash = '';

    do {
      nonce++;
      bloco.nonce = nonce;
      hash = this.calcularHash(bloco);
    } while (!hash.startsWith(prefixo));

    return { hash, nonce };
  }

  async inicializarGenesis() {
    const total = await this.prisma.blocoBlockchain.count();
    if (total > 0) return;

    const genesisData = this.config.get<string>('app.blockchain.genesisData');
    const blocoGenesis: BlocoData = {
      indice: 0,
      timestamp: new Date().toISOString(),
      dados: { genesis: true, mensagem: genesisData, plataforma: 'FarChain v1.0' },
      hashAnterior: '0000000000000000000000000000000000000000000000000000000000000000',
      nonce: 0,
      dificuldade: this.difficulty,
    };

    const { hash, nonce } = this.minerarBloco(blocoGenesis);

    await this.prisma.blocoBlockchain.create({
      data: {
        indice: 0,
        hashAnterior: blocoGenesis.hashAnterior,
        hashAtual: hash,
        nonce,
        dificuldade: this.difficulty,
        dadosJson: JSON.stringify(blocoGenesis.dados),
        validado: true,
      },
    });

    this.logger.log(`⛓️ Bloco Gênesis criado: ${hash}`);
  }

  async adicionarBloco(dados: any, tipoEvento: string, entidadeId: string, entidadeTipo: string, usuarioId?: string): Promise<string> {
    const ultimoBloco = await this.prisma.blocoBlockchain.findFirst({
      orderBy: { indice: 'desc' },
    });

    const novoIndice = (ultimoBloco?.indice ?? -1) + 1;
    const hashAnterior = ultimoBloco?.hashAtual ?? '0'.repeat(64);

    const blocoData: BlocoData = {
      indice: novoIndice,
      timestamp: new Date().toISOString(),
      dados: { tipoEvento, entidadeId, entidadeTipo, ...dados },
      hashAnterior,
      nonce: 0,
      dificuldade: this.difficulty,
    };

    const { hash, nonce } = this.minerarBloco(blocoData);

    const bloco = await this.prisma.blocoBlockchain.create({
      data: {
        indice: novoIndice,
        hashAnterior,
        hashAtual: hash,
        nonce,
        dificuldade: this.difficulty,
        dadosJson: JSON.stringify(blocoData.dados),
        validado: true,
      },
    });

    // Registrar evento associado
    await this.prisma.eventoBlockchain.create({
      data: {
        blocoId: bloco.id,
        tipoEvento: tipoEvento as any,
        entidadeId,
        entidadeTipo,
        usuarioId: usuarioId || null,
        dados: JSON.stringify(dados),
        hashDados: crypto.createHash('sha256').update(JSON.stringify(dados)).digest('hex'),
      },
    });

    this.logger.log(`⛓️ Bloco #${novoIndice} minerado: ${hash.substring(0, 20)}...`);
    return hash;
  }

  async validarCadeia(): Promise<{ valida: boolean; erro?: string }> {
    const blocos = await this.prisma.blocoBlockchain.findMany({
      orderBy: { indice: 'asc' },
    });

    for (let i = 1; i < blocos.length; i++) {
      const atual = blocos[i];
      const anterior = blocos[i - 1];

      if (atual.hashAnterior !== anterior.hashAtual) {
        return {
          valida: false,
          erro: `Bloco #${atual.indice}: hashAnterior inválido`,
        };
      }

      const dadosBloco: BlocoData = {
        indice: atual.indice,
        timestamp: atual.createdAt.toISOString(),
        dados: JSON.parse(atual.dadosJson),
        hashAnterior: atual.hashAnterior,
        nonce: atual.nonce,
        dificuldade: atual.dificuldade,
      };

      const hashRecalculado = this.calcularHash(dadosBloco);
      if (hashRecalculado !== atual.hashAtual) {
        return {
          valida: false,
          erro: `Bloco #${atual.indice}: hash adulterado`,
        };
      }
    }

    return { valida: true };
  }

  async obterBlocos(pagina = 1, limite = 10) {
    const skip = (pagina - 1) * limite;
    const [blocos, total] = await Promise.all([
      this.prisma.blocoBlockchain.findMany({
        skip,
        take: limite,
        orderBy: { indice: 'desc' },
        include: { eventos: true },
      }),
      this.prisma.blocoBlockchain.count(),
    ]);

    return { blocos, total, pagina, limite };
  }

  async obterHistoricoLote(loteId: string) {
    return this.prisma.eventoBlockchain.findMany({
      where: { entidadeId: loteId },
      include: { bloco: true, usuario: { select: { nome: true, email: true, role: true } } },
      orderBy: { timestamp: 'asc' },
    });
  }

  gerarHashDados(dados: any): string {
    return crypto.createHash('sha256').update(JSON.stringify(dados)).digest('hex');
  }
}
