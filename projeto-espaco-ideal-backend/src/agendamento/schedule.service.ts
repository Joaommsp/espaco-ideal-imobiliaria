/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private readonly prismaservice: PrismaService) {}

  create(data: CreateScheduleDto) {
    return this.prismaservice.schedule.create({
      data: {
        userName: data.nomeUsuario,
        propertyId: data.propertyId,
        propertyAdress: data.enderecoPropriedade,
        date: data.date,
      },
    });
  }

  findAll() {
    return this.prismaservice.schedule.findMany();
  }

  findOne(id: number) {
    return this.prismaservice.schedule.findUnique({
      where: { id },
    });
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return this.prismaservice.schedule.update({
      where: { id },
      data: {
        userName: updateScheduleDto.nomeUsuario,
        propertyId: updateScheduleDto.propertyId,
        propertyAdress: updateScheduleDto.enderecoPropriedade,
        date: updateScheduleDto.date,
      },
    });
  }

  remove(id: number) {
    return this.prismaservice.schedule.delete({ where: { id } });
  }
}
