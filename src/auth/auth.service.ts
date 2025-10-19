import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Kullanicilar } from '../kullanicilar/entities/kullanicilar.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { KullaniciTipi } from '../kullanicilar/enums/kullanici-tipi.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Kullanicilar)
    private readonly kullanicilarRepository: Repository<Kullanicilar>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Email veya kullanıcı adı kontrolü
    const existingUser = await this.kullanicilarRepository.findOne({
      where: [
        { email: registerDto.email },
        { kullanici_adi: registerDto.kullanici_adi },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'Bu email veya kullanıcı adı zaten kullanılıyor',
      );
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(registerDto.sifre, 10);

    // Müşteri olarak kaydet
    const kullanici = this.kullanicilarRepository.create({
      ...registerDto,
      sifre: hashedPassword,
      kullanici_tipi: KullaniciTipi.MUSTERI,
      durum: 1,
    });

    const savedUser = await this.kullanicilarRepository.save(kullanici);

    // JWT token oluştur
    const token = this.createToken(savedUser);

    // Şifreyi döndürme
    const { sifre, ...kullaniciData } = savedUser;

    return {
      kullanici: kullaniciData,
      access_token: token,
    };
  }

  async registerAdmin(registerAdminDto: RegisterAdminDto) {
    // Email veya kullanıcı adı kontrolü
    const existingUser = await this.kullanicilarRepository.findOne({
      where: [
        { email: registerAdminDto.email },
        { kullanici_adi: registerAdminDto.kullanici_adi },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'Bu email veya kullanıcı adı zaten kullanılıyor',
      );
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(registerAdminDto.sifre, 10);

    // Belirtilen kullanıcı tipiyle kaydet
    const kullanici = this.kullanicilarRepository.create({
      ...registerAdminDto,
      sifre: hashedPassword,
      durum: 1,
    });

    const savedUser = await this.kullanicilarRepository.save(kullanici);

    // JWT token oluştur
    const token = this.createToken(savedUser);

    // Şifreyi döndürme
    const { sifre, ...kullaniciData } = savedUser;

    return {
      kullanici: kullaniciData,
      access_token: token,
    };
  }

  async login(loginDto: LoginDto) {
    // Kullanıcı adı veya email ile ara
    const kullanici = await this.kullanicilarRepository.findOne({
      where: [
        { kullanici_adi: loginDto.kullanici_adi },
        { email: loginDto.kullanici_adi },
      ],
    });

    if (!kullanici) {
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı');
    }

    // Durum kontrolü
    if (kullanici.durum !== 1) {
      throw new UnauthorizedException('Hesabınız aktif değil');
    }

    // Şifre kontrolü
    const sifreDogruMu = await bcrypt.compare(loginDto.sifre, kullanici.sifre);

    if (!sifreDogruMu) {
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı');
    }

    // JWT token oluştur
    const token = this.createToken(kullanici);

    // Şifreyi döndürme
    const { sifre, ...kullaniciData } = kullanici;

    return {
      kullanici: kullaniciData,
      access_token: token,
    };
  }

  async loginPanel(loginDto: LoginDto) {
    // Kullanıcı adı veya email ile ara
    const kullanici = await this.kullanicilarRepository.findOne({
      where: [
        { kullanici_adi: loginDto.kullanici_adi },
        { email: loginDto.kullanici_adi },
      ],
    });

    if (!kullanici) {
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı');
    }

    // Sadece acente, personel ve yönetici girişine izin ver
    if (
      ![
        KullaniciTipi.ACENTE,
        KullaniciTipi.PERSONEL,
        KullaniciTipi.YONETICI,
      ].includes(kullanici.kullanici_tipi)
    ) {
      throw new UnauthorizedException(
        'Bu kullanıcı tipi panel girişi yapamaz',
      );
    }

    // Durum kontrolü
    if (kullanici.durum !== 1) {
      throw new UnauthorizedException('Hesabınız aktif değil');
    }

    // Şifre kontrolü
    const sifreDogruMu = await bcrypt.compare(loginDto.sifre, kullanici.sifre);

    if (!sifreDogruMu) {
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı');
    }

    // JWT token oluştur
    const token = this.createToken(kullanici);

    // Şifreyi döndürme
    const { sifre, ...kullaniciData } = kullanici;

    return {
      kullanici: kullaniciData,
      access_token: token,
    };
  }

  async getProfile(userId: number) {
    const kullanici = await this.kullanicilarRepository.findOne({
      where: { id: userId },
    });

    if (!kullanici) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    // Şifreyi döndürme
    const { sifre, ...kullaniciData } = kullanici;
    return kullaniciData;
  }

  private createToken(kullanici: Kullanicilar): string {
    const payload = {
      sub: kullanici.id,
      kullanici_adi: kullanici.kullanici_adi,
      email: kullanici.email,
      kullanici_tipi: kullanici.kullanici_tipi,
    };

    return this.jwtService.sign(payload);
  }
}

