import {
  IsString, IsInt, IsPositive, IsOptional,
  IsNotEmpty, IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDispensacaoDto {
  @ApiProperty()
  @IsString() @IsNotEmpty()
  loteId: string;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  medicamentoId: string;

  @ApiProperty({ description: 'CPF do paciente (será armazenado como hash SHA-256)' })
  @IsString() @IsNotEmpty()
  cpfPaciente: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  cartaoSusPaciente?: string;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  unidadeId: string;

  @ApiProperty({ example: 2 })
  @IsInt() @IsPositive()
  quantidade: number;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  dosagem?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  duracaoTratamento?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  cid10?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  prescricaoRef?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  observacoes?: string;
}
