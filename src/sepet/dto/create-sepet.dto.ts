import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateSepetDto {
  @ApiProperty({ description: 'Ürün ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  urunId: number;

  @ApiProperty({ description: 'Miktar', example: 1, default: 1 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  miktar?: number;

  @ApiProperty({
    description: 'Rezervasyon bilgileri (Otel için: giriş/çıkış tarihi, misafir sayısı vb.)',
    example: {
      giris_tarihi: '2024-01-15',
      cikis_tarihi: '2024-01-20',
      misafir_sayisi: 2,
      konum: 'İstanbul'
    },
    required: false
  })
  @IsOptional()
  rezervasyonBilgileri?: any;
}


