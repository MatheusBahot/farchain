import { Module } from '@nestjs/common';
import { TccController } from './tcc.controller';
import { TccService } from './tcc.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TccController],
  providers: [TccService],
})
export class TccModule {}
