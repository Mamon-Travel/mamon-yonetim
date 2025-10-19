import { Module } from '@nestjs/common';
import { HizmetlerController } from './hizmetler.controller';
import { HizmetlerService } from './hizmetler.service';

@Module({
  controllers: [HizmetlerController],
  providers: [HizmetlerService]
})
export class HizmetlerModule {}
