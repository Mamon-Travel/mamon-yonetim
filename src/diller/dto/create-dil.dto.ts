import { IsString, IsBoolean, IsOptional, IsInt, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDilDto {
  @ApiProperty({ example: "ja", description: "Dil kodu (ISO 639-1)" })
  @IsString()
  kod: string;

  @ApiProperty({ example: "Japonca", description: "Dil adı (Türkçe)" })
  @IsString()
  ad: string;

  @ApiProperty({ example: "日本語", description: "Dil adı (kendi dilinde)", required: false })
  @IsOptional()
  @IsString()
  yerel_ad?: string;

  @ApiProperty({ example: false, description: "Varsayılan dil mi?", required: false })
  @IsOptional()
  @IsBoolean()
  varsayilan?: boolean;

  @ApiProperty({ example: 1, description: "Durum (0: Pasif, 1: Aktif)", required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  durum?: number;
}

