import { Injectable } from '@nestjs/common';
import { CreateUsuarioAdminDto } from './dto/create-usuario_admin.dto';
import { UpdateUsuarioAdminDto } from './dto/update-usuario_admin.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UsuarioAdminService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createUsuarioAdminDto: CreateUsuarioAdminDto) {
    return this.prismaService.usuario_admin.create({
      data: createUsuarioAdminDto,
    });
  }

  findAll() {
    return this.prismaService.usuario_admin.findMany();
  }

  findOne(id: number) {
    return this.prismaService.usuario_admin.findUnique({
      where: { id },
    });
  }

  update(id: number, updateUsuarioAdminDto: UpdateUsuarioAdminDto) {
    return this.prismaService.usuario_admin.update({
      where: { id },
      data: updateUsuarioAdminDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} usuarioAdmin`;
  }
}
