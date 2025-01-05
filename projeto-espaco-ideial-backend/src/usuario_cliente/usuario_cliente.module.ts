import { Module } from '@nestjs/common';
import { UsuarioClienteService } from './usuario_cliente.service';
import { UsuarioClienteController } from './usuario_cliente.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [UsuarioClienteController],
  providers: [UsuarioClienteService],
})
export class UsuarioClienteModule {}
