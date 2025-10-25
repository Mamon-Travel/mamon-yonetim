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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaylasimSablonService } from './paylasim-sablon.service';
import { CreatePaylasimSablonDto } from './dto/create-paylasim-sablon.dto';
import { UpdatePaylasimSablonDto } from './dto/update-paylasim-sablon.dto';
import { PaylasimSablon } from './entities/paylasim-sablon.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Paylaşım Şablonları')
@Controller('paylasim-sablon')
export class PaylasimSablonController {
  constructor(private readonly paylasimSablonService: PaylasimSablonService) {}

  @Get()
  @ApiOperation({ summary: 'Tüm şablonları listele' })
  @ApiResponse({ status: 200, type: [PaylasimSablon] })
  findAll(): Promise<PaylasimSablon[]> {
    return this.paylasimSablonService.findAll();
  }

  @Get('aktif')
  @ApiOperation({ summary: 'Aktif şablonları listele' })
  @ApiResponse({ status: 200, type: [PaylasimSablon] })
  findActive(): Promise<PaylasimSablon[]> {
    return this.paylasimSablonService.findActive();
  }

  @Get(':id/preview')
  @ApiOperation({ summary: 'Şablon önizlemesi oluştur' })
  @ApiQuery({ name: 'baslik', required: true })
  @ApiQuery({ name: 'aciklama', required: true })
  @ApiResponse({ status: 200, schema: { example: '/uploads/social-123456.jpg' } })
  createPreview(
    @Param('id') id: string,
    @Query('baslik') baslik: string,
    @Query('aciklama') aciklama: string,
  ): Promise<string> {
    return this.paylasimSablonService.createPreview(+id, baslik, aciklama);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Şablon detayı' })
  @ApiResponse({ status: 200, type: PaylasimSablon })
  findOne(@Param('id') id: string): Promise<PaylasimSablon> {
    return this.paylasimSablonService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni şablon oluştur' })
  @ApiResponse({ status: 201, type: PaylasimSablon })
  create(@Body() createDto: CreatePaylasimSablonDto): Promise<PaylasimSablon> {
    return this.paylasimSablonService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Şablon güncelle' })
  @ApiResponse({ status: 200, type: PaylasimSablon })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePaylasimSablonDto,
  ): Promise<PaylasimSablon> {
    return this.paylasimSablonService.update(+id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Şablon sil' })
  remove(@Param('id') id: string): Promise<void> {
    return this.paylasimSablonService.remove(+id);
  }
}



