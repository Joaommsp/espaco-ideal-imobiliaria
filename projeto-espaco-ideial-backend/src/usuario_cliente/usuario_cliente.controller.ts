import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsuarioClienteService } from './usuario_cliente.service';
import { CreateUsuarioClienteDto } from './dto/create-usuario_cliente.dto';
import { UpdateUsuarioClienteDto } from './dto/update-usuario_cliente.dto';

@Controller('usuario-cliente')
export class UsuarioClienteController {
  constructor(private readonly usuarioClienteService: UsuarioClienteService) {}

  @Post()
  create(@Body() createUsuarioClienteDto: CreateUsuarioClienteDto) {
    return this.usuarioClienteService.create(createUsuarioClienteDto);
  }

  @Get()
  findAll() {
    return this.usuarioClienteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioClienteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioClienteDto: UpdateUsuarioClienteDto) {
    return this.usuarioClienteService.update(+id, updateUsuarioClienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioClienteService.remove(+id);
  }
}
