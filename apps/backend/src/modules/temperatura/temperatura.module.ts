import { Module } from '@nestjs/common';
import { TemperaturaService } from './temperatura.service';
import { TemperaturaController } from './temperatura.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule],
  controllers: [TemperaturaController],
  providers: [TemperaturaService],
})
export class TemperaturaModule {}
