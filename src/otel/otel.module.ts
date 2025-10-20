import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OtelService } from "./otel.service";
import { OtelController } from "./otel.controller";
import { OtelUploadController } from "./otel-upload.controller";
import { Otel } from "./entities/otel.entity";
import { OtelDetay } from "./entities/otel-detay.entity";
import { OtelGorsel } from "./entities/otel-gorsel.entity";
import { OtelOdaTipi } from "./entities/otel-oda-tipi.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Otel, OtelDetay, OtelGorsel, OtelOdaTipi]),
  ],
  controllers: [OtelController, OtelUploadController],
  providers: [OtelService],
  exports: [OtelService],
})
export class OtelModule {}