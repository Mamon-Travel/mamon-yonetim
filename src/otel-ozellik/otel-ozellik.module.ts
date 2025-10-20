import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OtelOzellikService } from "./otel-ozellik.service";
import { OtelOzellikController } from "./otel-ozellik.controller";
import { OtelOzellik } from "./entities/otel-ozellik.entity";

@Module({
  imports: [TypeOrmModule.forFeature([OtelOzellik])],
  controllers: [OtelOzellikController],
  providers: [OtelOzellikService],
  exports: [OtelOzellikService],
})
export class OtelOzellikModule {}

