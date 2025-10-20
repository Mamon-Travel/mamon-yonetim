import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AnamenuModule } from "./anamenu/anamenu.module";
import { AnamenuAltModule } from "./anamenu-alt/anamenu-alt.module";
import { MenuModule } from "./menu/menu.module";
import { YetkilerModule } from "./yetkiler/yetkiler.module";
import { KullanicilarModule } from "./kullanicilar/kullanicilar.module";
import { HizmetlerModule } from './hizmetler/hizmetler.module';
import { AuthModule } from './auth/auth.module';
import { UrunlerModule } from './urunler/urunler.module';
import { RezervasyonlarModule } from './rezervasyonlar/rezervasyonlar.module';
import { SepetModule } from './sepet/sepet.module';
import { OdemeModule } from './odeme/odeme.module';
import { PanelKullanicilarModule } from './panel-kullanicilar/panel-kullanicilar.module';
import { OtelOzellikModule } from './otel-ozellik/otel-ozellik.module';
import { OtelOdaOzellikModule } from './otel-oda-ozellik/otel-oda-ozellik.module';
import { OtelModule } from './otel/otel.module';
import { DillerModule } from './diller/diller.module';
import { CevirilerModule } from './ceviriler/ceviriler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME || "baris",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_DATABASE || "mamon_travel",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: process.env.NODE_ENV === "development",
    }),
    AnamenuModule,
    AnamenuAltModule,
    MenuModule,
    YetkilerModule,
    KullanicilarModule,
    HizmetlerModule,
    AuthModule,
    UrunlerModule,
    RezervasyonlarModule,
    SepetModule,
    OdemeModule,
    PanelKullanicilarModule,
    OtelOzellikModule,
    OtelOdaOzellikModule,
    OtelModule,
    DillerModule,
    CevirilerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
