/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { UserModule } from './usuario/user.module';
import { PropertyModule } from './propriedade/property.module';
import { CityModule } from './cidade/city.module';
import { CategoryModule } from './categoria/category.module';
import { TransactionModule } from './transacao/transacao.module';
import { ScheduleModule } from './agendamento/schedule.module';

@Module({
  imports: [
    DbModule,
    UserModule,
    PropertyModule,
    CityModule,
    CategoryModule,
    TransactionModule,
    ScheduleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
