import { IsString, IsInt, IsOptional, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCeviriDto {
  @ApiProperty({ example: 1, description: "Dil ID" })
  @IsInt()
  dil_id: number;

  @ApiProperty({ example: "home.welcome", description: "Çeviri anahtarı" })
  @IsString()
  anahtar: string;

  @ApiProperty({ example: "Hoş Geldiniz", description: "Çeviri değeri" })
  @IsString()
  deger: string;

  @ApiProperty({ example: "home", description: "Kategori", required: false })
  @IsOptional()
  @IsString()
  kategori?: string;

  @ApiProperty({ example: "Anasayfa karşılama mesajı", description: "Açıklama", required: false })
  @IsOptional()
  @IsString()
  aciklama?: string;

  @ApiProperty({ example: 1, description: "Durum (0: Pasif, 1: Aktif)", required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  durum?: number;
}









