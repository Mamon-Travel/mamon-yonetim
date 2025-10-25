import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtelPansiyonTipiService } from './otel-pansiyon-tipi.service';
import { OtelPansiyonTipiController } from './otel-pansiyon-tipi.controller';
import { OtelPansiyonTipi } from './entities/otel-pansiyon-tipi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OtelPansiyonTipi])],
  controllers: [OtelPansiyonTipiController],
  providers: [OtelPansiyonTipiService],
  exports: [OtelPansiyonTipiService],
})
export class OtelPansiyonTipiModule {}

