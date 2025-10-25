import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { DovizKurService } from './doviz-kur.service';
import { DovizKurController } from './doviz-kur.controller';
import { DovizKur } from './entities/doviz-kur.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DovizKur]),
    HttpModule,
  ],
  controllers: [DovizKurController],
  providers: [DovizKurService],
  exports: [DovizKurService],
})
export class DovizKurModule {}

