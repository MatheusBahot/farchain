import {
  IsString, IsEnum, IsOptional, IsNumber,
  IsBoolean, Min, IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FormaFarmaceutica, ClasseCEAF } from '@prisma/client';

export class CreateMedicamentoDto {
  @ApiProperty({ example: 'ADALIMUMABE' })
  @IsString() @IsNotEmpty()
  dcb: string;

  @ApiProperty({ required: false, example: 'Humira' })
  @IsOptional() @IsString()
  nomeComercial?: string;

  @ApiProperty({ example: 'adalimumabe' })
  @IsString() @IsNotEmpty()
  principioAtivo: string;

  @ApiProperty({ example: 'AbbVie' })
  @IsString() @IsNotEmpty()
  fabricante: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  distribuidor?: string;

  @ApiProperty({ required: false, example: '1.2345.0001.001-1' })
  @IsOptional() @IsString()
  registroSanitario?: string;

  @ApiProperty({ example: 'Imunossupressor / Antiartrítico' })
  @IsString() @IsNotEmpty()
  classeTerapeutica: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  subclasse?: string;

  @ApiProperty({ enum: FormaFarmaceutica })
  @IsEnum(FormaFarmaceutica)
  formaFarmaceutica: FormaFarmaceutica;

  @ApiProperty({ example: '40mg/0,8mL' })
  @IsString() @IsNotEmpty()
  concentracao: string;

  @ApiProperty({ example: '2 seringas preenchidas' })
  @IsString() @IsNotEmpty()
  apresentacao: string;

  @ApiProperty({ required: false, example: 'Subcutânea' })
  @IsOptional() @IsString()
  viaAdministracao?: string;

  @ApiProperty({ enum: ClasseCEAF })
  @IsEnum(ClasseCEAF)
  classeCEAF: ClasseCEAF;

  @ApiProperty({ required: false, example: 'PCDT Artrite Reumatoide' })
  @IsOptional() @IsString()
  protocoloClinico?: string;

  @ApiProperty({ required: false, example: 'M05B' })
  @IsOptional() @IsString()
  cid10?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  gtin?: string;

  @ApiProperty({ required: false, example: 2 })
  @IsOptional() @IsNumber()
  temperaturaMin?: number;

  @ApiProperty({ required: false, example: 8 })
  @IsOptional() @IsNumber()
  temperaturaMax?: number;

  @ApiProperty({ required: false, default: false })
  @IsOptional() @IsBoolean()
  requireCadeiaFria?: boolean;

  @ApiProperty({ required: false, example: 'Refrigerado entre 2°C e 8°C. Não congelar.' })
  @IsOptional() @IsString()
  condicoesArmazenamento?: string;

  @ApiProperty({ required: false, example: 4500.00 })
  @IsOptional() @IsNumber() @Min(0)
  custoCentral?: number;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  observacoes?: string;
}
