import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HizmetlerService } from './hizmetler.service';
import { HizmetlerController } from './hizmetler.controller';
import { Hizmetler } from './entities/hizmetler.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hizmetler])],
  controllers: [HizmetlerController],
  providers: [HizmetlerService],
  exports: [HizmetlerService],
})
export class HizmetlerModule {}
