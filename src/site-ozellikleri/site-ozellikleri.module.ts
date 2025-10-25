import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SiteOzellikleriService } from "./site-ozellikleri.service";
import { SiteOzellikleriController } from "./site-ozellikleri.controller";
import { SiteOzellik } from "./entities/site-ozellik.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SiteOzellik])],
  controllers: [SiteOzellikleriController],
  providers: [SiteOzellikleriService],
  exports: [SiteOzellikleriService],
})
export class SiteOzellikleriModule {}

