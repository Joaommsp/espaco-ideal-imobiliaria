/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaservice: PrismaService) {}

  create(data: CreateCategoryDto) {
    return this.prismaservice.category.create({
      data: {
        nomeCategoria: data.nomeCategoria,
      },
    });
  }

  findAll() {
    return this.prismaservice.category.findMany();
  }

  findOne(id: number) {
    return this.prismaservice.category.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prismaservice.category.update({
      where: { id },
      data: {
        nomeCategoria: updateCategoryDto.nomeCategoria,
      },
    });
  }

  remove(id: number) {
    return this.prismaservice.category.delete({ where: { id } });
  }
}
