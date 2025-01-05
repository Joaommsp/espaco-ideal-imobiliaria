import { Injectable } from '@nestjs/common';
import { CreateUsuarioClienteDto } from './dto/create-usuario_cliente.dto';
import { UpdateUsuarioClienteDto } from './dto/update-usuario_cliente.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UsuarioClienteService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createUsuarioClienteDto: CreateUsuarioClienteDto) {
    return this.prismaService.usuario_cliente.create({
      data: createUsuarioClienteDto,
    });
  }

  findAll() {
    return this.prismaService.usuario_cliente.findMany();
  }

  findOne(id: number) {
    return this.prismaService.usuario_cliente.findUnique({
      where: { id },
    });
  }

  update(id: number, updateUsuarioClienteDto: UpdateUsuarioClienteDto) {
    return this.prismaService.usuario_cliente.update({
      where: { id },
      data: updateUsuarioClienteDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} usuarioCliente`;
  }
}
