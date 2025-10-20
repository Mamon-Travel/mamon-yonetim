import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  RezervasyonDurumu,
  OdemeDurumu,
} from '../entities/rezervasyonlar.entity';

export class UpdateRezervasyonDto {
  @ApiProperty({
    description: 'Rezervasyon durumu',
    enum: RezervasyonDurumu,
    required: false,
  })
  @IsEnum(RezervasyonDurumu)
  @IsOptional()
  durum?: RezervasyonDurumu;

  @ApiProperty({
    description: 'Ödeme durumu',
    enum: OdemeDurumu,
    required: false,
  })
  @IsEnum(OdemeDurumu)
  @IsOptional()
  odeme_durumu?: OdemeDurumu;

  @ApiProperty({
    description: 'Ödeme yöntemi',
    required: false,
  })
  @IsString()
  @IsOptional()
  odeme_yontemi?: string;

  @ApiProperty({
    description: 'Not',
    required: false,
  })
  @IsString()
  @IsOptional()
  not?: string;
}


