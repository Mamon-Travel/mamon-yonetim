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
import { DinamikSayfalarService } from './dinamik-sayfalar.service';
import { CreateDinamikSayfaDto } from './dto/create-dinamik-sayfa.dto';
import { UpdateDinamikSayfaDto } from './dto/update-dinamik-sayfa.dto';
import { DinamikSayfa } from './entities/dinamik-sayfa.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Dinamik Sayfalar')
@Controller('dinamik-sayfalar')
export class DinamikSayfalarController {
  constructor(private readonly dinamikSayfalarService: DinamikSayfalarService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Yeni dinamik sayfa oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Sayfa başarıyla oluşturuldu',
    type: DinamikSayfa,
  })
  create(@Body() createDto: CreateDinamikSayfaDto): Promise<DinamikSayfa> {
    return this.dinamikSayfalarService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm dinamik sayfaları listele' })
  @ApiResponse({
    status: 200,
    description: 'Sayfalar listelendi',
    type: [DinamikSayfa],
  })
  findAll(): Promise<DinamikSayfa[]> {
    return this.dinamikSayfalarService.findAll();
  }

  @Get('aktif')
  @ApiOperation({ summary: 'Aktif sayfaları listele' })
  @ApiResponse({
    status: 200,
    description: 'Aktif sayfalar listelendi',
    type: [DinamikSayfa],
  })
  findActive(): Promise<DinamikSayfa[]> {
    return this.dinamikSayfalarService.findActive();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Slug ile sayfa getir' })
  @ApiResponse({
    status: 200,
    description: 'Sayfa detayı',
    type: DinamikSayfa,
  })
  @ApiResponse({ status: 404, description: 'Sayfa bulunamadı' })
  findBySlug(@Param('slug') slug: string): Promise<DinamikSayfa> {
    return this.dinamikSayfalarService.findBySlug(slug);
  }

  @Get('slug/:slug/oteller')
  @ApiOperation({ summary: 'Slug ile sayfanın filtreli otellerini getir (Site için)' })
  @ApiResponse({
    status: 200,
    description: 'Sayfa ve oteller',
  })
  async getOtellerBySlug(@Param('slug') slug: string) {
    return this.dinamikSayfalarService.getOtellerBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Sayfa detayını getir' })
  @ApiResponse({
    status: 200,
    description: 'Sayfa detayı',
    type: DinamikSayfa,
  })
  @ApiResponse({ status: 404, description: 'Sayfa bulunamadı' })
  findOne(@Param('id') id: string): Promise<DinamikSayfa> {
    return this.dinamikSayfalarService.findOne(+id);
  }

  @Get(':id/oteller')
  @ApiOperation({ summary: 'Sayfanın filtreli otellerini getir' })
  @ApiResponse({
    status: 200,
    description: 'Oteller listelendi',
  })
  getOtellerByFiltre(@Param('id') id: string) {
    return this.dinamikSayfalarService.getOtellerByFiltre(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Sayfa güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Sayfa güncellendi',
    type: DinamikSayfa,
  })
  @ApiResponse({ status: 404, description: 'Sayfa bulunamadı' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDinamikSayfaDto,
  ): Promise<DinamikSayfa> {
    return this.dinamikSayfalarService.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Sayfa sil' })
  @ApiResponse({ status: 204, description: 'Sayfa silindi' })
  @ApiResponse({ status: 404, description: 'Sayfa bulunamadı' })
  remove(@Param('id') id: string): Promise<void> {
    return this.dinamikSayfalarService.remove(+id);
  }
}

