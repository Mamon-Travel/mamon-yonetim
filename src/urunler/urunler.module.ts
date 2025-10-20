import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrunlerService } from './urunler.service';
import { UrunlerController } from './urunler.controller';
import { Urunler } from './entities/urunler.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Urunler])],
  controllers: [UrunlerController],
  providers: [UrunlerService],
  exports: [UrunlerService],
})
export class UrunlerModule {}


