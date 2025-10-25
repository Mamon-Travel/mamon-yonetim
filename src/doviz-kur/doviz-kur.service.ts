import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DovizKur } from './entities/doviz-kur.entity';
import { CreateDovizKurDto } from './dto/create-doviz-kur.dto';
import { UpdateDovizKurDto } from './dto/update-doviz-kur.dto';
import * as xml2js from 'xml2js';

@Injectable()
export class DovizKurService {
  constructor(
    @InjectRepository(DovizKur)
    private dovizKurRepository: Repository<DovizKur>,
    private httpService: HttpService,
  ) {}

  async findAll(): Promise<DovizKur[]> {
    return await this.dovizKurRepository.find({
      order: { kur_tarihi: 'DESC', para_birimi: 'ASC' },
    });
  }

  async findGuncelKurlar(): Promise<DovizKur[]> {
    const bugun = new Date().toISOString().split('T')[0];
    return await this.dovizKurRepository.find({
      where: { kur_tarihi: new Date(bugun), durum: 1 },
      order: { para_birimi: 'ASC' },
    });
  }

  async findByParaBirimi(paraBirimi: string): Promise<DovizKur> {
    const bugun = new Date().toISOString().split('T')[0];
    const kur = await this.dovizKurRepository.findOne({
      where: {
        para_birimi: paraBirimi.toUpperCase(),
        kur_tarihi: new Date(bugun),
        durum: 1,
      },
    });

    if (!kur) {
      throw new NotFoundException(
        `${paraBirimi} için güncel kur bulunamadı`,
      );
    }

    return kur;
  }

  async cevirParaBirimi(
    miktar: number,
    kaynakBirim: string,
    hedefBirim: string,
  ): Promise<{ cevrilen_miktar: number; kur: number }> {
    if (kaynakBirim.toUpperCase() === hedefBirim.toUpperCase()) {
      return { cevrilen_miktar: miktar, kur: 1 };
    }

    // TRY → Döviz veya Döviz → TRY
    if (kaynakBirim.toUpperCase() === 'TRY') {
      const hedefKur = await this.findByParaBirimi(hedefBirim);
      const cevrilenMiktar = miktar / Number(hedefKur.alis_kuru);
      return { cevrilen_miktar: cevrilenMiktar, kur: Number(hedefKur.alis_kuru) };
    } else if (hedefBirim.toUpperCase() === 'TRY') {
      const kaynakKur = await this.findByParaBirimi(kaynakBirim);
      const cevrilenMiktar = miktar * Number(kaynakKur.satis_kuru);
      return { cevrilen_miktar: cevrilenMiktar, kur: Number(kaynakKur.satis_kuru) };
    } else {
      // Döviz → Döviz (önce TRY'ye, sonra hedefe)
      const kaynakKur = await this.findByParaBirimi(kaynakBirim);
      const hedefKur = await this.findByParaBirimi(hedefBirim);
      const tryMiktar = miktar * Number(kaynakKur.satis_kuru);
      const cevrilenMiktar = tryMiktar / Number(hedefKur.alis_kuru);
      return { cevrilen_miktar: cevrilenMiktar, kur: Number(kaynakKur.satis_kuru) / Number(hedefKur.alis_kuru) };
    }
  }

  async fetchTCMBKurlar(): Promise<any> {
    try {
      // TCMB XML API
      const url = `https://www.tcmb.gov.tr/kurlar/today.xml`;
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: { 
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'application/xml',
          },
          timeout: 10000,
        }),
      );

      const parser = new xml2js.Parser({
        explicitArray: false,
        mergeAttrs: true,
      });
      
      const result = await parser.parseStringPromise(response.data);

      if (!result.Tarih_Date || !result.Tarih_Date.Currency) {
        throw new Error('TCMB XML formatı beklenenden farklı');
      }

      const currencies = Array.isArray(result.Tarih_Date.Currency)
        ? result.Tarih_Date.Currency
        : [result.Tarih_Date.Currency];

      const kurlar = currencies.map((currency: any) => ({
        kod: currency.CurrencyCode || currency.Kod,
        isim: currency.Isim,
        forex_alis: parseFloat(currency.ForexBuying || '0'),
        forex_satis: parseFloat(currency.ForexSelling || '0'),
        banknote_alis: parseFloat(currency.BanknoteBuying || '0'),
        banknote_satis: parseFloat(currency.BanknoteSelling || '0'),
      }));

      return kurlar;
    } catch (error) {
      console.error('TCMB API Hatası:', error);
      throw new Error(`TCMB kurları çekilemedi: ${error.message}`);
    }
  }

  async guncelleTCMBKurlar(yuzdeMarj: number = 2.5): Promise<{
    success: boolean;
    mesaj: string;
    guncellenen_sayisi: number;
    detaylar: any[];
  }> {
    try {
      const tcmbKurlar = await this.fetchTCMBKurlar();
      const bugun = new Date().toISOString().split('T')[0];

      let guncellenenSayisi = 0;
      const detaylar: Array<{
        para_birimi: string;
        islem: string;
        tcmb_alis: number;
        tcmb_satis: number;
      }> = [];

      const onemliParalar = ['USD', 'EUR', 'GBP', 'CHF', 'RUB'];

      for (const kur of tcmbKurlar) {
        if (!onemliParalar.includes(kur.kod)) continue;

        const tcmbAlis = kur.forex_alis || kur.banknote_alis || 0;
        const tcmbSatis = kur.forex_satis || kur.banknote_satis || 0;

        if (tcmbAlis === 0 || tcmbSatis === 0) continue;

        // Mevcut kaydı kontrol et
        const mevcutKur = await this.dovizKurRepository.findOne({
          where: {
            para_birimi: kur.kod,
            kur_tarihi: new Date(bugun),
          },
        });

        if (mevcutKur) {
          // Güncelle
          await this.dovizKurRepository.update(mevcutKur.id, {
            tcmb_alis: tcmbAlis,
            tcmb_satis: tcmbSatis,
            yuzde_marj: yuzdeMarj,
            para_adi: kur.isim,
          });
          detaylar.push({
            para_birimi: kur.kod,
            islem: 'güncellendi',
            tcmb_alis: tcmbAlis,
            tcmb_satis: tcmbSatis,
          });
        } else {
          // Yeni kayıt
          await this.create({
            para_birimi: kur.kod,
            para_adi: kur.isim,
            tcmb_alis: tcmbAlis,
            tcmb_satis: tcmbSatis,
            yuzde_marj: yuzdeMarj,
            kur_tarihi: bugun,
            durum: 1,
          });
          detaylar.push({
            para_birimi: kur.kod,
            islem: 'oluşturuldu',
            tcmb_alis: tcmbAlis,
            tcmb_satis: tcmbSatis,
          });
        }

        guncellenenSayisi++;
      }

      return {
        success: true,
        mesaj: `${guncellenenSayisi} para birimi güncellendi`,
        guncellenen_sayisi: guncellenenSayisi,
        detaylar,
      };
    } catch (error) {
      throw new Error('TCMB kurları güncellenemedi: ' + error.message);
    }
  }

  async findOne(id: number): Promise<DovizKur> {
    const kur = await this.dovizKurRepository.findOne({
      where: { id },
    });

    if (!kur) {
      throw new NotFoundException(`Kur #${id} bulunamadı`);
    }

    return kur;
  }

  async create(createDovizKurDto: CreateDovizKurDto): Promise<DovizKur> {
    const kur = this.dovizKurRepository.create(createDovizKurDto);
    return await this.dovizKurRepository.save(kur);
  }

  async update(
    id: number,
    updateDovizKurDto: UpdateDovizKurDto,
  ): Promise<DovizKur> {
    await this.findOne(id);
    await this.dovizKurRepository.update(id, updateDovizKurDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const kur = await this.findOne(id);
    await this.dovizKurRepository.remove(kur);
  }
}

