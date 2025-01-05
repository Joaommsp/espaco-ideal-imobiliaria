import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PropriedadeService } from './propriedade.service';
import { CreatePropriedadeDto } from './dto/create-propriedade.dto';
import { UpdatePropriedadeDto } from './dto/update-propriedade.dto';

@Controller('propriedades')
export class PropriedadeController {
  constructor(private readonly propriedadeService: PropriedadeService) {}

  @Post()
  create(@Body() createPropriedadeDto: CreatePropriedadeDto) {
    return this.propriedadeService.create(createPropriedadeDto);
  }

  @Get()
  findAll() {
    return this.propriedadeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propriedadeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropriedadeDto: UpdatePropriedadeDto) {
    return this.propriedadeService.update(+id, updatePropriedadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propriedadeService.remove(+id);
  }
}
