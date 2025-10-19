import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRezervasyonDto } from './dto/create-rezervasyon.dto';
import { UpdateRezervasyonDto } from './dto/update-rezervasyon.dto';
import { Rezervasyonlar } from './entities/rezervasyonlar.entity';
import { RezervasyonDetaylari } from './entities/rezervasyon-detaylari.entity';
import { UrunlerService } from '../urunler/urunler.service';

@Injectable()
export class RezervasyonlarService {
  constructor(
    @InjectRepository(Rezervasyonlar)
    private readonly rezervasyonlarRepository: Repository<Rezervasyonlar>,
    @InjectRepository(RezervasyonDetaylari)
    private readonly detaylarRepository: Repository<RezervasyonDetaylari>,
    private readonly urunlerService: UrunlerService,
  ) {}

  async create(
    kullaniciId: number,
    createRezervasyonDto: CreateRezervasyonDto,
  ): Promise<Rezervasyonlar> {
    // Rezervasyon numarası oluştur
    const rezervasyonNo = await this.generateRezervasyonNo();

    // Toplam tutarı hesapla
    let toplamTutar = 0;
    const detaylar: RezervasyonDetaylari[] = [];

    for (const detayDto of createRezervasyonDto.detaylar) {
      const urun = await this.urunlerService.findOne(detayDto.urun_id);

      if (urun.durum !== 1) {
        throw new BadRequestException(
          `Ürün "${urun.baslik}" şu anda rezerve edilemiyor`,
        );
      }

      const birimFiyat = urun.fiyat;
      const toplamFiyat = birimFiyat * detayDto.miktar;
      toplamTutar += toplamFiyat;

      const detay = this.detaylarRepository.create({
        urun_id: urun.id,
        hizmet_adi: urun.hizmet.ad,
        urun_adi: urun.baslik,
        miktar: detayDto.miktar,
        birim_fiyat: birimFiyat,
        toplam_fiyat: toplamFiyat,
        rezervasyon_bilgileri: detayDto.rezervasyon_bilgileri,
      });

      detaylar.push(detay);
    }

    // Rezervasyon oluştur
    const rezervasyon = this.rezervasyonlarRepository.create({
      kullanici_id: kullaniciId,
      rezervasyon_no: rezervasyonNo,
      toplam_tutar: toplamTutar,
      odeme_yontemi: createRezervasyonDto.odeme_yontemi,
      not: createRezervasyonDto.not,
      detaylar: detaylar,
    });

    return await this.rezervasyonlarRepository.save(rezervasyon);
  }

  async findAll(kullaniciId?: number): Promise<Rezervasyonlar[]> {
    const query = this.rezervasyonlarRepository
      .createQueryBuilder('rezervasyon')
      .leftJoinAndSelect('rezervasyon.kullanici', 'kullanici')
      .leftJoinAndSelect('rezervasyon.detaylar', 'detaylar')
      .leftJoinAndSelect('detaylar.urun', 'urun')
      .orderBy('rezervasyon.id', 'DESC');

    if (kullaniciId) {
      query.where('rezervasyon.kullanici_id = :kullaniciId', { kullaniciId });
    }

    return await query.getMany();
  }

  async findOne(id: number): Promise<Rezervasyonlar> {
    const rezervasyon = await this.rezervasyonlarRepository.findOne({
      where: { id },
      relations: ['kullanici', 'detaylar', 'detaylar.urun'],
    });

    if (!rezervasyon) {
      throw new NotFoundException(`Rezervasyon #${id} bulunamadı`);
    }

    return rezervasyon;
  }

  async findByRezervasyonNo(rezervasyonNo: string): Promise<Rezervasyonlar> {
    const rezervasyon = await this.rezervasyonlarRepository.findOne({
      where: { rezervasyon_no: rezervasyonNo },
      relations: ['kullanici', 'detaylar', 'detaylar.urun'],
    });

    if (!rezervasyon) {
      throw new NotFoundException(
        `Rezervasyon ${rezervasyonNo} bulunamadı`,
      );
    }

    return rezervasyon;
  }

  async update(
    id: number,
    updateRezervasyonDto: UpdateRezervasyonDto,
  ): Promise<Rezervasyonlar> {
    const rezervasyon = await this.findOne(id);
    Object.assign(rezervasyon, updateRezervasyonDto);
    return await this.rezervasyonlarRepository.save(rezervasyon);
  }

  async remove(id: number): Promise<void> {
    const rezervasyon = await this.findOne(id);
    await this.rezervasyonlarRepository.remove(rezervasyon);
  }

  // Rezervasyon numarası oluştur
  private async generateRezervasyonNo(): Promise<string> {
    const yil = new Date().getFullYear();
    const count = await this.rezervasyonlarRepository.count();
    const sira = (count + 1).toString().padStart(6, '0');
    return `RSV-${yil}-${sira}`;
  }

  // Kullanıcının rezervasyonlarını getir
  async getMyRezervasyonlar(kullaniciId: number): Promise<Rezervasyonlar[]> {
    return await this.findAll(kullaniciId);
  }

  // Sepetten rezervasyon oluştur
  async createFromSepet(kullaniciId: number): Promise<Rezervasyonlar> {
    const rezervasyonNo = await this.generateRezervasyonNo();

    const rezervasyon = new Rezervasyonlar();
    rezervasyon.kullanici_id = kullaniciId;
    rezervasyon.rezervasyon_no = rezervasyonNo;
    rezervasyon.toplam_tutar = 0;
    rezervasyon.durum = 'beklemede' as any;
    rezervasyon.odeme_durumu = 'bekleniyor' as any;

    return await this.rezervasyonlarRepository.save(rezervasyon);
  }
}

