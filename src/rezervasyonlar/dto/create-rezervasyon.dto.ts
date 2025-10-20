import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RezervasyonDetayDto {
  @ApiProperty({ description: 'Ürün ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  urun_id: number;

  @ApiProperty({ description: 'Miktar (gün/gece/adet)', example: 3 })
  @IsNumber()
  @IsNotEmpty()
  miktar: number;

  @ApiProperty({
    description: 'Rezervasyon bilgileri (tarih, konum vb.)',
    example: {
      giris_tarihi: '2024-12-20',
      cikis_tarihi: '2024-12-25',
      misafir_sayisi: 2,
    },
  })
  @IsObject()
  @IsNotEmpty()
  rezervasyon_bilgileri: Record<string, any>;
}

export class CreateRezervasyonDto {
  @ApiProperty({
    description: 'Rezervasyon detayları',
    type: [RezervasyonDetayDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RezervasyonDetayDto)
  detaylar: RezervasyonDetayDto[];

  @ApiProperty({
    description: 'Ödeme yöntemi',
    example: 'Kredi Kartı',
    required: false,
  })
  @IsString()
  @IsOptional()
  odeme_yontemi?: string;

  @ApiProperty({
    description: 'Müşteri notu',
    example: 'Erken check-in istiyorum',
    required: false,
  })
  @IsString()
  @IsOptional()
  not?: string;
}


