/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}
