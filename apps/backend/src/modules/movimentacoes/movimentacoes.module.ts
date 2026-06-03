import { Module } from '@nestjs/common';
import { MovimentacoesService } from './movimentacoes.service';
import { MovimentacoesController } from './movimentacoes.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule],
  controllers: [MovimentacoesController],
  providers: [MovimentacoesService],
  exports: [MovimentacoesService],
})
export class MovimentacoesModule {}
