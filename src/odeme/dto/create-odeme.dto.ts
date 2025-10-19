import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateOdemeDto {
  @ApiProperty({ 
    description: 'Ödeme tutarı', 
    example: 1500.00,
    required: false,
    type: Number 
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  tutar?: number;

  @ApiProperty({ 
    description: 'Para birimi', 
    example: 'TRY',
    default: 'TRY' 
  })
  @IsOptional()
  @IsString()
  paraBirimi?: string;

  @ApiProperty({ 
    description: 'Taksit sayısı', 
    example: 1,
    default: 1 
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  taksitSayisi?: number;

  @ApiProperty({
    description: 'Sepetten mi yoksa doğrudan rezervasyon mu?',
    example: 'sepet',
    enum: ['sepet', 'rezervasyon']
  })
  @IsNotEmpty()
  @IsString()
  kaynak: 'sepet' | 'rezervasyon';

  @ApiProperty({
    description: 'Eğer kaynak rezervasyon ise rezervasyon ID',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  rezervasyonId?: number;
}

