/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
