import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreatePaylasimSablonDto {
  @ApiProperty({ description: 'Şablon adı', example: 'Varsayılan Şablon' })
  @IsString()
  sablon_adi: string;

  @ApiProperty({ description: 'Açıklama', required: false })
  @IsOptional()
  @IsString()
  aciklama?: string;

  @ApiProperty({ description: 'Arka plan rengi/gradient', example: '#1E40AF' })
  @IsOptional()
  @IsString()
  arka_plan_rengi?: string;

  @ApiProperty({ description: 'Arka plan görsel URL', required: false })
  @IsOptional()
  @IsString()
  arka_plan_gorsel?: string;

  @ApiProperty({ description: 'Logo URL', required: false })
  @IsOptional()
  @IsString()
  logo_url?: string;

  @ApiProperty({ description: 'Logo konumu', required: false })
  @IsOptional()
  @IsString()
  logo_konum?: string;

  @ApiProperty({ description: 'Başlık font', required: false })
  @IsOptional()
  @IsString()
  baslik_font_family?: string;

  @ApiProperty({ description: 'Başlık font boyutu', required: false })
  @IsOptional()
  @IsInt()
  @Min(12)
  baslik_font_size?: number;

  @ApiProperty({ description: 'Başlık rengi', required: false })
  @IsOptional()
  @IsString()
  baslik_renk?: string;

  @ApiProperty({ description: 'Açıklama font', required: false })
  @IsOptional()
  @IsString()
  aciklama_font_family?: string;

  @ApiProperty({ description: 'Açıklama font boyutu', required: false })
  @IsOptional()
  @IsInt()
  @Min(12)
  aciklama_font_size?: number;

  @ApiProperty({ description: 'Açıklama rengi', required: false })
  @IsOptional()
  @IsString()
  aciklama_renk?: string;

  @ApiProperty({ description: 'Genişlik', required: false })
  @IsOptional()
  @IsInt()
  genislik?: number;

  @ApiProperty({ description: 'Yükseklik', required: false })
  @IsOptional()
  @IsInt()
  yukseklik?: number;

  @ApiProperty({ description: 'Şablon JSON', required: false })
  @IsOptional()
  sablon_json?: any;

  @ApiProperty({ description: 'Durum', required: false })
  @IsOptional()
  @IsInt()
  durum?: number;
}



