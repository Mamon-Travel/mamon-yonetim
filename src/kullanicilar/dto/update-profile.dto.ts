import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ description: 'Ad', example: 'Barış', required: false })
  @IsString()
  @IsOptional()
  ad?: string;

  @ApiProperty({ description: 'Soyad', example: 'Gül', required: false })
  @IsString()
  @IsOptional()
  soyad?: string;

  @ApiProperty({
    description: 'E-posta',
    example: 'baris@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Telefon',
    example: '0532 123 45 67',
    required: false,
  })
  @IsString()
  @IsOptional()
  telefon?: string;

  @ApiProperty({
    description: 'Profil resmi URL',
    example: '/uploads/avatar.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  resim?: string;

  @ApiProperty({
    description: 'Mevcut şifre (şifre değiştirilecekse zorunlu)',
    required: false,
  })
  @IsString()
  @IsOptional()
  mevcutSifre?: string;

  @ApiProperty({
    description: 'Yeni şifre (min 6 karakter)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  yeniSifre?: string;
}

