import {
  IsEmail, IsString, IsEnum, IsOptional,
  MinLength, IsBoolean, Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Dra. Maria Santos' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'maria.santos@sus.gov.br' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678901' })
  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF deve ter 11 dígitos numéricos' })
  cpf: string;

  @ApiProperty({ example: 'SenhaSegura@2024' })
  @IsString()
  @MinLength(8)
  senha: string;

  @ApiProperty({ enum: Role, example: Role.FARMACEUTICO })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  unidadeId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ required: false, example: 'CRF-BA 12345' })
  @IsOptional()
  @IsString()
  crfNumero?: string;
}
