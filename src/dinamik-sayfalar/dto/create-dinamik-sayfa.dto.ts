import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsObject } from 'class-validator';
import type { FiltrKriterleri } from '../entities/dinamik-sayfa.entity';

export class CreateDinamikSayfaDto {
  @ApiProperty({ description: 'Sayfa başlığı', example: 'Akdeniz Otelleri' })
  @IsNotEmpty({ message: 'Başlık boş olamaz' })
  @IsString()
  baslik: string;

  @ApiProperty({ description: 'URL slug', example: 'akdeniz-otelleri' })
  @IsNotEmpty({ message: 'Slug boş olamaz' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Sayfa açıklaması', required: false })
  @IsOptional()
  @IsString()
  aciklama?: string;

  @ApiProperty({
    description: 'Filtre kriterleri (JSON)',
    example: {
      bolgeler: ['Antalya', 'Muğla'],
      yildiz: [4, 5],
      ozellikler: [1, 2, 3],
      min_fiyat: 1000,
      max_fiyat: 5000,
    },
  })
  @IsNotEmpty({ message: 'Filtre kriterleri boş olamaz' })
  @IsObject()
  filtre_kriterleri: FiltrKriterleri;

  @ApiProperty({ description: 'Meta title (SEO)', required: false })
  @IsOptional()
  @IsString()
  meta_title?: string;

  @ApiProperty({ description: 'Meta description (SEO)', required: false })
  @IsOptional()
  @IsString()
  meta_description?: string;

  @ApiProperty({ description: 'Meta keywords (SEO)', required: false })
  @IsOptional()
  @IsString()
  meta_keywords?: string;

  @ApiProperty({ description: 'Kapak görseli URL', required: false })
  @IsOptional()
  @IsString()
  kapak_gorseli?: string;

  @ApiProperty({ description: 'Sıralama', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  sira?: number;

  @ApiProperty({ description: 'Durum (0: Pasif, 1: Aktif)', required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  durum?: number;

  @ApiProperty({ description: 'Üst içerik (sayfa başında)', required: false })
  @IsOptional()
  @IsString()
  ust_icerik?: string;

  @ApiProperty({ description: 'Alt içerik (sayfa sonunda)', required: false })
  @IsOptional()
  @IsString()
  alt_icerik?: string;
}

