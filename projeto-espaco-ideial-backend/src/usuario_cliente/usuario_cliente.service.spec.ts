import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioClienteService } from './usuario_cliente.service';

describe('UsuarioClienteService', () => {
  let service: UsuarioClienteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioClienteService],
    }).compile();

    service = module.get<UsuarioClienteService>(UsuarioClienteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
