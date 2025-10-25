import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FooterService } from "./footer.service";
import { FooterController } from "./footer.controller";
import { FooterMenu } from "./entities/footer-menu.entity";
import { FooterAyar } from "./entities/footer-ayar.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FooterMenu, FooterAyar])],
  controllers: [FooterController],
  providers: [FooterService],
  exports: [FooterService],
})
export class FooterModule {}

