/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaservice: PrismaService) {}

  create(data: CreateUserDto) {
    return this.prismaservice.users.create({
      data: {
        id: data.id,
        firebaseId: data.firebaseId,
        nome: data.nome,
        email: data.email,
        senha: data.senha,
      },
    });
  }

  findAll() {
    return this.prismaservice.users.findMany();
  }

  findOne(id: string) {
    return this.prismaservice.users.findUnique({
      where: { id },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaservice.users.update({
      where: { id },
      data: {
        nome: updateUserDto.nome,
        firebaseId: updateUserDto.firebaseId,
        email: updateUserDto.email,
        senha: updateUserDto.senha,
      },
    });
  }

  remove(id: string) {
    return this.prismaservice.users.delete({ where: { id } });
  }
}
