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
import { OtelIptalPolitikaService } from './otel-iptal-politika.service';
import { CreateIptalPolitikaDto } from './dto/create-iptal-politika.dto';
import { UpdateIptalPolitikaDto } from './dto/update-iptal-politika.dto';
import { OtelIptalPolitika } from './entities/otel-iptal-politika.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Otel İptal Politikaları')
@Controller('otel-iptal-politika')
export class OtelIptalPolitikaController {
  constructor(
    private readonly iptalPolitikaService: OtelIptalPolitikaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Tüm iptal politikalarını listele' })
  @ApiResponse({
    status: 200,
    description: 'İptal politikaları listelendi',
    type: [OtelIptalPolitika],
  })
  findAll(): Promise<OtelIptalPolitika[]> {
    return this.iptalPolitikaService.findAll();
  }

  @Get('otel/:otelId')
  @ApiOperation({ summary: 'Otele göre iptal politikalarını getir' })
  @ApiResponse({
    status: 200,
    description: 'İptal politikaları bulundu',
    type: [OtelIptalPolitika],
  })
  findByOtelId(@Param('otelId') otelId: string): Promise<OtelIptalPolitika[]> {
    return this.iptalPolitikaService.findByOtelId(+otelId);
  }

  @Get('uygun-politika')
  @ApiOperation({ summary: 'Günlere göre uygun iptal politikasını getir' })
  @ApiQuery({ name: 'otelId', required: true })
  @ApiQuery({ name: 'gunOncesi', required: true, example: 5 })
  @ApiResponse({
    status: 200,
    description: 'Uygun iptal politikası bulundu',
    type: OtelIptalPolitika,
  })
  getApplicablePolicy(
    @Query('otelId') otelId: string,
    @Query('gunOncesi') gunOncesi: string,
  ): Promise<OtelIptalPolitika | null> {
    return this.iptalPolitikaService.getApplicablePolicy(+otelId, +gunOncesi);
  }

  @Get(':id')
  @ApiOperation({ summary: 'İptal politikasını getir' })
  @ApiResponse({
    status: 200,
    description: 'İptal politikası bulundu',
    type: OtelIptalPolitika,
  })
  findOne(@Param('id') id: string): Promise<OtelIptalPolitika> {
    return this.iptalPolitikaService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni iptal politikası ekle' })
  @ApiResponse({
    status: 201,
    description: 'İptal politikası oluşturuldu',
    type: OtelIptalPolitika,
  })
  create(
    @Body() createIptalPolitikaDto: CreateIptalPolitikaDto,
  ): Promise<OtelIptalPolitika> {
    return this.iptalPolitikaService.create(createIptalPolitikaDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İptal politikasını güncelle' })
  @ApiResponse({
    status: 200,
    description: 'İptal politikası güncellendi',
    type: OtelIptalPolitika,
  })
  update(
    @Param('id') id: string,
    @Body() updateIptalPolitikaDto: UpdateIptalPolitikaDto,
  ): Promise<OtelIptalPolitika> {
    return this.iptalPolitikaService.update(+id, updateIptalPolitikaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İptal politikasını sil' })
  @ApiResponse({
    status: 200,
    description: 'İptal politikası silindi',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.iptalPolitikaService.remove(+id);
  }
}

