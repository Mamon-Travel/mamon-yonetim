import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ description: 'Alt menü adı', example: 'Kullanıcı Listesi' })
  @IsString()
  @IsNotEmpty()
  menu: string;

  @ApiProperty({ description: 'Anamenu Alt ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  anamenu_alt_id: number;

  @ApiProperty({
    description: 'Rota bilgisi',
    example: '/yonetim/kullanicilar',
  })
  @IsString()
  @IsNotEmpty()
  rota: string;

  @ApiProperty({ description: 'İkon adı', example: 'PiUsers', required: false })
  @IsString()
  @IsOptional()
  ikon?: string;

  @ApiProperty({ description: 'Sıra numarası', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  sira?: number;

  @ApiProperty({
    description: "Yetki ID'leri (virgülle ayrılmış)",
    example: '1,3,6',
    required: false,
  })
  @IsString()
  @IsOptional()
  yetki_ids?: string;
}
