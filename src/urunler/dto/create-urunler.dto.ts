import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsObject,
  IsArray,
  Min,
} from 'class-validator';
import { FiyatTipi, StokDurumu } from '../entities/urunler.entity';

export class CreateUrunlerDto {
  @ApiProperty({ description: 'Hizmet ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  hizmet_id: number;

  @ApiProperty({ description: 'Ürün başlığı', example: 'Deluxe Oda' })
  @IsString()
  @IsNotEmpty()
  baslik: string;

  @ApiProperty({
    description: 'Ürün açıklaması',
    example: 'Geniş ve konforlu oda',
    required: false,
  })
  @IsString()
  @IsOptional()
  aciklama?: string;

  @ApiProperty({
    description: 'Ana resim URL',
    example: '/uploads/room.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  ana_resim?: string;

  @ApiProperty({
    description: 'Diğer resimler',
    example: ['/uploads/room1.jpg', '/uploads/room2.jpg'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  resimler?: string[];

  @ApiProperty({ description: 'Fiyat', example: 850.0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  fiyat: number;

  @ApiProperty({
    description: 'Para birimi',
    example: 'TRY',
    required: false,
  })
  @IsString()
  @IsOptional()
  fiyat_birimi?: string;

  @ApiProperty({
    description: 'Fiyatlandırma tipi',
    enum: FiyatTipi,
    example: FiyatTipi.GUNLUK,
    required: false,
  })
  @IsEnum(FiyatTipi)
  @IsOptional()
  fiyat_tipi?: FiyatTipi;

  @ApiProperty({
    description: 'Stok durumu',
    enum: StokDurumu,
    example: StokDurumu.MEVCUT,
    required: false,
  })
  @IsEnum(StokDurumu)
  @IsOptional()
  stok_durumu?: StokDurumu;

  @ApiProperty({
    description: 'Ürün özellikleri (dinamik)',
    example: {
      konum: 'İstanbul',
      kapasite: 2,
      yatak: 'Çift kişilik',
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  ozellikler?: Record<string, any>;

  @ApiProperty({
    description: 'Durum (1: Aktif, 0: Pasif)',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  durum?: number;
}


