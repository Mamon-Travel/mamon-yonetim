import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsObject,
} from "class-validator";

export class CreateOtelDetayDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  kisa_aciklama?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  uzun_aciklama?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  denize_mesafe?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  havalimani_mesafe?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sehir_merkezi_mesafe?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  oda_sayisi?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  acilis_yili?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  renovasyon_yili?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  kat_sayisi?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  onemli_bilgiler?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  covid_onlemleri?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  cocuk_politikasi?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  evcil_hayvan_politikasi?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  iptal_politikasi?: string;
}

export class CreateOtelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ad: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  yildiz?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  konsept?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sehir?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bolge?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  adres?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  telefon?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  web_site?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  check_in_time?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  check_out_time?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  min_fiyat?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  kapak_gorseli?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  video_url?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  enlem?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  boylam?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  durum?: number;

  @ApiProperty({ required: false, type: CreateOtelDetayDto })
  @IsObject()
  @IsOptional()
  detay?: CreateOtelDetayDto;

  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  otelOzellikIds?: number[];
}


