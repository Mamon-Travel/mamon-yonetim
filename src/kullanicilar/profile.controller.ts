import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { KullanicilarService } from './kullanicilar.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Kullanicilar } from './entities/kullanicilar.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Profil')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly kullanicilarService: KullanicilarService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Kendi profilini getir' })
  @ApiResponse({
    status: 200,
    description: 'Profil bilgisi',
    type: Kullanicilar,
  })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  getProfile(@Request() req): Promise<Kullanicilar> {
    return this.kullanicilarService.getProfile(req.user.id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Kendi profilini güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Profil güncellendi',
    type: Kullanicilar,
  })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 409, description: 'Email zaten kullanılıyor' })
  updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Kullanicilar> {
    return this.kullanicilarService.updateProfile(
      req.user.id,
      updateProfileDto,
    );
  }
}


