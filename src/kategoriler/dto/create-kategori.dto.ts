import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from "class-validator";

export class CreateKategoriDto {
  @ApiProperty({ description: "Hizmet ID", example: 1 })
  @IsNotEmpty()
  @IsNumber()
  hizmet_id: number;

  @ApiProperty({ description: "Kategori adı", example: "New York, USA" })
  @IsNotEmpty()
  @IsString()
  ad: string;

  @ApiProperty({ description: "URL slug", example: "new-york-usa" })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({
    description: "Bölge/Region",
    example: "United States",
    required: false,
  })
  @IsOptional()
  @IsString()
  bolge?: string;

  @ApiProperty({ description: "İlan sayısı", example: 5000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  adet?: number;

  @ApiProperty({
    description: "Açıklama",
    example: "Explore the Big Apple",
    required: false,
  })
  @IsOptional()
  @IsString()
  aciklama?: string;

  @ApiProperty({
    description: "Thumbnail URL",
    example: "https://example.com/image.jpg",
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({
    description: "Kapak görseli URL",
    required: false,
  })
  @IsOptional()
  @IsString()
  kapak_gorseli?: string;

  @ApiProperty({ description: "Sıra numarası", example: 1, required: false })
  @IsOptional()
  @IsNumber()
  sira?: number;

  @ApiProperty({
    description: "Durum (1: Aktif, 0: Pasif)",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  durum?: number;
}

