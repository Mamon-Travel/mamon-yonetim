import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";

export class CreateFooterMenuDto {
  @ApiProperty({ description: "Kategori", example: "solutions" })
  @IsNotEmpty()
  @IsString()
  kategori: string;

  @ApiProperty({ description: "Başlık", example: "Marketing" })
  @IsNotEmpty()
  @IsString()
  baslik: string;

  @ApiProperty({ description: "URL", example: "#" })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({ description: "Sıra", example: 1, required: false })
  @IsOptional()
  @IsNumber()
  sira?: number;

  @ApiProperty({ description: "Durum", example: 1, required: false })
  @IsOptional()
  @IsNumber()
  durum?: number;
}

