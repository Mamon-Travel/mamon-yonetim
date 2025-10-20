import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UploadGorselDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  otel_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  gorsel_url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  baslik?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  sira?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gorsel_tipi?: string;
}

