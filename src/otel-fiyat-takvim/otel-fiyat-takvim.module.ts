import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtelFiyatTakvimService } from './otel-fiyat-takvim.service';
import { OtelFiyatTakvimController } from './otel-fiyat-takvim.controller';
import { OtelFiyatTakvim } from './entities/otel-fiyat-takvim.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OtelFiyatTakvim])],
  controllers: [OtelFiyatTakvimController],
  providers: [OtelFiyatTakvimService],
  exports: [OtelFiyatTakvimService],
})
export class OtelFiyatTakvimModule {}

