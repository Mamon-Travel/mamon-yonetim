import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginPanelKullaniciDto {
  @ApiProperty({
    description: 'Kullanıcı adı veya e-posta',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  kullanici_adi: string;

  @ApiProperty({ description: 'Şifre', example: '123456' })
  @IsString()
  @IsNotEmpty()
  sifre: string;
}



