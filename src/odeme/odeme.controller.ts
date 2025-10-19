import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Ip,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { OdemeService } from './odeme.service';
import { CreateOdemeDto } from './dto/create-odeme.dto';
import { PaytrCallbackDto } from './dto/paytr-callback.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { KullaniciTipi } from '../kullanicilar/enums/kullanici-tipi.enum';

@ApiTags('Ödeme')
@Controller('odeme')
export class OdemeController {
  constructor(private readonly odemeService: OdemeService) {}

  @Post('basla')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'PayTR ile ödeme başlat' })
  createPayment(
    @Request() req,
    @Body() createOdemeDto: CreateOdemeDto,
    @Ip() ip: string,
  ) {
    const kullaniciBilgileri = {
      ad: req.user.ad,
      soyad: req.user.soyad,
      email: req.user.email,
      telefon: req.user.telefon,
    };

    return this.odemeService.createPaytrPayment(
      req.user.userId,
      createOdemeDto,
      kullaniciBilgileri,
      ip,
    );
  }

  @Post('callback')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  handleCallback(@Body() callbackData: PaytrCallbackDto, @Ip() ip: string) {
    return this.odemeService.handlePaytrCallback(callbackData, ip);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(KullaniciTipi.YONETICI)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tüm ödemeleri listele (Yönetici)' })
  findAll() {
    return this.odemeService.findAll();
  }

  @Get('benim')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcının ödemelerini listele' })
  findMyPayments(@Request() req) {
    return this.odemeService.findByKullanici(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ödeme detayını getir' })
  findOne(@Param('id') id: string) {
    return this.odemeService.findOne(+id);
  }

  @Get('merchant/:merchantOid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Merchant OID ile ödeme detayını getir' })
  findByMerchantOid(@Param('merchantOid') merchantOid: string) {
    return this.odemeService.findByMerchantOid(merchantOid);
  }
}

