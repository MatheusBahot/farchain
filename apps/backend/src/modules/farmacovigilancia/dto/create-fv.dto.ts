import {
  IsString, IsNotEmpty, IsDateString,
  IsEnum, IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmacovigilanciaDto {
  @ApiProperty()
  @IsString() @IsNotEmpty()
  loteId: string;

  @ApiProperty({
    example: 'RAM',
    description: 'RAM | Queixa Técnica | Desvio de Qualidade | Falha Terapêutica | Suspeita de Falsificação',
  })
  @IsString() @IsNotEmpty()
  tipoEvento: string;

  @ApiProperty({ example: 'Paciente relatou reação alérgica intensa após aplicação' })
  @IsString() @IsNotEmpty()
  descricao: string;

  @ApiProperty({ example: 'Grave', description: 'Leve | Moderado | Grave | Fatal' })
  @IsString() @IsNotEmpty()
  gravidade: string;

  @ApiProperty({ example: '2024-06-15' })
  @IsDateString()
  dataOcorrencia: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  acaoTomada?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  notificacaoRef?: string;
}
