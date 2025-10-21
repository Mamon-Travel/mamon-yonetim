import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Kullanıcı adı veya e-posta',
    example: 'barisgul',
  })
  @IsString()
  @IsNotEmpty()
  kullanici_adi: string;

  @ApiProperty({ description: 'Şifre', example: '123456' })
  @IsString()
  @IsNotEmpty()
  sifre: string;
}







