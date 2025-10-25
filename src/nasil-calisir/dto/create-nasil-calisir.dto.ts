import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";

export class CreateNasilCalisirDto {
  @ApiProperty({ description: "Sayfa adı", example: "anasayfa", required: false })
  @IsOptional()
  @IsString()
  sayfa?: string;

  @ApiProperty({ description: "Adım başlığı", example: "Book & relax" })
  @IsNotEmpty()
  @IsString()
  baslik: string;

  @ApiProperty({
    description: "Adım açıklaması",
    example: "Let each trip be an inspirational journey",
    required: false,
  })
  @IsOptional()
  @IsString()
  aciklama?: string;

  @ApiProperty({
    description: "Görsel URL (light mode)",
    example: "/images/HIW1.png",
    required: false,
  })
  @IsOptional()
  @IsString()
  gorsel_url?: string;

  @ApiProperty({
    description: "Görsel URL (dark mode)",
    required: false,
  })
  @IsOptional()
  @IsString()
  gorsel_url_dark?: string;

  @ApiProperty({ description: "Sıra numarası", example: 1, required: false })
  @IsOptional()
  @IsNumber()
  sira?: number;

  @ApiProperty({ description: "Durum (1: Aktif, 0: Pasif)", example: 1, required: false })
  @IsOptional()
  @IsNumber()
  durum?: number;
}

