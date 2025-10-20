import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PanelKullanicilarService } from './panel-kullanicilar.service';
import { UpdatePanelProfileDto } from './dto/update-panel-profile.dto';
import { PanelKullanicilar } from './entities/panel-kullanicilar.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Panel Profil')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('panel-profile')
export class PanelProfileController {
  constructor(
    private readonly panelKullanicilarService: PanelKullanicilarService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Panel kullanıcı profilini getir' })
  @ApiResponse({
    status: 200,
    description: 'Profil bilgileri',
    type: PanelKullanicilar,
  })
  getProfile(@Req() req: any): Promise<PanelKullanicilar> {
    return this.panelKullanicilarService.getProfile(req.user.userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Panel kullanıcı profilini güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Profil güncellendi',
    type: PanelKullanicilar,
  })
  updateProfile(
    @Req() req: any,
    @Body() updatePanelProfileDto: UpdatePanelProfileDto,
  ): Promise<PanelKullanicilar> {
    return this.panelKullanicilarService.updateProfile(
      req.user.userId,
      updatePanelProfileDto,
    );
  }
}

