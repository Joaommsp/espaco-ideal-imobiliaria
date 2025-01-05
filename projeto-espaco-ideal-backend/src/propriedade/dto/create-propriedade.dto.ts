/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePropertyDto {
  @IsNumber()
  @IsNotEmpty()
  cityId: number; 

  @IsNumber()
  @IsNotEmpty()
  categoryId: number; 

  @IsNumber()
  @IsNotEmpty()
  transacaoId: number; 

  @IsNumber()
  @IsNotEmpty()
  area: number; 

  @IsString()
  @IsNotEmpty()
  registro: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsString()
  @IsNotEmpty()
  endereco: string;

  @IsNumber()
  @IsNotEmpty()
  qtdQuartos: number;

  @IsNumber()
  @IsNotEmpty()
  qtdVagasGaragem: number;

  @IsNumber()
  @IsNotEmpty()
  preco: number;

  @IsString()
  @IsNotEmpty()
  urlImagem: string;
}
