import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, IsOptional, Min } from "class-validator";

export class CreateAnamenuAltDto {
  @ApiProperty({ description: "Menü başlığı", example: "Kullanıcılar" })
  @IsString()
  baslik: string;

  @ApiProperty({ description: "Anamenu ID", example: 1 })
  @IsInt()
  @Min(1)
  anamenu_id: number;

  @ApiProperty({ description: "Rota bilgisi", example: "/yonetim/kullanicilar/liste" })
  @IsString()
  rota: string;

  @ApiProperty({
    description: "İkon adı",
    example: "list",
    required: false,
  })
  @IsOptional()
  @IsString()
  ikon?: string;

  @ApiProperty({
    description: "Sıra numarası",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  sira?: number;

  @ApiProperty({
    description: "Yetki ID'leri (virgülle ayrılmış)",
    example: "1,2,3",
    required: false,
  })
  @IsOptional()
  @IsString()
  yetki_ids?: string;

  @ApiProperty({
    description: "Durum (1: Aktif, 0: Pasif)",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  durum?: number;
}

