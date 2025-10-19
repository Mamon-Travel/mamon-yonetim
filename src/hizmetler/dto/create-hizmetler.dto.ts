import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsBoolean, IsNumber, IsUrl, MaxLength } from "class-validator";

export class CreateHizmetlerDto {
  @ApiProperty({ description: "Hizmet adı", example: "Konaklama" })
  @IsString()
  @MaxLength(255)
  ad: string;

  @ApiProperty({ description: "Hizmet slug", example: "stays" })
  @IsString()
  @MaxLength(100)
  slug: string;

  @ApiProperty({ description: "Hizmet açıklaması", required: false })
  @IsOptional()
  @IsString()
  aciklama?: string;

  @ApiProperty({ description: "Hizmet ikonu", required: false, example: "House03Icon" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ikon?: string;

  @ApiProperty({ description: "Hizmet rengi", required: false, example: "#3B82F6" })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  renk?: string;

  @ApiProperty({ description: "Sıra numarası", example: 1 })
  @IsNumber()
  sira: number;

  @ApiProperty({ description: "Aktif durumu", example: true })
  @IsBoolean()
  aktif: boolean;

  @ApiProperty({ description: "Ana sayfa URL'i", example: "/" })
  @IsString()
  @MaxLength(255)
  url: string;

  @ApiProperty({ description: "Meta başlık", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  meta_title?: string;

  @ApiProperty({ description: "Meta açıklama", required: false })
  @IsOptional()
  @IsString()
  meta_description?: string;
}
