import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { OtelFiyatTakvim } from './entities/otel-fiyat-takvim.entity';
import { CreateFiyatTakvimDto } from './dto/create-fiyat-takvim.dto';
import { UpdateFiyatTakvimDto } from './dto/update-fiyat-takvim.dto';

@Injectable()
export class OtelFiyatTakvimService {
  constructor(
    @InjectRepository(OtelFiyatTakvim)
    private fiyatTakvimRepository: Repository<OtelFiyatTakvim>,
  ) {}

  async findAll(): Promise<OtelFiyatTakvim[]> {
    return await this.fiyatTakvimRepository.find({
      relations: ['odaTipi', 'odaTipi.otel', 'pansiyonTipi'],
      order: { baslangic_tarihi: 'DESC' },
    });
  }

  async findByOdaTipi(odaTipiId: number): Promise<OtelFiyatTakvim[]> {
    return await this.fiyatTakvimRepository.find({
      where: { oda_tipi_id: odaTipiId, durum: 1 },
      relations: ['pansiyonTipi'],
      order: { baslangic_tarihi: 'ASC' },
    });
  }

  async findByOtelId(otelId: number): Promise<OtelFiyatTakvim[]> {
    return await this.fiyatTakvimRepository
      .createQueryBuilder('fiyat')
      .leftJoinAndSelect('fiyat.odaTipi', 'odaTipi')
      .leftJoinAndSelect('fiyat.pansiyonTipi', 'pansiyonTipi')
      .where('odaTipi.otel_id = :otelId', { otelId })
      .andWhere('fiyat.durum = 1')
      .orderBy('fiyat.baslangic_tarihi', 'ASC')
      .getMany();
  }

  async findByDateRange(
    odaTipiId: number,
    baslangicTarihi: string,
    bitisTarihi: string,
  ): Promise<OtelFiyatTakvim[]> {
    return await this.fiyatTakvimRepository
      .createQueryBuilder('fiyat')
      .where('fiyat.oda_tipi_id = :odaTipiId', { odaTipiId })
      .andWhere('fiyat.durum = 1')
      .andWhere(
        '(fiyat.baslangic_tarihi <= :bitisTarihi AND fiyat.bitis_tarihi >= :baslangicTarihi)',
        { baslangicTarihi, bitisTarihi },
      )
      .leftJoinAndSelect('fiyat.pansiyonTipi', 'pansiyonTipi')
      .orderBy('fiyat.baslangic_tarihi', 'ASC')
      .getMany();
  }

  async getFiyatForDate(
    odaTipiId: number,
    tarih: string,
    pansiyonTipiId?: number,
  ): Promise<{ fiyat: number; min_konaklama_gece: number } | null> {
    const query = this.fiyatTakvimRepository
      .createQueryBuilder('fiyat')
      .where('fiyat.oda_tipi_id = :odaTipiId', { odaTipiId })
      .andWhere('fiyat.baslangic_tarihi <= :tarih', { tarih })
      .andWhere('fiyat.bitis_tarihi >= :tarih', { tarih })
      .andWhere('fiyat.durum = 1');

    if (pansiyonTipiId) {
      query.andWhere('fiyat.pansiyon_tipi_id = :pansiyonTipiId', {
        pansiyonTipiId,
      });
    } else {
      query.andWhere('fiyat.pansiyon_tipi_id IS NULL');
    }

    query.orderBy('fiyat.id', 'DESC').limit(1);

    const fiyatTakvim = await query.getOne();

    if (!fiyatTakvim) {
      return null;
    }

    return {
      fiyat: Number(fiyatTakvim.fiyat),
      min_konaklama_gece: fiyatTakvim.min_konaklama_gece,
    };
  }

  async calculateTotalPrice(
    odaTipiId: number,
    girisTarihi: string,
    cikisTarihi: string,
    pansiyonTipiId?: number,
  ): Promise<{ toplam_fiyat: number; gece_sayisi: number; gunluk_fiyatlar: any[] }> {
    const giris = new Date(girisTarihi);
    const cikis = new Date(cikisTarihi);
    const geceSayisi = Math.ceil(
      (cikis.getTime() - giris.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (geceSayisi <= 0) {
      throw new BadRequestException('Çıkış tarihi giriş tarihinden sonra olmalı');
    }

    const gunlukFiyatlar: Array<{ tarih: string; fiyat: number }> = [];
    let toplamFiyat = 0;

    for (let i = 0; i < geceSayisi; i++) {
      const currentDate = new Date(giris);
      currentDate.setDate(giris.getDate() + i);
      const tarihStr = currentDate.toISOString().split('T')[0];

      const fiyatBilgisi = await this.getFiyatForDate(
        odaTipiId,
        tarihStr,
        pansiyonTipiId,
      );

      if (!fiyatBilgisi) {
        throw new NotFoundException(
          `${tarihStr} tarihi için fiyat bulunamadı`,
        );
      }

      gunlukFiyatlar.push({
        tarih: tarihStr,
        fiyat: fiyatBilgisi.fiyat,
      });

      toplamFiyat += fiyatBilgisi.fiyat;
    }

    return {
      toplam_fiyat: toplamFiyat,
      gece_sayisi: geceSayisi,
      gunluk_fiyatlar: gunlukFiyatlar,
    };
  }

  async findOne(id: number): Promise<OtelFiyatTakvim> {
    const fiyatTakvim = await this.fiyatTakvimRepository.findOne({
      where: { id },
      relations: ['odaTipi', 'odaTipi.otel', 'pansiyonTipi'],
    });

    if (!fiyatTakvim) {
      throw new NotFoundException(`Fiyat takvimi #${id} bulunamadı`);
    }

    return fiyatTakvim;
  }

  async create(
    createFiyatTakvimDto: CreateFiyatTakvimDto,
  ): Promise<OtelFiyatTakvim> {
    const fiyatTakvim = this.fiyatTakvimRepository.create(createFiyatTakvimDto);
    return await this.fiyatTakvimRepository.save(fiyatTakvim);
  }

  async update(
    id: number,
    updateFiyatTakvimDto: UpdateFiyatTakvimDto,
  ): Promise<OtelFiyatTakvim> {
    await this.findOne(id);
    await this.fiyatTakvimRepository.update(id, updateFiyatTakvimDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const fiyatTakvim = await this.findOne(id);
    await this.fiyatTakvimRepository.remove(fiyatTakvim);
  }
}

