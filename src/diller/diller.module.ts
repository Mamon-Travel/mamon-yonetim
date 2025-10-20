import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DillerService } from "./diller.service";
import { DillerController } from "./diller.controller";
import { Dil } from "./entities/dil.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Dil])],
  controllers: [DillerController],
  providers: [DillerService],
  exports: [DillerService],
})
export class DillerModule {}

