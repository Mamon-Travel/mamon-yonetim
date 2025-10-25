import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { OtelFiyatTakvimService } from './otel-fiyat-takvim.service';
import { CreateFiyatTakvimDto } from './dto/create-fiyat-takvim.dto';
import { UpdateFiyatTakvimDto } from './dto/update-fiyat-takvim.dto';
import { OtelFiyatTakvim } from './entities/otel-fiyat-takvim.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Otel Fiyat Takvimi')
@Controller('otel-fiyat-takvim')
export class OtelFiyatTakvimController {
  constructor(private readonly fiyatTakvimService: OtelFiyatTakvimService) {}

  @Get()
  @ApiOperation({ summary: 'Tüm fiyat takvimlerini listele' })
  @ApiResponse({
    status: 200,
    description: 'Fiyat takvimleri listelendi',
    type: [OtelFiyatTakvim],
  })
  findAll(): Promise<OtelFiyatTakvim[]> {
    return this.fiyatTakvimService.findAll();
  }

  @Get('oda-tipi/:odaTipiId')
  @ApiOperation({ summary: 'Oda tipine göre fiyat takvimlerini getir' })
  @ApiResponse({
    status: 200,
    description: 'Fiyat takvimleri bulundu',
    type: [OtelFiyatTakvim],
  })
  findByOdaTipi(@Param('odaTipiId') odaTipiId: string): Promise<OtelFiyatTakvim[]> {
    return this.fiyatTakvimService.findByOdaTipi(+odaTipiId);
  }

  @Get('otel/:otelId')
  @ApiOperation({ summary: 'Otele göre tüm oda tipi fiyat takvimlerini getir' })
  @ApiResponse({
    status: 200,
    description: 'Otel fiyat takvimleri bulundu',
    type: [OtelFiyatTakvim],
  })
  findByOtelId(@Param('otelId') otelId: string): Promise<OtelFiyatTakvim[]> {
    return this.fiyatTakvimService.findByOtelId(+otelId);
  }

  @Get('tarih-aralik')
  @ApiOperation({ summary: 'Tarih aralığına göre fiyat takvimlerini getir' })
  @ApiQuery({ name: 'odaTipiId', required: true })
  @ApiQuery({ name: 'baslangicTarihi', required: true, example: '2024-12-01' })
  @ApiQuery({ name: 'bitisTarihi', required: true, example: '2024-12-31' })
  @ApiResponse({
    status: 200,
    description: 'Tarih aralığındaki fiyatlar bulundu',
    type: [OtelFiyatTakvim],
  })
  findByDateRange(
    @Query('odaTipiId') odaTipiId: string,
    @Query('baslangicTarihi') baslangicTarihi: string,
    @Query('bitisTarihi') bitisTarihi: string,
  ): Promise<OtelFiyatTakvim[]> {
    return this.fiyatTakvimService.findByDateRange(
      +odaTipiId,
      baslangicTarihi,
      bitisTarihi,
    );
  }

  @Get('fiyat-hesapla')
  @ApiOperation({ summary: 'Toplam fiyat hesapla' })
  @ApiQuery({ name: 'odaTipiId', required: true })
  @ApiQuery({ name: 'girisTarihi', required: true, example: '2024-12-20' })
  @ApiQuery({ name: 'cikisTarihi', required: true, example: '2024-12-25' })
  @ApiQuery({ name: 'pansiyonTipiId', required: false })
  @ApiResponse({
    status: 200,
    description: 'Toplam fiyat hesaplandı',
    schema: {
      example: {
        toplam_fiyat: 7500,
        gece_sayisi: 5,
        gunluk_fiyatlar: [
          { tarih: '2024-12-20', fiyat: 1500 },
          { tarih: '2024-12-21', fiyat: 1500 },
        ],
      },
    },
  })
  calculateTotalPrice(
    @Query('odaTipiId') odaTipiId: string,
    @Query('girisTarihi') girisTarihi: string,
    @Query('cikisTarihi') cikisTarihi: string,
    @Query('pansiyonTipiId') pansiyonTipiId?: string,
  ): Promise<{ toplam_fiyat: number; gece_sayisi: number; gunluk_fiyatlar: any[] }> {
    return this.fiyatTakvimService.calculateTotalPrice(
      +odaTipiId,
      girisTarihi,
      cikisTarihi,
      pansiyonTipiId ? +pansiyonTipiId : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fiyat takvimini getir' })
  @ApiResponse({
    status: 200,
    description: 'Fiyat takvimi bulundu',
    type: OtelFiyatTakvim,
  })
  findOne(@Param('id') id: string): Promise<OtelFiyatTakvim> {
    return this.fiyatTakvimService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni fiyat takvimi ekle' })
  @ApiResponse({
    status: 201,
    description: 'Fiyat takvimi oluşturuldu',
    type: OtelFiyatTakvim,
  })
  create(
    @Body() createFiyatTakvimDto: CreateFiyatTakvimDto,
  ): Promise<OtelFiyatTakvim> {
    return this.fiyatTakvimService.create(createFiyatTakvimDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fiyat takvimini güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Fiyat takvimi güncellendi',
    type: OtelFiyatTakvim,
  })
  update(
    @Param('id') id: string,
    @Body() updateFiyatTakvimDto: UpdateFiyatTakvimDto,
  ): Promise<OtelFiyatTakvim> {
    return this.fiyatTakvimService.update(+id, updateFiyatTakvimDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fiyat takvimini sil' })
  @ApiResponse({
    status: 200,
    description: 'Fiyat takvimi silindi',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.fiyatTakvimService.remove(+id);
  }
}

