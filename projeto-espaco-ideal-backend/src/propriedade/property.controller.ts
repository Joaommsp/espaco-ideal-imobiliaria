/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-propriedade.dto';
import { UpdatePropertyDto } from './dto/update-propriedade.dto';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create(createPropertyDto);
  }

  @Get('all')
  findAll() {
    return this.propertyService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.update(+id, updatePropertyDto);
  }

  @Get(':id')
  findUnique(@Param('id') id: string) {
    return this.propertyService.findOne(+id);
  }

  @Get(':transactionId/:cityId/:categoryId/:qtdQuartos/:qtdVagasGaragem')
  findSearch(
    @Param('transactionId') transactionId: string,
    @Param('cityId') cityId: string,
    @Param('categoryId') categoryId: string,
    @Param('qtdQuartos') qtdQuartos: string,
    @Param('qtdVagasGaragem') qtdVagasGaragem: string,
  ) {
    return this.propertyService.findSearch(
      +transactionId,
      +cityId,
      +categoryId,
      +qtdQuartos,
      +qtdVagasGaragem,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(+id);
  }
}
