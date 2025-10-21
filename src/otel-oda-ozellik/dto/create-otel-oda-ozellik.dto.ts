import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class CreateOtelOdaOzellikDto {
  @ApiProperty({ description: "Özellik başlığı", example: "Klima" })
  @IsString()
  @IsNotEmpty()
  baslik: string;

  @ApiProperty({
    description: "Özellik açıklaması",
    example: "Soğutma ve ısıtma sistemi",
    required: false,
  })
  @IsString()
  @IsOptional()
  aciklama?: string;

  @ApiProperty({
    description: "İkon adı",
    example: "ac",
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


