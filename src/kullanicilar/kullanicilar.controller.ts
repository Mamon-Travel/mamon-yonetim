import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { KullanicilarService } from './kullanicilar.service';
import { CreateKullanicilarDto } from './dto/create-kullanicilar.dto';
import { UpdateKullanicilarDto } from './dto/update-kullanicilar.dto';
import { Kullanicilar } from './entities/kullanicilar.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { KullaniciTipi } from './enums/kullanici-tipi.enum';

@ApiTags('Kullanıcılar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(KullaniciTipi.YONETICI)
@Controller('kullanicilar')
export class KullanicilarController {
  constructor(private readonly kullanicilarService: KullanicilarService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni kullanıcı oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Kullanıcı başarıyla oluşturuldu',
    type: Kullanicilar,
  })
  @ApiResponse({
    status: 409,
    description: 'Email veya kullanıcı adı zaten kullanılıyor',
  })
  create(
    @Body() createKullanicilarDto: CreateKullanicilarDto,
  ): Promise<Kullanicilar> {
    return this.kullanicilarService.create(createKullanicilarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm kullanıcıları listele' })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcılar listelendi',
    type: [Kullanicilar],
  })
  findAll(): Promise<Kullanicilar[]> {
    return this.kullanicilarService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Kullanıcı detayını getir' })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı detayı',
    type: Kullanicilar,
  })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  findOne(@Param('id') id: string): Promise<Kullanicilar> {
    return this.kullanicilarService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Kullanıcı güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı güncellendi',
    type: Kullanicilar,
  })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  update(
    @Param('id') id: string,
    @Body() updateKullanicilarDto: UpdateKullanicilarDto,
  ): Promise<Kullanicilar> {
    return this.kullanicilarService.update(+id, updateKullanicilarDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Kullanıcı sil' })
  @ApiResponse({ status: 204, description: 'Kullanıcı silindi' })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  remove(@Param('id') id: string): Promise<void> {
    return this.kullanicilarService.remove(+id);
  }
}
