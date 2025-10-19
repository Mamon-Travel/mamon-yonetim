import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UrunlerService } from './urunler.service';
import { CreateUrunlerDto } from './dto/create-urunler.dto';
import { UpdateUrunlerDto } from './dto/update-urunler.dto';
import { Urunler } from './entities/urunler.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { KullaniciTipi } from '../kullanicilar/enums/kullanici-tipi.enum';

@ApiTags('Ürünler')
@Controller('urunler')
export class UrunlerController {
  constructor(private readonly urunlerService: UrunlerService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(KullaniciTipi.YONETICI)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni ürün oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Ürün başarıyla oluşturuldu',
    type: Urunler,
  })
  create(@Body() createUrunlerDto: CreateUrunlerDto): Promise<Urunler> {
    return this.urunlerService.create(createUrunlerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm ürünleri listele' })
  @ApiQuery({
    name: 'hizmetId',
    required: false,
    description: 'Belirli bir hizmete ait ürünleri filtrele',
  })
  @ApiResponse({
    status: 200,
    description: 'Ürünler listelendi',
    type: [Urunler],
  })
  findAll(@Query('hizmetId') hizmetId?: number): Promise<Urunler[]> {
    return this.urunlerService.findAll(hizmetId);
  }

  @Get('hizmet/:hizmetId')
  @ApiOperation({ summary: 'Belirli bir hizmetin ürünlerini listele' })
  @ApiResponse({
    status: 200,
    description: 'Hizmet ürünleri listelendi',
    type: [Urunler],
  })
  findByHizmet(@Param('hizmetId') hizmetId: string): Promise<Urunler[]> {
    return this.urunlerService.findByHizmet(+hizmetId);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Slug ile ürün getir' })
  @ApiResponse({ status: 200, description: 'Ürün bulundu', type: Urunler })
  @ApiResponse({ status: 404, description: 'Ürün bulunamadı' })
  findBySlug(@Param('slug') slug: string): Promise<Urunler> {
    return this.urunlerService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ürün detayını getir' })
  @ApiResponse({
    status: 200,
    description: 'Ürün detayı',
    type: Urunler,
  })
  @ApiResponse({ status: 404, description: 'Ürün bulunamadı' })
  findOne(@Param('id') id: string): Promise<Urunler> {
    return this.urunlerService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(KullaniciTipi.YONETICI)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ürün güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Ürün güncellendi',
    type: Urunler,
  })
  @ApiResponse({ status: 404, description: 'Ürün bulunamadı' })
  update(
    @Param('id') id: string,
    @Body() updateUrunlerDto: UpdateUrunlerDto,
  ): Promise<Urunler> {
    return this.urunlerService.update(+id, updateUrunlerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(KullaniciTipi.YONETICI)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Ürün sil' })
  @ApiResponse({ status: 204, description: 'Ürün silindi' })
  @ApiResponse({ status: 404, description: 'Ürün bulunamadı' })
  remove(@Param('id') id: string): Promise<void> {
    return this.urunlerService.remove(+id);
  }
}

