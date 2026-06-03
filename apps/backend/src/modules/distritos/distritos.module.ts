import { Module } from '@nestjs/common';
import { DistritosService } from './distritos.service';
import { DistritosController } from './distritos.controller';

@Module({
  controllers: [DistritosController],
  providers: [DistritosService],
  exports: [DistritosService],
})
export class DistritosModule {}
