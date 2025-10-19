import { Test, TestingModule } from '@nestjs/testing';
import { HizmetlerController } from './hizmetler.controller';

describe('HizmetlerController', () => {
  let controller: HizmetlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HizmetlerController],
    }).compile();

    controller = module.get<HizmetlerController>(HizmetlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
