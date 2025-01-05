import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioClienteController } from './usuario_cliente.controller';
import { UsuarioClienteService } from './usuario_cliente.service';

describe('UsuarioClienteController', () => {
  let controller: UsuarioClienteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioClienteController],
      providers: [UsuarioClienteService],
    }).compile();

    controller = module.get<UsuarioClienteController>(UsuarioClienteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
