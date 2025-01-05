import { Test, TestingModule } from '@nestjs/testing';
import { PropriedadeService } from './propriedade.service';

describe('PropriedadeService', () => {
  let service: PropriedadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropriedadeService],
    }).compile();

    service = module.get<PropriedadeService>(PropriedadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
