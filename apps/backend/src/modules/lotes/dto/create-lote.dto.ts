import {
  IsString, IsNotEmpty, IsDateString,
  IsInt, IsPositive, IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoteDto {
  @ApiProperty({ example: 'uuid-do-medicamento' })
  @IsString() @IsNotEmpty()
  medicamentoId: string;

  @ApiProperty({ example: 'LOT-2024-001234' })
  @IsString() @IsNotEmpty()
  numeroLote: string;

  @ApiProperty({ example: 'AbbVie Brasil' })
  @IsString() @IsNotEmpty()
  fabricante: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  dataFabricacao: string;

  @ApiProperty({ example: '2026-01-15' })
  @IsDateString()
  dataValidade: string;

  @ApiProperty({ example: 500 })
  @IsInt() @IsPositive()
  quantidadeProduzida: number;

  @ApiProperty({ example: 480 })
  @IsInt() @IsPositive()
  quantidadeRecebida: number;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  notaFiscal?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  fornecedor?: string;

  @ApiProperty({ required: false, example: 'uuid-da-unidade-destinataria' })
  @IsOptional() @IsString()
  unidadeDestinoId?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  observacoes?: string;
}
