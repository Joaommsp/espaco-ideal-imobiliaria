import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioAdminService } from './usuario_admin.service';

describe('UsuarioAdminService', () => {
  let service: UsuarioAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioAdminService],
    }).compile();

    service = module.get<UsuarioAdminService>(UsuarioAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
