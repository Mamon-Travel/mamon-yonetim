import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateIptalPolitikaDto {
  @ApiProperty({ description: 'Otel ID', example: 1 })
  @IsInt()
  otel_id: number;

  @ApiProperty({ description: 'Politika adı', example: 'Ücretsiz İptal' })
  @IsString()
  ad: string;

  @ApiProperty({
    description: 'Kaç gün öncesine kadar geçerli',
    example: 7,
  })
  @IsInt()
  @Min(0)
  gun_oncesi: number;

  @ApiProperty({
    description: 'Geri ödeme yüzdesi',
    example: 100,
    default: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  iade_orani?: number;

  @ApiProperty({ description: 'Açıklama', required: false })
  @IsOptional()
  @IsString()
  aciklama?: string;

  @ApiProperty({ description: 'Sıra', required: false, default: 0 })
  @IsOptional()
  @IsInt()
  sira?: number;

  @ApiProperty({ description: 'Durum', default: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  durum?: number;
}

