import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'FarmaChain API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
