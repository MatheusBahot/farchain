import { Module } from '@nestjs/common';
import { FarmacovigilanciaService } from './farmacovigilancia.service';
import { FarmacovigilanciaController } from './farmacovigilancia.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule],
  controllers: [FarmacovigilanciaController],
  providers: [FarmacovigilanciaService],
  exports: [FarmacovigilanciaService],
})
export class FarmacovigilanciaModule {}
