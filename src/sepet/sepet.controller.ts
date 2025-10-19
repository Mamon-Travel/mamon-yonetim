import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SepetService } from './sepet.service';
import { CreateSepetDto } from './dto/create-sepet.dto';
import { UpdateSepetDto } from './dto/update-sepet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Sepet')
@Controller('sepet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SepetController {
  constructor(private readonly sepetService: SepetService) {}

  @Post()
  @ApiOperation({ summary: 'Sepete ürün ekle' })
  create(@Request() req, @Body() createSepetDto: CreateSepetDto) {
    return this.sepetService.create(req.user.userId, createSepetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Kullanıcının sepetini getir' })
  findAll(@Request() req) {
    return this.sepetService.findByKullanici(req.user.userId);
  }

  @Get('toplam')
  @ApiOperation({ summary: 'Sepet toplamını getir' })
  getToplam(@Request() req) {
    return this.sepetService.getSepetToplami(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Sepetteki tek bir ürünü getir' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.sepetService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Sepetteki ürünü güncelle' })
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateSepetDto: UpdateSepetDto,
  ) {
    return this.sepetService.update(+id, req.user.userId, updateSepetDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Sepetten ürün sil' })
  remove(@Param('id') id: string, @Request() req) {
    return this.sepetService.remove(+id, req.user.userId);
  }

  @Delete()
  @ApiOperation({ summary: 'Sepeti tamamen temizle' })
  clearSepet(@Request() req) {
    return this.sepetService.clearSepet(req.user.userId);
  }
}

