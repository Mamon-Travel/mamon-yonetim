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
import { DovizKurService } from './doviz-kur.service';
import { CreateDovizKurDto } from './dto/create-doviz-kur.dto';
import { UpdateDovizKurDto } from './dto/update-doviz-kur.dto';
import { DovizKur } from './entities/doviz-kur.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Döviz Kurları')
@Controller('doviz-kur')
export class DovizKurController {
  constructor(private readonly dovizKurService: DovizKurService) {}

  @Get()
  @ApiOperation({ summary: 'Tüm kurları listele' })
  @ApiResponse({
    status: 200,
    description: 'Kurlar listelendi',
    type: [DovizKur],
  })
  findAll(): Promise<DovizKur[]> {
    return this.dovizKurService.findAll();
  }

  @Get('guncel')
  @ApiOperation({ summary: 'Güncel kurları getir (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Güncel kurlar bulundu',
    type: [DovizKur],
  })
  findGuncelKurlar(): Promise<DovizKur[]> {
    return this.dovizKurService.findGuncelKurlar();
  }

  @Get('tcmb-test')
  @ApiOperation({ summary: 'TCMB API test et (debug - Public)' })
  @ApiResponse({
    status: 200,
    description: 'TCMB kurları çekildi',
  })
  async testTCMB(): Promise<any> {
    try {
      const kurlar = await this.dovizKurService.fetchTCMBKurlar();
      return {
        success: true,
        kur_sayisi: kurlar.length,
        ornek_kurlar: kurlar.slice(0, 5),
        mesaj: 'TCMB API bağlantısı başarılı',
      };
    } catch (error) {
      return {
        success: false,
        hata: error.message,
        mesaj: 'TCMB API bağlantısı başarısız',
      };
    }
  }

  @Get('para-birimi/:paraBirimi')
  @ApiOperation({ summary: 'Para birimine göre güncel kur (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Kur bulundu',
    type: DovizKur,
  })
  findByParaBirimi(@Param('paraBirimi') paraBirimi: string): Promise<DovizKur> {
    return this.dovizKurService.findByParaBirimi(paraBirimi);
  }

  @Get('cevir')
  @ApiOperation({ summary: 'Para birimi çevir (Public)' })
  @ApiQuery({ name: 'miktar', required: true, example: 100 })
  @ApiQuery({ name: 'kaynak', required: true, example: 'USD' })
  @ApiQuery({ name: 'hedef', required: true, example: 'TRY' })
  @ApiResponse({
    status: 200,
    description: 'Para birimi çevrildi',
    schema: {
      example: { cevrilen_miktar: 3420.0, kur: 34.20 },
    },
  })
  cevirParaBirimi(
    @Query('miktar') miktar: string,
    @Query('kaynak') kaynak: string,
    @Query('hedef') hedef: string,
  ): Promise<{ cevrilen_miktar: number; kur: number }> {
    return this.dovizKurService.cevirParaBirimi(
      parseFloat(miktar),
      kaynak,
      hedef,
    );
  }

  @Post('tcmb-guncelle')
  @ApiOperation({ summary: 'TCMB kurlarını çek ve güncelle (Public endpoint)' })
  @ApiQuery({
    name: 'yuzdeMarj',
    required: false,
    example: 2.5,
    description: 'Eklenecek marj yüzdesi',
  })
  @ApiResponse({
    status: 200,
    description: 'TCMB kurları güncellendi',
    schema: {
      example: {
        success: true,
        mesaj: '5 para birimi güncellendi',
        guncellenen_sayisi: 5,
        detaylar: [],
      },
    },
  })
  guncelleTCMBKurlar(@Query('yuzdeMarj') yuzdeMarj?: string): Promise<{
    success: boolean;
    mesaj: string;
    guncellenen_sayisi: number;
    detaylar: any[];
  }> {
    return this.dovizKurService.guncelleTCMBKurlar(
      yuzdeMarj ? parseFloat(yuzdeMarj) : 2.5,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Kur detayı' })
  @ApiResponse({
    status: 200,
    description: 'Kur bulundu',
    type: DovizKur,
  })
  findOne(@Param('id') id: string): Promise<DovizKur> {
    return this.dovizKurService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni kur ekle (manuel)' })
  @ApiResponse({
    status: 201,
    description: 'Kur oluşturuldu',
    type: DovizKur,
  })
  create(@Body() createDovizKurDto: CreateDovizKurDto): Promise<DovizKur> {
    return this.dovizKurService.create(createDovizKurDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kur güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Kur güncellendi',
    type: DovizKur,
  })
  update(
    @Param('id') id: string,
    @Body() updateDovizKurDto: UpdateDovizKurDto,
  ): Promise<DovizKur> {
    return this.dovizKurService.update(+id, updateDovizKurDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kur sil' })
  @ApiResponse({
    status: 200,
    description: 'Kur silindi',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.dovizKurService.remove(+id);
  }
}

