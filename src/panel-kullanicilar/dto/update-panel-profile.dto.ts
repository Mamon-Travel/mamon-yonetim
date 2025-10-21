import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdatePanelProfileDto {
  @ApiProperty({ description: 'Ad', required: false })
  @IsString()
  @IsOptional()
  ad?: string;

  @ApiProperty({ description: 'Soyad', required: false })
  @IsString()
  @IsOptional()
  soyad?: string;

  @ApiProperty({ description: 'E-posta', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Telefon', required: false })
  @IsString()
  @IsOptional()
  telefon?: string;

  @ApiProperty({ description: 'Profil resmi URL', required: false })
  @IsString()
  @IsOptional()
  resim?: string;

  @ApiProperty({ description: 'Mevcut şifre', required: false })
  @IsString()
  @IsOptional()
  mevcutSifre?: string;

  @ApiProperty({
    description: 'Yeni şifre (min 6 karakter)',
    required: false,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  yeniSifre?: string;
}




