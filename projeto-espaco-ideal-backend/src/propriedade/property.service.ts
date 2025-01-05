/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-propriedade.dto';
import { UpdatePropertyDto } from './dto/update-propriedade.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class PropertyService {
  constructor(private readonly prismaservice: PrismaService) {}

  create(data: CreatePropertyDto) {
    return this.prismaservice.property.create({
      data: {
        cityId: data.cityId,
        categoryId: data.categoryId,
        registro: data.registro,
        endereco: data.endereco,
        qtdQuartos: data.qtdQuartos,
        qtdVagasGaragem: data.qtdVagasGaragem,
        descricao: data.descricao,
        preco: data.preco,
        urlImagem: data.urlImagem,
        area: data.area,
        transacaoId: data.transacaoId,
      },
    });
  }

  findAll() {
    return this.prismaservice.property.findMany();
  }

  findOne(id: number) {
    return this.prismaservice.property.findUnique({
      where: { id },
    });
  }

  findSearch(
    transacaoId: number,
    cityId: number,
    categoryId: number,
    qtdQuartos: number,
    qtdVagasGaragem: number,
  ) {
    return this.prismaservice.property.findMany({
      where: {
        transacaoId,
        cityId,
        categoryId,
        qtdQuartos,
        qtdVagasGaragem,
      },
    });
  }
  
  update(id: number, updatePropertyDto: UpdatePropertyDto) {
    return this.prismaservice.property.update({
      where: { id },
      data: {
        cityId: updatePropertyDto.cityId,
        categoryId: updatePropertyDto.categoryId,
        registro: updatePropertyDto.registro,
        endereco: updatePropertyDto.endereco,
        qtdQuartos: updatePropertyDto.qtdQuartos,
        qtdVagasGaragem: updatePropertyDto.qtdVagasGaragem,
        descricao: updatePropertyDto.descricao,
        preco: updatePropertyDto.preco,
        urlImagem: updatePropertyDto.urlImagem,
        area: updatePropertyDto.area,
        transacaoId: updatePropertyDto.transacaoId,
      },
    });
  }

  remove(id: number) {
    return this.prismaservice.property.delete({ where: { id } });
  }
}
