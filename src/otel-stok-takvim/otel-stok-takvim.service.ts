import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { OtelStokTakvim } from './entities/otel-stok-takvim.entity';
import { CreateStokTakvimDto } from './dto/create-stok-takvim.dto';
import { UpdateStokTakvimDto } from './dto/update-stok-takvim.dto';

@Injectable()
export class OtelStokTakvimService {
  constructor(
    @InjectRepository(OtelStokTakvim)
    private stokTakvimRepository: Repository<OtelStokTakvim>,
  ) {}

  async findAll(): Promise<OtelStokTakvim[]> {
    return await this.stokTakvimRepository.find({
      relations: ['odaTipi', 'odaTipi.otel'],
      order: { tarih: 'DESC' },
    });
  }

  async findByOdaTipi(odaTipiId: number): Promise<OtelStokTakvim[]> {
    return await this.stokTakvimRepository.find({
      where: { oda_tipi_id: odaTipiId },
      order: { tarih: 'ASC' },
    });
  }

  async findByOtelId(otelId: number): Promise<OtelStokTakvim[]> {
    return await this.stokTakvimRepository
      .createQueryBuilder('stok')
      .leftJoinAndSelect('stok.odaTipi', 'odaTipi')
      .where('odaTipi.otel_id = :otelId', { otelId })
      .orderBy('stok.tarih', 'ASC')
      .getMany();
  }

  async findByDateRange(
    odaTipiId: number,
    baslangicTarihi: string,
    bitisTarihi: string,
  ): Promise<OtelStokTakvim[]> {
    return await this.stokTakvimRepository
      .createQueryBuilder('stok')
      .where('stok.oda_tipi_id = :odaTipiId', { odaTipiId })
      .andWhere('stok.tarih >= :baslangicTarihi', { baslangicTarihi })
      .andWhere('stok.tarih <= :bitisTarihi', { bitisTarihi })
      .orderBy('stok.tarih', 'ASC')
      .getMany();
  }

  async checkAvailability(
    odaTipiId: number,
    girisTarihi: string,
    cikisTarihi: string,
    odaSayisi: number = 1,
  ): Promise<{
    musait: boolean;
    detaylar: any[];
    mesaj: string;
  }> {
    const stoklar = await this.findByDateRange(
      odaTipiId,
      girisTarihi,
      cikisTarihi,
    );

    const giris = new Date(girisTarihi);
    const cikis = new Date(cikisTarihi);
    const geceSayisi = Math.ceil(
      (cikis.getTime() - giris.getTime()) / (1000 * 60 * 60 * 24),
    );

    const detaylar: Array<any> = [];
    let tumGunlerMusait = true;
    let yetersizGunler: Array<string> = [];

    for (let i = 0; i < geceSayisi; i++) {
      const currentDate = new Date(giris);
      currentDate.setDate(giris.getDate() + i);
      const tarihStr = currentDate.toISOString().split('T')[0];

      const stokBilgisi = stoklar.find(
        (s) => s.tarih.toISOString().split('T')[0] === tarihStr,
      );

      if (!stokBilgisi) {
        tumGunlerMusait = false;
        yetersizGunler.push(tarihStr);
        detaylar.push({
          tarih: tarihStr,
          musait: false,
          mesaj: 'Stok bilgisi bulunamadı',
        });
      } else {
        const musaitOdaSayisi = stokBilgisi.musait_oda;
        const musait = musaitOdaSayisi >= odaSayisi;

        if (!musait) {
          tumGunlerMusait = false;
          yetersizGunler.push(tarihStr);
        }

        detaylar.push({
          tarih: tarihStr,
          toplam_oda: stokBilgisi.toplam_oda,
          rezerve_oda: stokBilgisi.rezerve_oda,
          bloke_oda: stokBilgisi.bloke_oda,
          musait_oda: musaitOdaSayisi,
          musait: musait,
          talep_edilen: odaSayisi,
        });
      }
    }

    let mesaj = '';
    if (tumGunlerMusait) {
      mesaj = `${odaSayisi} oda için tüm tarihler müsait`;
    } else {
      mesaj = `Yetersiz oda: ${yetersizGunler.join(', ')}`;
    }

    return {
      musait: tumGunlerMusait,
      detaylar,
      mesaj,
    };
  }

  async rezervasyonYap(
    odaTipiId: number,
    girisTarihi: string,
    cikisTarihi: string,
    odaSayisi: number = 1,
  ): Promise<boolean> {
    const musaitlikKontrolu = await this.checkAvailability(
      odaTipiId,
      girisTarihi,
      cikisTarihi,
      odaSayisi,
    );

    if (!musaitlikKontrolu.musait) {
      throw new BadRequestException(
        `Rezervasyon yapılamıyor: ${musaitlikKontrolu.mesaj}`,
      );
    }

    const giris = new Date(girisTarihi);
    const cikis = new Date(cikisTarihi);
    const geceSayisi = Math.ceil(
      (cikis.getTime() - giris.getTime()) / (1000 * 60 * 60 * 24),
    );

    for (let i = 0; i < geceSayisi; i++) {
      const currentDate = new Date(giris);
      currentDate.setDate(giris.getDate() + i);
      const tarihStr = currentDate.toISOString().split('T')[0];

      const stok = await this.stokTakvimRepository.findOne({
        where: {
          oda_tipi_id: odaTipiId,
          tarih: new Date(tarihStr),
        },
      });

      if (stok) {
        await this.stokTakvimRepository.update(stok.id, {
          rezerve_oda: stok.rezerve_oda + odaSayisi,
        });
      }
    }

    return true;
  }

  async rezervasyonIptal(
    odaTipiId: number,
    girisTarihi: string,
    cikisTarihi: string,
    odaSayisi: number = 1,
  ): Promise<boolean> {
    const giris = new Date(girisTarihi);
    const cikis = new Date(cikisTarihi);
    const geceSayisi = Math.ceil(
      (cikis.getTime() - giris.getTime()) / (1000 * 60 * 60 * 24),
    );

    for (let i = 0; i < geceSayisi; i++) {
      const currentDate = new Date(giris);
      currentDate.setDate(giris.getDate() + i);
      const tarihStr = currentDate.toISOString().split('T')[0];

      const stok = await this.stokTakvimRepository.findOne({
        where: {
          oda_tipi_id: odaTipiId,
          tarih: new Date(tarihStr),
        },
      });

      if (stok) {
        const yeniRezerveOda = Math.max(0, stok.rezerve_oda - odaSayisi);
        await this.stokTakvimRepository.update(stok.id, {
          rezerve_oda: yeniRezerveOda,
        });
      }
    }

    return true;
  }

  async findOne(id: number): Promise<OtelStokTakvim> {
    const stokTakvim = await this.stokTakvimRepository.findOne({
      where: { id },
      relations: ['odaTipi', 'odaTipi.otel'],
    });

    if (!stokTakvim) {
      throw new NotFoundException(`Stok takvimi #${id} bulunamadı`);
    }

    return stokTakvim;
  }

  async create(
    createStokTakvimDto: CreateStokTakvimDto,
  ): Promise<OtelStokTakvim> {
    const stokTakvim = this.stokTakvimRepository.create(createStokTakvimDto);
    return await this.stokTakvimRepository.save(stokTakvim);
  }

  async update(
    id: number,
    updateStokTakvimDto: UpdateStokTakvimDto,
  ): Promise<OtelStokTakvim> {
    await this.findOne(id);
    await this.stokTakvimRepository.update(id, updateStokTakvimDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const stokTakvim = await this.findOne(id);
    await this.stokTakvimRepository.remove(stokTakvim);
  }

  async initializeStokForDateRange(
    odaTipiId: number,
    toplamOda: number,
    baslangicTarihi: string,
    bitisTarihi: string,
  ): Promise<string> {
    const giris = new Date(baslangicTarihi);
    const cikis = new Date(bitisTarihi);
    const gunSayisi = Math.ceil(
      (cikis.getTime() - giris.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1;

    let eklenenSayisi = 0;

    for (let i = 0; i < gunSayisi; i++) {
      const currentDate = new Date(giris);
      currentDate.setDate(giris.getDate() + i);
      const tarihStr = currentDate.toISOString().split('T')[0];

      const mevcutStok = await this.stokTakvimRepository.findOne({
        where: {
          oda_tipi_id: odaTipiId,
          tarih: new Date(tarihStr),
        },
      });

      if (!mevcutStok) {
        await this.create({
          oda_tipi_id: odaTipiId,
          tarih: tarihStr,
          toplam_oda: toplamOda,
          rezerve_oda: 0,
          bloke_oda: 0,
        });
        eklenenSayisi++;
      }
    }

    return `${eklenenSayisi} gün için stok oluşturuldu`;
  }
}

