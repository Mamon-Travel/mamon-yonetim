import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreatePanelKullanicilarDto } from './dto/create-panel-kullanicilar.dto';
import { UpdatePanelKullanicilarDto } from './dto/update-panel-kullanicilar.dto';
import { UpdatePanelProfileDto } from './dto/update-panel-profile.dto';
import { PanelKullanicilar } from './entities/panel-kullanicilar.entity';

@Injectable()
export class PanelKullanicilarService {
  constructor(
    @InjectRepository(PanelKullanicilar)
    private readonly panelKullanicilarRepository: Repository<PanelKullanicilar>,
  ) {}

  async create(
    createPanelKullanicilarDto: CreatePanelKullanicilarDto,
  ): Promise<PanelKullanicilar> {
    // Email veya kullanıcı adı kontrolü
    const existingUser = await this.panelKullanicilarRepository.findOne({
      where: [
        { email: createPanelKullanicilarDto.email },
        { kullanici_adi: createPanelKullanicilarDto.kullanici_adi },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'Bu email veya kullanıcı adı zaten kullanılıyor',
      );
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(
      createPanelKullanicilarDto.sifre,
      10,
    );

    const kullanici = this.panelKullanicilarRepository.create({
      ...createPanelKullanicilarDto,
      sifre: hashedPassword,
    });

    return await this.panelKullanicilarRepository.save(kullanici);
  }

  async findAll(): Promise<PanelKullanicilar[]> {
    const kullanicilar = await this.panelKullanicilarRepository.find({
      order: {
        id: 'DESC',
      },
    });

    // Şifreleri döndürme
    return kullanicilar.map((k) => {
      const { sifre, ...kullanici } = k;
      return kullanici as PanelKullanicilar;
    });
  }

  async findOne(id: number): Promise<PanelKullanicilar> {
    const kullanici = await this.panelKullanicilarRepository.findOne({
      where: { id },
    });

    if (!kullanici) {
      throw new NotFoundException(`Panel kullanıcısı #${id} bulunamadı`);
    }

    // Şifreyi döndürme
    const { sifre, ...kullaniciData } = kullanici;
    return kullaniciData as PanelKullanicilar;
  }

  async findByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<PanelKullanicilar | null> {
    return await this.panelKullanicilarRepository.findOne({
      where: [{ kullanici_adi: usernameOrEmail }, { email: usernameOrEmail }],
    });
  }

  async update(
    id: number,
    updatePanelKullanicilarDto: UpdatePanelKullanicilarDto,
  ): Promise<PanelKullanicilar> {
    const kullanici = await this.panelKullanicilarRepository.findOne({
      where: { id },
    });

    if (!kullanici) {
      throw new NotFoundException(`Panel kullanıcısı #${id} bulunamadı`);
    }

    // Eğer şifre güncelleniyorsa hash'le
    if (updatePanelKullanicilarDto.sifre) {
      updatePanelKullanicilarDto.sifre = await bcrypt.hash(
        updatePanelKullanicilarDto.sifre,
        10,
      );
    }

    Object.assign(kullanici, updatePanelKullanicilarDto);
    const updated = await this.panelKullanicilarRepository.save(kullanici);

    // Şifreyi döndürme
    const { sifre, ...kullaniciData } = updated;
    return kullaniciData as PanelKullanicilar;
  }

  async remove(id: number): Promise<void> {
    const kullanici = await this.panelKullanicilarRepository.findOne({
      where: { id },
    });

    if (!kullanici) {
      throw new NotFoundException(`Panel kullanıcısı #${id} bulunamadı`);
    }

    await this.panelKullanicilarRepository.remove(kullanici);
  }

  // Profil metodları
  async getProfile(userId: number): Promise<PanelKullanicilar> {
    const kullanici = await this.panelKullanicilarRepository.findOne({
      where: { id: userId },
    });

    if (!kullanici) {
      throw new NotFoundException('Panel kullanıcısı bulunamadı');
    }

    // Şifreyi döndürme
    const { sifre, ...kullaniciData } = kullanici;
    return kullaniciData as PanelKullanicilar;
  }

  async updateProfile(
    userId: number,
    updatePanelProfileDto: UpdatePanelProfileDto,
  ): Promise<PanelKullanicilar> {
    const kullanici = await this.panelKullanicilarRepository.findOne({
      where: { id: userId },
    });

    if (!kullanici) {
      throw new NotFoundException('Panel kullanıcısı bulunamadı');
    }

    // Şifre değişikliği kontrolü
    if (updatePanelProfileDto.yeniSifre) {
      if (!updatePanelProfileDto.mevcutSifre) {
        throw new BadRequestException(
          'Şifre değiştirmek için mevcut şifre gerekli',
        );
      }

      const isPasswordValid = await bcrypt.compare(
        updatePanelProfileDto.mevcutSifre,
        kullanici.sifre,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Mevcut şifre hatalı');
      }

      kullanici.sifre = await bcrypt.hash(updatePanelProfileDto.yeniSifre, 10);
    }

    // Email değişikliği kontrolü
    if (
      updatePanelProfileDto.email &&
      updatePanelProfileDto.email !== kullanici.email
    ) {
      const existingUser = await this.panelKullanicilarRepository.findOne({
        where: { email: updatePanelProfileDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Bu email zaten kullanılıyor');
      }
      kullanici.email = updatePanelProfileDto.email;
    }

    // Diğer alanları güncelle
    if (updatePanelProfileDto.ad) kullanici.ad = updatePanelProfileDto.ad;
    if (updatePanelProfileDto.soyad)
      kullanici.soyad = updatePanelProfileDto.soyad;
    if (updatePanelProfileDto.telefon !== undefined)
      kullanici.telefon = updatePanelProfileDto.telefon;
    if (updatePanelProfileDto.resim !== undefined)
      kullanici.resim = updatePanelProfileDto.resim;

    const updated = await this.panelKullanicilarRepository.save(kullanici);

    // Şifreyi döndürme
    const { sifre, ...kullaniciData } = updated;
    return kullaniciData as PanelKullanicilar;
  }
}











