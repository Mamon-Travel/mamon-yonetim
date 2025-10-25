import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DinamikSayfalarService } from './dinamik-sayfalar.service';
import { DinamikSayfalarController } from './dinamik-sayfalar.controller';
import { DinamikSayfa } from './entities/dinamik-sayfa.entity';
import { Otel } from '../otel/entities/otel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DinamikSayfa, Otel])],
  controllers: [DinamikSayfalarController],
  providers: [DinamikSayfalarService],
  exports: [DinamikSayfalarService],
})
export class DinamikSayfalarModule {}

