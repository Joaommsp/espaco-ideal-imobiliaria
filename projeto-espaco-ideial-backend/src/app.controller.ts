import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './db/prisma.service';

@Controller()
export class AppController {
  constructor(
    private prisma: PrismaService) {}

  @Get()
  async getHello() {
    const user = await this.prisma.usuario_cliente.create({
      data: {
        idFirebase: 'teste1',
        nome: 'teste2',
        email: 'teste3',
        senha: "teste4"
      }
    })

    return user;
  }
}
