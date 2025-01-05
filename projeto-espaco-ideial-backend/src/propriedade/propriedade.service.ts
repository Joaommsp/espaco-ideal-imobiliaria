import { Injectable } from '@nestjs/common';
import { CreatePropriedadeDto } from './dto/create-propriedade.dto';
import { UpdatePropriedadeDto } from './dto/update-propriedade.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class PropriedadeService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createPropriedadeDto: CreatePropriedadeDto) {
    return this.prismaService.propriedade.create({
      data: createPropriedadeDto,
    });
  }

  findAll() {
    return this.prismaService.propriedade.findMany();
  }

  findOne(id: number) {
    return this.prismaService.propriedade.findUnique({
      where: { id },
    });
  }

  update(id: number, updatePropriedadeDto: UpdatePropriedadeDto) {
    return this.prismaService.propriedade.update({
      where: { id },
      data: updatePropriedadeDto,
    }) 
  }

  remove(id: number) {
    return `This action removes a #${id} propriedade`;
  }
}
