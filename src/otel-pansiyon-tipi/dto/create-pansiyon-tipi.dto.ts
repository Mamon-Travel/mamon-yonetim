import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreatePansiyonTipiDto {
  @ApiProperty({ description: 'Pansiyon kodu (RO, BB, HB, FB, AI, UAI)', example: 'AI' })
  @IsString()
  kod: string;

  @ApiProperty({ description: 'Pansiyon adı', example: 'Her Şey Dahil' })
  @IsString()
  ad: string;

  @ApiProperty({ description: 'Açıklama', required: false })
  @IsOptional()
  @IsString()
  aciklama?: string;

  @ApiProperty({ description: 'Sıra', required: false, default: 0 })
  @IsOptional()
  @IsInt()
  sira?: number;

  @ApiProperty({ description: 'Durum (1: Aktif, 0: Pasif)', required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  durum?: number;
}

