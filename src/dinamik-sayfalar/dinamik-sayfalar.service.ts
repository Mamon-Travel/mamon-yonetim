import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DinamikSayfa } from './entities/dinamik-sayfa.entity';
import { CreateDinamikSayfaDto } from './dto/create-dinamik-sayfa.dto';
import { UpdateDinamikSayfaDto } from './dto/update-dinamik-sayfa.dto';
import { Otel } from '../otel/entities/otel.entity';

@Injectable()
export class DinamikSayfalarService {
  constructor(
    @InjectRepository(DinamikSayfa)
    private dinamikSayfaRepository: Repository<DinamikSayfa>,
    @InjectRepository(Otel)
    private otelRepository: Repository<Otel>,
  ) {}

  // Yeni sayfa oluştur
  async create(createDto: CreateDinamikSayfaDto): Promise<DinamikSayfa> {
    const sayfa = this.dinamikSayfaRepository.create(createDto);
    return this.dinamikSayfaRepository.save(sayfa);
  }

  // Tüm sayfaları listele
  async findAll(): Promise<DinamikSayfa[]> {
    return this.dinamikSayfaRepository.find({
      order: { sira: 'ASC', olusturma_tarihi: 'DESC' },
    });
  }

  // Aktif sayfaları listele
  async findActive(): Promise<DinamikSayfa[]> {
    return this.dinamikSayfaRepository.find({
      where: { durum: 1 },
      order: { sira: 'ASC' },
    });
  }

  // Slug ile sayfa getir
  async findBySlug(slug: string): Promise<DinamikSayfa> {
    const sayfa = await this.dinamikSayfaRepository.findOne({
      where: { slug },
    });

    if (!sayfa) {
      throw new NotFoundException(`${slug} sayfası bulunamadı`);
    }

    return sayfa;
  }

  // ID ile sayfa getir
  async findOne(id: number): Promise<DinamikSayfa> {
    const sayfa = await this.dinamikSayfaRepository.findOne({
      where: { id },
    });

    if (!sayfa) {
      throw new NotFoundException(`${id} ID'li sayfa bulunamadı`);
    }

    return sayfa;
  }

  // Sayfa güncelle
  async update(id: number, updateDto: UpdateDinamikSayfaDto): Promise<DinamikSayfa> {
    const sayfa = await this.findOne(id);
    Object.assign(sayfa, updateDto);
    return this.dinamikSayfaRepository.save(sayfa);
  }

  // Sayfa sil
  async remove(id: number): Promise<void> {
    const sayfa = await this.findOne(id);
    await this.dinamikSayfaRepository.remove(sayfa);
  }

  // 🎯 ÖNEMLİ: Filtrelere göre otelleri getir
  async getOtellerByFiltre(sayfaId: number): Promise<Otel[]> {
    const sayfa = await this.findOne(sayfaId);
    return this.filterOteller(sayfa.filtre_kriterleri);
  }

  // Slug ile filtrelere göre otelleri getir (Site için)
  async getOtellerBySlug(slug: string): Promise<{
    sayfa: DinamikSayfa;
    oteller: Otel[];
  }> {
    const sayfa = await this.findBySlug(slug);
    const oteller = await this.filterOteller(sayfa.filtre_kriterleri);

    return {
      sayfa,
      oteller,
    };
  }

  // Filtre uygula ve otelleri getir
  private async filterOteller(filtreler: any): Promise<Otel[]> {
    const queryBuilder = this.otelRepository
      .createQueryBuilder('otel')
      .leftJoinAndSelect('otel.detay', 'detay')
      .leftJoinAndSelect('otel.gorseller', 'gorseller')
      .leftJoinAndSelect('otel.odaTipleri', 'odaTipleri')
      .leftJoinAndSelect('otel.otelOzellikleri', 'ozellikler')
      .where('otel.durum = :durum', { durum: 1 }); // Sadece aktif oteller

    // Bölge filtresi
    if (filtreler.bolgeler && filtreler.bolgeler.length > 0) {
      queryBuilder.andWhere('(otel.sehir IN (:...bolgeler) OR otel.bolge IN (:...bolgeler))', {
        bolgeler: filtreler.bolgeler,
      });
    }

    // Yıldız filtresi
    if (filtreler.yildiz && filtreler.yildiz.length > 0) {
      queryBuilder.andWhere('otel.yildiz IN (:...yildizlar)', {
        yildizlar: filtreler.yildiz,
      });
    }

    // Konsept filtresi
    if (filtreler.konseptler && filtreler.konseptler.length > 0) {
      queryBuilder.andWhere('otel.konsept IN (:...konseptler)', {
        konseptler: filtreler.konseptler,
      });
    }

    // Fiyat filtresi
    if (filtreler.min_fiyat) {
      queryBuilder.andWhere('otel.min_fiyat >= :min_fiyat', {
        min_fiyat: filtreler.min_fiyat,
      });
    }

    if (filtreler.max_fiyat) {
      queryBuilder.andWhere('otel.min_fiyat <= :max_fiyat', {
        max_fiyat: filtreler.max_fiyat,
      });
    }

    // Özellik filtresi (otel özelliklerine göre)
    if (filtreler.ozellikler && filtreler.ozellikler.length > 0) {
      queryBuilder.andWhere('ozellikler.id IN (:...ozellikler)', {
        ozellikler: filtreler.ozellikler,
      });
    }

    // Kategori filtresi (eğer otel kategorisi varsa)
    if (filtreler.kategoriler && filtreler.kategoriler.length > 0) {
      queryBuilder.andWhere('otel.kategori_id IN (:...kategoriler)', {
        kategoriler: filtreler.kategoriler,
      });
    }

    // Sıralama: En düşük fiyattan başla
    queryBuilder.orderBy('otel.min_fiyat', 'ASC');

    return queryBuilder.getMany();
  }
}

