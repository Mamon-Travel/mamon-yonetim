import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OdemeService } from './odeme.service';
import { OdemeController } from './odeme.controller';
import { Odemeler } from './entities/odemeler.entity';
import { OdemeLoglari } from './entities/odeme-loglari.entity';
import { Rezervasyonlar } from '../rezervasyonlar/entities/rezervasyonlar.entity';
import { SepetModule } from '../sepet/sepet.module';
import { RezervasyonlarModule } from '../rezervasyonlar/rezervasyonlar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Odemeler, OdemeLoglari, Rezervasyonlar]),
    ConfigModule,
    SepetModule,
    RezervasyonlarModule,
  ],
  controllers: [OdemeController],
  providers: [OdemeService],
  exports: [OdemeService],
})
export class OdemeModule {}


