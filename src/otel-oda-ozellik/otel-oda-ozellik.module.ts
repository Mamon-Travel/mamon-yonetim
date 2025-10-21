import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OtelOdaOzellikService } from "./otel-oda-ozellik.service";
import { OtelOdaOzellikController } from "./otel-oda-ozellik.controller";
import { OtelOdaOzellik } from "./entities/otel-oda-ozellik.entity";

@Module({
  imports: [TypeOrmModule.forFeature([OtelOdaOzellik])],
  controllers: [OtelOdaOzellikController],
  providers: [OtelOdaOzellikService],
  exports: [OtelOdaOzellikService],
})
export class OtelOdaOzellikModule {}


