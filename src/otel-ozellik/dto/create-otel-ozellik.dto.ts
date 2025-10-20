import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class CreateOtelOzellikDto {
  @ApiProperty({ description: "Özellik başlığı", example: "Ücretsiz Wi-Fi" })
  @IsString()
  @IsNotEmpty()
  baslik: string;

  @ApiProperty({
    description: "Özellik açıklaması",
    example: "Tüm otel genelinde ücretsiz internet",
    required: false,
  })
  @IsString()
  @IsOptional()
  aciklama?: string;

  @ApiProperty({
    description: "İkon adı",
    example: "wifi",
    required: false,
  })
  @IsString()
  @IsOptional()
  ikon?: string;

  @ApiProperty({
    description: "Sıralama",
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  sira?: number;

  @ApiProperty({
    description: "Durum (1: Aktif, 0: Pasif)",
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  durum?: number;
}

