import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KategorilerService } from "./kategoriler.service";
import { KategorilerController } from "./kategoriler.controller";
import { Kategori } from "./entities/kategori.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Kategori])],
  controllers: [KategorilerController],
  providers: [KategorilerService],
  exports: [KategorilerService],
})
export class KategorilerModule {}

