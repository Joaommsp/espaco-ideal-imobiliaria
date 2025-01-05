import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioAdminController } from './usuario_admin.controller';
import { UsuarioAdminService } from './usuario_admin.service';

describe('UsuarioAdminController', () => {
  let controller: UsuarioAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioAdminController],
      providers: [UsuarioAdminService],
    }).compile();

    controller = module.get<UsuarioAdminController>(UsuarioAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
