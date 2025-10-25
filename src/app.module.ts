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
import { KategorilerModule } from './kategoriler/kategoriler.module';
import { SiteOzellikleriModule } from './site-ozellikleri/site-ozellikleri.module';
import { NasilCalisirModule } from './nasil-calisir/nasil-calisir.module';
import { FooterModule } from './footer/footer.module';
import { OtelPansiyonTipiModule } from './otel-pansiyon-tipi/otel-pansiyon-tipi.module';
import { OtelFiyatTakvimModule } from './otel-fiyat-takvim/otel-fiyat-takvim.module';
import { OtelStokTakvimModule } from './otel-stok-takvim/otel-stok-takvim.module';
import { OtelIptalPolitikaModule } from './otel-iptal-politika/otel-iptal-politika.module';
import { DovizKurModule } from './doviz-kur/doviz-kur.module';
import { GorselIslemModule } from './gorsel-islem/gorsel-islem.module';
import { PaylasimSablonModule } from './paylasim-sablon/paylasim-sablon.module';
import { AiModule } from './ai/ai.module';
import { DinamikSayfalarModule } from './dinamik-sayfalar/dinamik-sayfalar.module';
import { FileManagerModule } from './file-manager/file-manager.module';

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
      synchronize: false, // TypeORM metadata hatası için geçici olarak kapatıldı
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
    KategorilerModule,
    SiteOzellikleriModule,
    NasilCalisirModule,
    FooterModule,
    OtelPansiyonTipiModule,
    OtelFiyatTakvimModule,
    OtelStokTakvimModule,
    OtelIptalPolitikaModule,
    DovizKurModule,
    GorselIslemModule,
    PaylasimSablonModule,
    AiModule,
    DinamikSayfalarModule,
    FileManagerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
