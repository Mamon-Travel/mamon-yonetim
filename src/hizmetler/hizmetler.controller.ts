import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { HizmetlerService } from './hizmetler.service';
import { CreateHizmetlerDto } from './dto/create-hizmetler.dto';
import { UpdateHizmetlerDto } from './dto/update-hizmetler.dto';
import { Hizmetler } from './entities/hizmetler.entity';

@ApiTags('Hizmetler')
@Controller('hizmetler')
export class HizmetlerController {
  constructor(private readonly hizmetlerService: HizmetlerService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni hizmet oluştur' })
  @ApiResponse({ status: 201, description: 'Hizmet başarıyla oluşturuldu', type: Hizmetler })
  create(@Body() createHizmetlerDto: CreateHizmetlerDto): Promise<Hizmetler> {
    return this.hizmetlerService.create(createHizmetlerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm hizmetleri listele' })
  @ApiResponse({ status: 200, description: 'Hizmetler başarıyla listelendi', type: [Hizmetler] })
  findAll(): Promise<Hizmetler[]> {
    return this.hizmetlerService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Aktif hizmetleri listele' })
  @ApiResponse({ status: 200, description: 'Aktif hizmetler başarıyla listelendi', type: [Hizmetler] })
  findActive(): Promise<Hizmetler[]> {
    return this.hizmetlerService.findActive();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Slug ile hizmet bul' })
  @ApiParam({ name: 'slug', description: 'Hizmet slug' })
  @ApiResponse({ status: 200, description: 'Hizmet bulundu', type: Hizmetler })
  findBySlug(@Param('slug') slug: string): Promise<Hizmetler> {
    return this.hizmetlerService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID ile hizmet bul' })
  @ApiParam({ name: 'id', description: 'Hizmet ID' })
  @ApiResponse({ status: 200, description: 'Hizmet bulundu', type: Hizmetler })
  findOne(@Param('id') id: string): Promise<Hizmetler> {
    return this.hizmetlerService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Hizmet güncelle' })
  @ApiParam({ name: 'id', description: 'Hizmet ID' })
  @ApiResponse({ status: 200, description: 'Hizmet başarıyla güncellendi', type: Hizmetler })
  update(@Param('id') id: string, @Body() updateHizmetlerDto: UpdateHizmetlerDto): Promise<Hizmetler> {
    return this.hizmetlerService.update(+id, updateHizmetlerDto);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Hizmet aktif/pasif durumunu değiştir' })
  @ApiParam({ name: 'id', description: 'Hizmet ID' })
  @ApiResponse({ status: 200, description: 'Hizmet durumu başarıyla değiştirildi', type: Hizmetler })
  toggleActive(@Param('id') id: string): Promise<Hizmetler> {
    return this.hizmetlerService.toggleActive(+id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Hizmet sil' })
  @ApiParam({ name: 'id', description: 'Hizmet ID' })
  @ApiResponse({ status: 204, description: 'Hizmet başarıyla silindi' })
  remove(@Param('id') id: string): Promise<void> {
    return this.hizmetlerService.remove(+id);
  }
}
