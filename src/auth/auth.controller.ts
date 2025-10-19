import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { KullaniciTipi } from '../kullanicilar/enums/kullanici-tipi.enum';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Müşteri kaydı (mamon-site için)' })
  @ApiResponse({
    status: 201,
    description: 'Kayıt başarılı, kullanıcı müşteri olarak kaydedildi',
  })
  @ApiResponse({ status: 409, description: 'Email veya kullanıcı adı zaten kullanımda' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('register-admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(KullaniciTipi.YONETICI)
  @ApiOperation({
    summary: 'Yönetici tarafından kullanıcı kaydı (acente, personel, yönetici)',
  })
  @ApiResponse({
    status: 201,
    description: 'Kullanıcı başarıyla oluşturuldu',
  })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 403, description: 'Yetki yetersiz' })
  @ApiResponse({ status: 409, description: 'Email veya kullanıcı adı zaten kullanımda' })
  async registerAdmin(@Body() registerAdminDto: RegisterAdminDto) {
    return this.authService.registerAdmin(registerAdminDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Müşteri girişi (mamon-site için)' })
  @ApiResponse({ status: 200, description: 'Giriş başarılı' })
  @ApiResponse({ status: 401, description: 'Kullanıcı adı veya şifre hatalı' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('login-panel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Panel girişi (acente, personel, yönetici için mamon-panel)',
  })
  @ApiResponse({ status: 200, description: 'Giriş başarılı' })
  @ApiResponse({ status: 401, description: 'Kullanıcı adı veya şifre hatalı veya yetki yetersiz' })
  async loginPanel(@Body() loginDto: LoginDto) {
    return this.authService.loginPanel(loginDto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Giriş yapmış kullanıcının profili' })
  @ApiResponse({ status: 200, description: 'Kullanıcı profili' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }
}

