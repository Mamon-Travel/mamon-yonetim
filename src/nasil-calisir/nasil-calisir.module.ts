import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NasilCalisirService } from "./nasil-calisir.service";
import { NasilCalisirController } from "./nasil-calisir.controller";
import { NasilCalisir } from "./entities/nasil-calisir.entity";

@Module({
  imports: [TypeOrmModule.forFeature([NasilCalisir])],
  controllers: [NasilCalisirController],
  providers: [NasilCalisirService],
  exports: [NasilCalisirService],
})
export class NasilCalisirModule {}

