/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transacao.dto';
import { UpdateTransactionDto } from './dto/update-transacao.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaservice: PrismaService) {}

  create(data: CreateTransactionDto) {
    return this.prismaservice.transacao.create({
      data: {
        nomeTransacao: data.nomeTransacao,
      },
    });
  }

  findAll() {
    return this.prismaservice.transacao.findMany();
  }

  findOne(id: number) {
    return this.prismaservice.transacao.findUnique({
      where: { id },
    });
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return this.prismaservice.transacao.update({
      where: { id },
      data: {
        nomeTransacao: updateTransactionDto.nomeTransacao,
      },
    });
  }

  remove(id: number) {
    return this.prismaservice.transacao.delete({ where: { id } });
  }
}
