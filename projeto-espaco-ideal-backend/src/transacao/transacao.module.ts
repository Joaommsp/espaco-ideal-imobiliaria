/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TransactionService } from './transacao.service';
import { TransactionController } from './transacao.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
