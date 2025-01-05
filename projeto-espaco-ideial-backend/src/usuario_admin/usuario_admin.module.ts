import { Module } from '@nestjs/common';
import { UsuarioAdminService } from './usuario_admin.service';
import { UsuarioAdminController } from './usuario_admin.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [UsuarioAdminController],
  providers: [UsuarioAdminService],
})
export class UsuarioAdminModule {}
