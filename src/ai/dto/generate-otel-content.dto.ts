import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export enum ContentType {
  KISA_ACIKLAMA = 'kisa_aciklama',
  UZUN_ACIKLAMA = 'uzun_aciklama',
  META_ACIKLAMA = 'meta_aciklama',
}

export class GenerateOtelContentDto {
  @ApiProperty({
    description: 'Otel adı',
    example: 'Luxury Beach Hotel',
  })
  @IsNotEmpty({ message: 'Otel adı boş olamaz' })
  @IsString({ message: 'Otel adı metin olmalıdır' })
  otelAdi: string;

  @ApiProperty({
    description: 'Otel yıldız sayısı',
    example: 5,
  })
  @IsNotEmpty({ message: 'Yıldız sayısı boş olamaz' })
  @IsNumber({}, { message: 'Yıldız sayısı rakam olmalıdır' })
  yildiz: number;

  @ApiProperty({
    description: 'Otel konsepti',
    example: 'Her Şey Dahil',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Konsept metin olmalıdır' })
  konsept?: string;

  @ApiProperty({
    description: 'Şehir',
    example: 'Antalya',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Şehir metin olmalıdır' })
  sehir?: string;

  @ApiProperty({
    description: 'Bölge',
    example: 'Belek',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Bölge metin olmalıdır' })
  bolge?: string;

  @ApiProperty({
    description: 'İçerik tipi',
    enum: ContentType,
    example: ContentType.KISA_ACIKLAMA,
  })
  @IsNotEmpty({ message: 'İçerik tipi boş olamaz' })
  @IsEnum(ContentType, { message: 'Geçersiz içerik tipi' })
  contentType: ContentType;
}

