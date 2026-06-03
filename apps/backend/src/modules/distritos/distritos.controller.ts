import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DistritosService } from './distritos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('distritos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'distritos', version: '1' })
export class DistritosController {
  constructor(private readonly distritosService: DistritosService) {}

  @Get()
  listar() { return this.distritosService.listar(); }

  @Post()
  criar(@Body() data: any) { return this.distritosService.criar(data); }
}
