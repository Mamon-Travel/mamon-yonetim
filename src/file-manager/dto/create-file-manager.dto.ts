import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateFileManagerDto {
  @ApiProperty({ description: 'Dosya adı' })
  @IsString()
  @IsNotEmpty()
  dosya_adi: string;

  @ApiProperty({ description: 'Orijinal dosya adı' })
  @IsString()
  @IsNotEmpty()
  orijinal_dosya_adi: string;

  @ApiProperty({ description: 'Dosya yolu' })
  @IsString()
  @IsNotEmpty()
  dosya_yolu: string;

  @ApiProperty({ description: 'Dosya tipi (MIME type)' })
  @IsString()
  @IsNotEmpty()
  dosya_tipi: string;

  @ApiProperty({ description: 'Dosya boyutu (byte)' })
  @IsNumber()
  @IsNotEmpty()
  dosya_boyutu: number;

  @ApiProperty({ description: 'Dosya kategorisi' })
  @IsString()
  @IsNotEmpty()
  kategori: string;

  @ApiProperty({ description: 'Dosya açıklaması', required: false })
  @IsString()
  @IsOptional()
  aciklama?: string;

  @ApiProperty({ description: 'Dosya etiketleri', required: false })
  @IsString()
  @IsOptional()
  etiketler?: string;

  @ApiProperty({ description: 'Yükleyen kullanıcı ID' })
  @IsNumber()
  @IsNotEmpty()
  yukleyen_kullanici_id: number;
}

