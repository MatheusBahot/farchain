import { TccModule } from './tcc/tcc.module';
import { HealthController } from './health/health.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { MedicamentosModule } from './modules/medicamentos/medicamentos.module';
import { LotesModule } from './modules/lotes/lotes.module';
import { MovimentacoesModule } from './modules/movimentacoes/movimentacoes.module';
import { DispensacoesModule } from './modules/dispensacoes/dispensacoes.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { QrCodeModule } from './modules/qrcode/qrcode.module';
import { FarmacovigilanciaModule } from './modules/farmacovigilancia/farmacovigilancia.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { UnidadesModule } from './modules/unidades/unidades.module';
import { DistritosModule } from './modules/distritos/distritos.module';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { TemperaturaModule } from './modules/temperatura/temperatura.module';
import appConfig from './config/app.config';

@Module({
  controllers: [HealthController],
  imports: [TccModule, 
    // Configuração global de env
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 1000,
      limit: 10,
    }, {
      name: 'medium',
      ttl: 10000,
      limit: 50,
    }, {
      name: 'long',
      ttl: 60000,
      limit: 100,
    }]),

    // Event emitter para eventos assíncronos
    EventEmitterModule.forRoot(),

    // Scheduler para tarefas agendadas
    ScheduleModule.forRoot(),

    // Prisma (banco de dados)
    PrismaModule,

    // Módulos de negócio
    AuthModule,
    UsuariosModule,
    MedicamentosModule,
    LotesModule,
    MovimentacoesModule,
    DispensacoesModule,
    BlockchainModule,
    QrCodeModule,
    FarmacovigilanciaModule,
    DashboardModule,
    UnidadesModule,
    DistritosModule,
    AuditoriaModule,
    TemperaturaModule,
  ],
})
export class AppModule {}
