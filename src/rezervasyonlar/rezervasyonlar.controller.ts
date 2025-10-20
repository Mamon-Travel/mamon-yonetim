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
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RezervasyonlarService } from './rezervasyonlar.service';
import { CreateRezervasyonDto } from './dto/create-rezervasyon.dto';
import { UpdateRezervasyonDto } from './dto/update-rezervasyon.dto';
import { Rezervasyonlar } from './entities/rezervasyonlar.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { KullaniciTipi } from '../kullanicilar/enums/kullanici-tipi.enum';

@ApiTags('Rezervasyonlar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rezervasyonlar')
export class RezervasyonlarController {
  constructor(
    private readonly rezervasyonlarService: RezervasyonlarService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Yeni rezervasyon oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Rezervasyon başarıyla oluşturuldu',
    type: Rezervasyonlar,
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  create(
    @Request() req,
    @Body() createRezervasyonDto: CreateRezervasyonDto,
  ): Promise<Rezervasyonlar> {
    return this.rezervasyonlarService.create(
      req.user.id,
      createRezervasyonDto,
    );
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(KullaniciTipi.YONETICI)
  @ApiOperation({ summary: 'Tüm rezervasyonları listele (Yönetici)' })
  @ApiResponse({
    status: 200,
    description: 'Rezervasyonlar listelendi',
    type: [Rezervasyonlar],
  })
  findAll(): Promise<Rezervasyonlar[]> {
    return this.rezervasyonlarService.findAll();
  }

  @Get('benim')
  @ApiOperation({ summary: 'Kendi rezervasyonlarımı listele' })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcının rezervasyonları',
    type: [Rezervasyonlar],
  })
  getMyRezervasyonlar(@Request() req): Promise<Rezervasyonlar[]> {
    return this.rezervasyonlarService.getMyRezervasyonlar(req.user.id);
  }

  @Get('no/:rezervasyonNo')
  @ApiOperation({ summary: 'Rezervasyon numarasıyla getir' })
  @ApiResponse({
    status: 200,
    description: 'Rezervasyon detayı',
    type: Rezervasyonlar,
  })
  @ApiResponse({ status: 404, description: 'Rezervasyon bulunamadı' })
  findByRezervasyonNo(
    @Param('rezervasyonNo') rezervasyonNo: string,
  ): Promise<Rezervasyonlar> {
    return this.rezervasyonlarService.findByRezervasyonNo(rezervasyonNo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Rezervasyon detayını getir' })
  @ApiResponse({
    status: 200,
    description: 'Rezervasyon detayı',
    type: Rezervasyonlar,
  })
  @ApiResponse({ status: 404, description: 'Rezervasyon bulunamadı' })
  findOne(@Param('id') id: string): Promise<Rezervasyonlar> {
    return this.rezervasyonlarService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(KullaniciTipi.YONETICI)
  @ApiOperation({ summary: 'Rezervasyon güncelle (Yönetici)' })
  @ApiResponse({
    status: 200,
    description: 'Rezervasyon güncellendi',
    type: Rezervasyonlar,
  })
  @ApiResponse({ status: 404, description: 'Rezervasyon bulunamadı' })
  update(
    @Param('id') id: string,
    @Body() updateRezervasyonDto: UpdateRezervasyonDto,
  ): Promise<Rezervasyonlar> {
    return this.rezervasyonlarService.update(+id, updateRezervasyonDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(KullaniciTipi.YONETICI)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Rezervasyon sil (Yönetici)' })
  @ApiResponse({ status: 204, description: 'Rezervasyon silindi' })
  @ApiResponse({ status: 404, description: 'Rezervasyon bulunamadı' })
  remove(@Param('id') id: string): Promise<void> {
    return this.rezervasyonlarService.remove(+id);
  }
}


