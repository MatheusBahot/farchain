import {
  IsString, IsEnum, IsInt, IsPositive,
  IsOptional, IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoMovimentacao } from '@prisma/client';

export class CreateMovimentacaoDto {
  @ApiProperty()
  @IsString() @IsNotEmpty()
  loteId: string;

  @ApiProperty({ enum: TipoMovimentacao })
  @IsEnum(TipoMovimentacao)
  tipo: TipoMovimentacao;

  @ApiProperty({ example: 50 })
  @IsInt() @IsPositive()
  quantidade: number;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  origemId?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  destinoId?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  justificativa?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  documentoRef?: string;
}
