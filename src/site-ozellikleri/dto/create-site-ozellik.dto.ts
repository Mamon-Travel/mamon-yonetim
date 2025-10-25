import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsIn } from "class-validator";

export class CreateSiteOzellikDto {
  @ApiProperty({ description: "Sayfa adı", example: "anasayfa", required: false })
  @IsOptional()
  @IsString()
  sayfa?: string;

  @ApiProperty({ description: "Rozet metni", example: "Advertising" })
  @IsNotEmpty()
  @IsString()
  rozet: string;

  @ApiProperty({
    description: "Rozet rengi",
    example: "blue",
    enum: ["red", "green", "blue"],
    required: false,
  })
  @IsOptional()
  @IsIn(["red", "green", "blue"])
  rozet_renk?: string;

  @ApiProperty({ description: "Başlık", example: "Cost-effective advertising" })
  @IsNotEmpty()
  @IsString()
  baslik: string;

  @ApiProperty({
    description: "Açıklama",
    example: "With a free listing, you can advertise your rental with no upfront costs",
    required: false,
  })
  @IsOptional()
  @IsString()
  aciklama?: string;

  @ApiProperty({ description: "Sıra numarası", example: 1, required: false })
  @IsOptional()
  @IsNumber()
  sira?: number;

  @ApiProperty({ description: "Durum (1: Aktif, 0: Pasif)", example: 1, required: false })
  @IsOptional()
  @IsNumber()
  durum?: number;
}

