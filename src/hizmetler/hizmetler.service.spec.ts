import { Test, TestingModule } from '@nestjs/testing';
import { HizmetlerService } from './hizmetler.service';

describe('HizmetlerService', () => {
  let service: HizmetlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HizmetlerService],
    }).compile();

    service = module.get<HizmetlerService>(HizmetlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
