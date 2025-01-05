/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class CityService {
  constructor(private readonly prismaservice: PrismaService) {}

  create(data: CreateCityDto) {
    return this.prismaservice.city.create({
      data: {
        nomeCidade: data.nomeCidade,
      },
    });
  }

  findAll() {
    return this.prismaservice.city.findMany();
  }

  findOne(id: number) {
    return this.prismaservice.city.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return this.prismaservice.city.update({
      where: { id },
      data: {
        nomeCidade: updateCityDto.nomeCidade,
      },
    });
  }

  remove(id: number) {
    return this.prismaservice.city.delete({ where: { id } });
  }
}
