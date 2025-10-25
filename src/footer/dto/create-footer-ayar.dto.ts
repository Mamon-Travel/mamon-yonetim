import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateFooterAyarDto {
  @ApiProperty({ description: "Anahtar", example: "about_text" })
  @IsNotEmpty()
  @IsString()
  anahtar: string;

  @ApiProperty({ description: "Değer", required: false })
  @IsOptional()
  @IsString()
  deger?: string;

  @ApiProperty({ description: "Tip", example: "text", required: false })
  @IsOptional()
  @IsString()
  tip?: string;

  @ApiProperty({ description: "Açıklama", required: false })
  @IsOptional()
  @IsString()
  aciklama?: string;
}

