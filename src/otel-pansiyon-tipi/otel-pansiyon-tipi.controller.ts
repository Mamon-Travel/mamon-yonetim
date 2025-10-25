import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OtelPansiyonTipiService } from './otel-pansiyon-tipi.service';
import { CreatePansiyonTipiDto } from './dto/create-pansiyon-tipi.dto';
import { UpdatePansiyonTipiDto } from './dto/update-pansiyon-tipi.dto';
import { OtelPansiyonTipi } from './entities/otel-pansiyon-tipi.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Otel Pansiyon Tipleri')
@Controller('otel-pansiyon-tipi')
export class OtelPansiyonTipiController {
  constructor(
    private readonly pansiyonTipiService: OtelPansiyonTipiService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Tüm pansiyon tiplerini listele' })
  @ApiResponse({
    status: 200,
    description: 'Pansiyon tipleri listelendi',
    type: [OtelPansiyonTipi],
  })
  findAll(): Promise<OtelPansiyonTipi[]> {
    return this.pansiyonTipiService.findAll();
  }

  @Get('aktif')
  @ApiOperation({ summary: 'Aktif pansiyon tiplerini listele' })
  @ApiResponse({
    status: 200,
    description: 'Aktif pansiyon tipleri listelendi',
    type: [OtelPansiyonTipi],
  })
  findActive(): Promise<OtelPansiyonTipi[]> {
    return this.pansiyonTipiService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Pansiyon tipini getir' })
  @ApiResponse({
    status: 200,
    description: 'Pansiyon tipi bulundu',
    type: OtelPansiyonTipi,
  })
  findOne(@Param('id') id: string): Promise<OtelPansiyonTipi> {
    return this.pansiyonTipiService.findOne(+id);
  }

  @Get('kod/:kod')
  @ApiOperation({ summary: 'Pansiyon tipini koda göre getir' })
  @ApiResponse({
    status: 200,
    description: 'Pansiyon tipi bulundu',
    type: OtelPansiyonTipi,
  })
  findByKod(@Param('kod') kod: string): Promise<OtelPansiyonTipi> {
    return this.pansiyonTipiService.findByKod(kod);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni pansiyon tipi ekle' })
  @ApiResponse({
    status: 201,
    description: 'Pansiyon tipi oluşturuldu',
    type: OtelPansiyonTipi,
  })
  create(
    @Body() createPansiyonTipiDto: CreatePansiyonTipiDto,
  ): Promise<OtelPansiyonTipi> {
    return this.pansiyonTipiService.create(createPansiyonTipiDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pansiyon tipini güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Pansiyon tipi güncellendi',
    type: OtelPansiyonTipi,
  })
  update(
    @Param('id') id: string,
    @Body() updatePansiyonTipiDto: UpdatePansiyonTipiDto,
  ): Promise<OtelPansiyonTipi> {
    return this.pansiyonTipiService.update(+id, updatePansiyonTipiDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pansiyon tipini sil' })
  @ApiResponse({
    status: 200,
    description: 'Pansiyon tipi silindi',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.pansiyonTipiService.remove(+id);
  }
}

