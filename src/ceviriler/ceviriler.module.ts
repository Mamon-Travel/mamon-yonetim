import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CevirilerService } from "./ceviriler.service";
import { CevirilerController } from "./ceviriler.controller";
import { Ceviri } from "./entities/ceviri.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Ceviri])],
  controllers: [CevirilerController],
  providers: [CevirilerService],
  exports: [CevirilerService],
})
export class CevirilerModule {}


