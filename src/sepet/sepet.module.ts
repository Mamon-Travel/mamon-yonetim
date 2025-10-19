import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SepetService } from './sepet.service';
import { SepetController } from './sepet.controller';
import { Sepet } from './entities/sepet.entity';
import { Urunler } from '../urunler/entities/urunler.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sepet, Urunler])],
  controllers: [SepetController],
  providers: [SepetService],
  exports: [SepetService],
})
export class SepetModule {}

