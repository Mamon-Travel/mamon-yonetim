import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsDateString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateStokTakvimDto {
  @ApiProperty({ description: 'Oda tipi ID', example: 1 })
  @IsInt()
  oda_tipi_id: number;

  @ApiProperty({ description: 'Tarih', example: '2024-12-25' })
  @IsDateString()
  tarih: string;

  @ApiProperty({ description: 'Toplam oda sayısı', example: 10 })
  @IsInt()
  @Min(0)
  toplam_oda: number;

  @ApiProperty({ description: 'Rezerve oda sayısı', default: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  rezerve_oda?: number;

  @ApiProperty({ description: 'Bloke oda sayısı', default: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  bloke_oda?: number;

  @ApiProperty({ description: 'Notlar', required: false })
  @IsOptional()
  @IsString()
  notlar?: string;
}

