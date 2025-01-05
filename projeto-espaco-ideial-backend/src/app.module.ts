import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './db/prisma.service';
import { DbModule } from './db/db.module';
import { PropriedadeModule } from './propriedade/propriedade.module';
import { UsuarioClienteModule } from './usuario_cliente/usuario_cliente.module';
import { UsuarioAdminModule } from './usuario_admin/usuario_admin.module';

@Module({
  imports: [DbModule, PropriedadeModule, UsuarioClienteModule, UsuarioAdminModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
