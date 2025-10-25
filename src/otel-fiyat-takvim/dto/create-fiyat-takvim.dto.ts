import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsDateString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateFiyatTakvimDto {
  @ApiProperty({ description: 'Oda tipi ID', example: 1 })
  @IsInt()
  oda_tipi_id: number;

  @ApiProperty({ description: 'Pansiyon tipi ID', required: false })
  @IsOptional()
  @IsInt()
  pansiyon_tipi_id?: number;

  @ApiProperty({ description: 'Başlangıç tarihi', example: '2024-12-01' })
  @IsDateString()
  baslangic_tarihi: string;

  @ApiProperty({ description: 'Bitiş tarihi', example: '2024-12-31' })
  @IsDateString()
  bitis_tarihi: string;

  @ApiProperty({ description: 'Gecelik fiyat', example: 1500.00 })
  @IsNumber()
  @Min(0)
  fiyat: number;

  @ApiProperty({
    description: 'Minimum konaklama gece sayısı',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  min_konaklama_gece?: number;

  @ApiProperty({
    description: 'Maksimum konaklama gece sayısı',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  max_konaklama_gece?: number;

  @ApiProperty({
    description: 'Özel dönem adı',
    example: 'Yılbaşı Kampanyası',
    required: false,
  })
  @IsOptional()
  @IsString()
  ozel_donem_adi?: string;

  @ApiProperty({ description: 'Durum', default: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  durum?: number;
}

