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
import { PanelKullanicilarService } from './panel-kullanicilar.service';
import { CreatePanelKullanicilarDto } from './dto/create-panel-kullanicilar.dto';
import { UpdatePanelKullanicilarDto } from './dto/update-panel-kullanicilar.dto';
import { PanelKullanicilar } from './entities/panel-kullanicilar.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Panel Kullanıcıları')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('panel-kullanicilar')
export class PanelKullanicilarController {
  constructor(
    private readonly panelKullanicilarService: PanelKullanicilarService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Yeni panel kullanıcısı oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Panel kullanıcısı başarıyla oluşturuldu',
    type: PanelKullanicilar,
  })
  @ApiResponse({
    status: 409,
    description: 'Email veya kullanıcı adı zaten kullanılıyor',
  })
  create(
    @Body() createPanelKullanicilarDto: CreatePanelKullanicilarDto,
  ): Promise<PanelKullanicilar> {
    return this.panelKullanicilarService.create(createPanelKullanicilarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm panel kullanıcılarını listele' })
  @ApiResponse({
    status: 200,
    description: 'Panel kullanıcıları listelendi',
    type: [PanelKullanicilar],
  })
  findAll(): Promise<PanelKullanicilar[]> {
    return this.panelKullanicilarService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Panel kullanıcı detayını getir' })
  @ApiResponse({
    status: 200,
    description: 'Panel kullanıcı detayı',
    type: PanelKullanicilar,
  })
  @ApiResponse({ status: 404, description: 'Panel kullanıcısı bulunamadı' })
  findOne(@Param('id') id: string): Promise<PanelKullanicilar> {
    return this.panelKullanicilarService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Panel kullanıcı güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Panel kullanıcı güncellendi',
    type: PanelKullanicilar,
  })
  @ApiResponse({ status: 404, description: 'Panel kullanıcısı bulunamadı' })
  update(
    @Param('id') id: string,
    @Body() updatePanelKullanicilarDto: UpdatePanelKullanicilarDto,
  ): Promise<PanelKullanicilar> {
    return this.panelKullanicilarService.update(
      +id,
      updatePanelKullanicilarDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Panel kullanıcı sil' })
  @ApiResponse({ status: 204, description: 'Panel kullanıcı silindi' })
  @ApiResponse({ status: 404, description: 'Panel kullanıcısı bulunamadı' })
  remove(@Param('id') id: string): Promise<void> {
    return this.panelKullanicilarService.remove(+id);
  }
}



