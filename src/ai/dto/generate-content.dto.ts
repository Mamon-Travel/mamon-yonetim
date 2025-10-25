import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class GenerateContentDto {
  @ApiProperty({
    description: 'İçerik oluşturmak için prompt',
    example: 'Antalya\'da deniz kenarında 5 yıldızlı bir otel için kısa açıklama yaz',
  })
  @IsNotEmpty({ message: 'Prompt boş olamaz' })
  @IsString({ message: 'Prompt metin olmalıdır' })
  prompt: string;

  @ApiProperty({
    description: 'Ek bağlam bilgisi',
    example: 'Otel adı: Luxury Beach Hotel, Konsept: Her Şey Dahil',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Bağlam metin olmalıdır' })
  context?: string;
}

