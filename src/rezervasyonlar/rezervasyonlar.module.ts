import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RezervasyonlarService } from './rezervasyonlar.service';
import { RezervasyonlarController } from './rezervasyonlar.controller';
import { Rezervasyonlar } from './entities/rezervasyonlar.entity';
import { RezervasyonDetaylari } from './entities/rezervasyon-detaylari.entity';
import { UrunlerModule } from '../urunler/urunler.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rezervasyonlar, RezervasyonDetaylari]),
    UrunlerModule,
  ],
  controllers: [RezervasyonlarController],
  providers: [RezervasyonlarService],
  exports: [RezervasyonlarService],
})
export class RezervasyonlarModule {}


