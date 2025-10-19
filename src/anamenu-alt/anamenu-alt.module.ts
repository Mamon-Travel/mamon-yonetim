import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AnamenuAltService } from "./anamenu-alt.service";
import { AnamenuAltController } from "./anamenu-alt.controller";
import { AnamenuAlt } from "./entities/anamenu-alt.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AnamenuAlt])],
  controllers: [AnamenuAltController],
  providers: [AnamenuAltService],
  exports: [AnamenuAltService],
})
export class AnamenuAltModule {}
