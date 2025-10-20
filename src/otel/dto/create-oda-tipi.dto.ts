import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOdaTipiDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  otel_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ad: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  kapasite?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  yetiskin_kapasite?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  cocuk_kapasite?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  oda_sayisi?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  metrekare?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  yatak_tipi?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  manzara?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  fiyat?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  aciklama?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  durum?: number;

  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  odaOzellikIds?: number[];
}

