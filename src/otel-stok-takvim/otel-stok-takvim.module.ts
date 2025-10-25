import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtelStokTakvimService } from './otel-stok-takvim.service';
import { OtelStokTakvimController } from './otel-stok-takvim.controller';
import { OtelStokTakvim } from './entities/otel-stok-takvim.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OtelStokTakvim])],
  controllers: [OtelStokTakvimController],
  providers: [OtelStokTakvimService],
  exports: [OtelStokTakvimService],
})
export class OtelStokTakvimModule {}

