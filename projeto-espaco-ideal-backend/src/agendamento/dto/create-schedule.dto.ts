/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  nomeUsuario: string;

  @IsString()
  @IsNotEmpty()
  enderecoPropriedade: string;

  @IsNumber()
  @IsNotEmpty()
  propertyId: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;
}
