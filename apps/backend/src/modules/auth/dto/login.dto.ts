import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'farmaceutico@sus.gov.br' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({ example: 'SenhaSegura@2024' })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  senha: string;

  @ApiProperty({ required: false, example: '123456' })
  @IsOptional()
  @IsString()
  mfaCode?: string;
}

