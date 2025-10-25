import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsOptional, Min } from 'class-validator';

export class CreateDovizKurDto {
  @ApiProperty({ description: 'Para birimi kodu', example: 'USD' })
  @IsString()
  para_birimi: string;

  @ApiProperty({ description: 'Para adı', example: 'Amerikan Doları' })
  @IsString()
  para_adi: string;

  @ApiProperty({ description: 'TCMB alış kuru', example: 34.20 })
  @IsNumber()
  @Min(0)
  tcmb_alis: number;

  @ApiProperty({ description: 'TCMB satış kuru', example: 34.35 })
  @IsNumber()
  @Min(0)
  tcmb_satis: number;

  @ApiProperty({ description: 'Marj yüzdesi', example: 2.5, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  yuzde_marj?: number;

  @ApiProperty({ description: 'Kur tarihi', example: '2024-10-24' })
  @IsDateString()
  kur_tarihi: string;

  @ApiProperty({ description: 'Durum', default: 1, required: false })
  @IsOptional()
  @IsNumber()
  durum?: number;
}

