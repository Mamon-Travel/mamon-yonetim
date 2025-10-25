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
import { OtelStokTakvimService } from './otel-stok-takvim.service';
import { CreateStokTakvimDto } from './dto/create-stok-takvim.dto';
import { UpdateStokTakvimDto } from './dto/update-stok-takvim.dto';
import { OtelStokTakvim } from './entities/otel-stok-takvim.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Otel Stok Takvimi')
@Controller('otel-stok-takvim')
export class OtelStokTakvimController {
  constructor(private readonly stokTakvimService: OtelStokTakvimService) {}

  @Get()
  @ApiOperation({ summary: 'Tüm stok takvimlerini listele' })
  @ApiResponse({
    status: 200,
    description: 'Stok takvimleri listelendi',
    type: [OtelStokTakvim],
  })
  findAll(): Promise<OtelStokTakvim[]> {
    return this.stokTakvimService.findAll();
  }

  @Get('oda-tipi/:odaTipiId')
  @ApiOperation({ summary: 'Oda tipine göre stok takvimlerini getir' })
  @ApiResponse({
    status: 200,
    description: 'Stok takvimleri bulundu',
    type: [OtelStokTakvim],
  })
  findByOdaTipi(@Param('odaTipiId') odaTipiId: string): Promise<OtelStokTakvim[]> {
    return this.stokTakvimService.findByOdaTipi(+odaTipiId);
  }

  @Get('otel/:otelId')
  @ApiOperation({ summary: 'Otele göre tüm oda tipi stok takvimlerini getir' })
  @ApiResponse({
    status: 200,
    description: 'Otel stok takvimleri bulundu',
    type: [OtelStokTakvim],
  })
  findByOtelId(@Param('otelId') otelId: string): Promise<OtelStokTakvim[]> {
    return this.stokTakvimService.findByOtelId(+otelId);
  }

  @Get('tarih-aralik')
  @ApiOperation({ summary: 'Tarih aralığına göre stok takvimlerini getir' })
  @ApiQuery({ name: 'odaTipiId', required: true })
  @ApiQuery({ name: 'baslangicTarihi', required: true, example: '2024-12-01' })
  @ApiQuery({ name: 'bitisTarihi', required: true, example: '2024-12-31' })
  @ApiResponse({
    status: 200,
    description: 'Tarih aralığındaki stoklar bulundu',
    type: [OtelStokTakvim],
  })
  findByDateRange(
    @Query('odaTipiId') odaTipiId: string,
    @Query('baslangicTarihi') baslangicTarihi: string,
    @Query('bitisTarihi') bitisTarihi: string,
  ): Promise<OtelStokTakvim[]> {
    return this.stokTakvimService.findByDateRange(
      +odaTipiId,
      baslangicTarihi,
      bitisTarihi,
    );
  }

  @Get('musaitlik-kontrol')
  @ApiOperation({ summary: 'Oda müsaitliğini kontrol et' })
  @ApiQuery({ name: 'odaTipiId', required: true })
  @ApiQuery({ name: 'girisTarihi', required: true, example: '2024-12-20' })
  @ApiQuery({ name: 'cikisTarihi', required: true, example: '2024-12-25' })
  @ApiQuery({ name: 'odaSayisi', required: false, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Müsaitlik bilgisi',
    schema: {
      example: {
        musait: true,
        detaylar: [
          {
            tarih: '2024-12-20',
            toplam_oda: 10,
            rezerve_oda: 7,
            bloke_oda: 0,
            musait_oda: 3,
            musait: true,
            talep_edilen: 2,
          },
        ],
        mesaj: '2 oda için tüm tarihler müsait',
      },
    },
  })
  checkAvailability(
    @Query('odaTipiId') odaTipiId: string,
    @Query('girisTarihi') girisTarihi: string,
    @Query('cikisTarihi') cikisTarihi: string,
    @Query('odaSayisi') odaSayisi?: string,
  ): Promise<{ musait: boolean; detaylar: any[]; mesaj: string }> {
    return this.stokTakvimService.checkAvailability(
      +odaTipiId,
      girisTarihi,
      cikisTarihi,
      odaSayisi ? +odaSayisi : 1,
    );
  }

  @Post('stok-baslat')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tarih aralığı için stok kayıtları oluştur' })
  @ApiQuery({ name: 'odaTipiId', required: true })
  @ApiQuery({ name: 'toplamOda', required: true })
  @ApiQuery({ name: 'baslangicTarihi', required: true, example: '2024-12-01' })
  @ApiQuery({ name: 'bitisTarihi', required: true, example: '2024-12-31' })
  @ApiResponse({
    status: 200,
    description: 'Stok kayıtları oluşturuldu',
    schema: { example: '30 gün için stok oluşturuldu' },
  })
  initializeStokForDateRange(
    @Query('odaTipiId') odaTipiId: string,
    @Query('toplamOda') toplamOda: string,
    @Query('baslangicTarihi') baslangicTarihi: string,
    @Query('bitisTarihi') bitisTarihi: string,
  ): Promise<string> {
    return this.stokTakvimService.initializeStokForDateRange(
      +odaTipiId,
      +toplamOda,
      baslangicTarihi,
      bitisTarihi,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Stok takvimini getir' })
  @ApiResponse({
    status: 200,
    description: 'Stok takvimi bulundu',
    type: OtelStokTakvim,
  })
  findOne(@Param('id') id: string): Promise<OtelStokTakvim> {
    return this.stokTakvimService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni stok takvimi ekle' })
  @ApiResponse({
    status: 201,
    description: 'Stok takvimi oluşturuldu',
    type: OtelStokTakvim,
  })
  create(
    @Body() createStokTakvimDto: CreateStokTakvimDto,
  ): Promise<OtelStokTakvim> {
    return this.stokTakvimService.create(createStokTakvimDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Stok takvimini güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Stok takvimi güncellendi',
    type: OtelStokTakvim,
  })
  update(
    @Param('id') id: string,
    @Body() updateStokTakvimDto: UpdateStokTakvimDto,
  ): Promise<OtelStokTakvim> {
    return this.stokTakvimService.update(+id, updateStokTakvimDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Stok takvimini sil' })
  @ApiResponse({
    status: 200,
    description: 'Stok takvimi silindi',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.stokTakvimService.remove(+id);
  }
}

