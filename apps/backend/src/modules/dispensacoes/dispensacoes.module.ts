import { Module } from '@nestjs/common';
import { DispensacoesService } from './dispensacoes.service';
import { DispensacoesController } from './dispensacoes.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule],
  controllers: [DispensacoesController],
  providers: [DispensacoesService],
  exports: [DispensacoesService],
})
export class DispensacoesModule {}
