import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';
import { Odemeler } from './entities/odemeler.entity';
import { OdemeLoglari } from './entities/odeme-loglari.entity';
import { Rezervasyonlar } from '../rezervasyonlar/entities/rezervasyonlar.entity';
import { SepetService } from '../sepet/sepet.service';
import { RezervasyonlarService } from '../rezervasyonlar/rezervasyonlar.service';
import { CreateOdemeDto } from './dto/create-odeme.dto';
import { PaytrCallbackDto } from './dto/paytr-callback.dto';

@Injectable()
export class OdemeService {
  private readonly paytrMerchantId: string;
  private readonly paytrMerchantKey: string;
  private readonly paytrMerchantSalt: string;
  private readonly paytrTestMode: string;
  private readonly paytrOkUrl: string;
  private readonly paytrFailUrl: string;

  constructor(
    @InjectRepository(Odemeler)
    private odemelerRepository: Repository<Odemeler>,
    @InjectRepository(OdemeLoglari)
    private odemeLoglariRepository: Repository<OdemeLoglari>,
    @InjectRepository(Rezervasyonlar)
    private rezervasyonlarRepository: Repository<Rezervasyonlar>,
    private configService: ConfigService,
    private sepetService: SepetService,
    private rezervasyonlarService: RezervasyonlarService,
  ) {
    // PayTR ayarlarını environment'tan al
    this.paytrMerchantId = this.configService.get<string>('PAYTR_MERCHANT_ID', 'MERCHANT_ID');
    this.paytrMerchantKey = this.configService.get<string>('PAYTR_MERCHANT_KEY', 'MERCHANT_KEY');
    this.paytrMerchantSalt = this.configService.get<string>('PAYTR_MERCHANT_SALT', 'MERCHANT_SALT');
    this.paytrTestMode = this.configService.get<string>('PAYTR_TEST_MODE', '1'); // 1: test, 0: production
    this.paytrOkUrl = this.configService.get<string>('PAYTR_OK_URL', 'http://localhost:3001/odeme/basarili');
    this.paytrFailUrl = this.configService.get<string>('PAYTR_FAIL_URL', 'http://localhost:3001/odeme/basarisiz');
  }

  private generateMerchantOid(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `MO${timestamp}${random}`;
  }

  private generateHash(data: any): string {
    const hashStr = data.join('');
    return crypto
      .createHmac('sha256', this.paytrMerchantKey)
      .update(hashStr)
      .digest('base64');
  }

  async createPaytrPayment(
    kullaniciId: number,
    createOdemeDto: CreateOdemeDto,
    kullaniciBilgileri: any,
    ipAdresi: string,
  ) {
    let tutar = createOdemeDto.tutar;
    let rezervasyonId = createOdemeDto.rezervasyonId;
    let sepetItems: any[] = [];

    // Sepetten mi yoksa doğrudan rezervasyondan mı?
    if (createOdemeDto.kaynak === 'sepet') {
      // Sepet toplamını al
      const sepetToplam = await this.sepetService.getSepetToplami(kullaniciId);
      
      if (sepetToplam.adetSayisi === 0) {
        throw new BadRequestException('Sepetiniz boş');
      }

      tutar = sepetToplam.toplamTutar;
      sepetItems = sepetToplam.sepetItems;

      // Önce rezervasyon oluştur
      const rezervasyon = await this.rezervasyonlarService.createFromSepet(kullaniciId);
      rezervasyonId = rezervasyon.id;

      // Sepeti temizle
      await this.sepetService.clearSepet(kullaniciId);
    } else if (createOdemeDto.kaynak === 'rezervasyon') {
      if (!rezervasyonId) {
        throw new BadRequestException('Rezervasyon ID gerekli');
      }

      const rezervasyon = await this.rezervasyonlarRepository.findOne({
        where: { id: rezervasyonId, kullanici_id: kullaniciId },
      });

      if (!rezervasyon) {
        throw new NotFoundException('Rezervasyon bulunamadı');
      }

      tutar = tutar || Number(rezervasyon.toplam_tutar);
    }

    const merchantOid = this.generateMerchantOid();
    const paraBirimi = createOdemeDto.paraBirimi || 'TRY';
    const taksitSayisi = createOdemeDto.taksitSayisi || 1;

    // Tutar kontrolü
    if (!tutar || tutar <= 0) {
      throw new BadRequestException('Geçerli bir tutar bulunamadı');
    }

    // Sepet bilgilerini hazırla (PayTR formatı)
    const userBasket = sepetItems.length > 0
      ? sepetItems.map((item: any) => [item.urun.baslik, item.toplamFiyat, item.miktar])
      : [['Rezervasyon', tutar, 1]];

    const userBasketStr = Buffer.from(JSON.stringify(userBasket)).toString('base64');

    // Kullanıcı bilgileri
    const userName = kullaniciBilgileri.ad || 'Kullanıcı';
    const userSurname = kullaniciBilgileri.soyad || 'Kullanıcı';
    const userEmail = kullaniciBilgileri.email || 'user@example.com';
    const userPhone = kullaniciBilgileri.telefon || '5555555555';
    const userAddress = kullaniciBilgileri.adres || 'Adres bilgisi yok';

    // Hash oluştur
    const hashData = [
      this.paytrMerchantId,
      ipAdresi,
      merchantOid,
      userEmail,
      (tutar * 100).toFixed(0), // Kuruş cinsinden
      userBasketStr,
      taksitSayisi === 1 ? 'no_installment' : '',
      this.paytrTestMode,
      this.paytrMerchantSalt,
    ];

    const paytrToken = this.generateHash(hashData);

    // PayTR API'ye istek gönder
    const paytrData = {
      merchant_id: this.paytrMerchantId,
      user_ip: ipAdresi,
      merchant_oid: merchantOid,
      email: userEmail,
      payment_amount: (tutar * 100).toFixed(0),
      paytr_token: paytrToken,
      user_basket: userBasketStr,
      debug_on: this.paytrTestMode,
      no_installment: taksitSayisi === 1 ? '1' : '0',
      max_installment: taksitSayisi > 1 ? taksitSayisi.toString() : '0',
      user_name: userName,
      user_address: userAddress,
      user_phone: userPhone,
      merchant_ok_url: this.paytrOkUrl,
      merchant_fail_url: this.paytrFailUrl,
      timeout_limit: '30',
      currency: paraBirimi,
      test_mode: this.paytrTestMode,
    };

    try {
      const response = await axios.post(
        'https://www.paytr.com/odeme/api/get-token',
        new URLSearchParams(paytrData as any),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const paytrResponse = response.data;

      // Ödeme kaydı oluştur
      const odeme = this.odemelerRepository.create({
        rezervasyonId,
        kullaniciId,
        merchantOid,
        tutar,
        paraBirimi,
        durum: 'beklemede',
        odemeYontemi: 'paytr',
        paytrToken,
        hashValue: paytrToken,
        taksitSayisi,
        ipAdresi,
        callbackData: { paytrRequest: paytrData, paytrResponse },
      });

      const savedOdeme = await this.odemelerRepository.save(odeme);

      // Log kaydet
      await this.logOdeme({
        odemeId: savedOdeme.id,
        merchantOid,
        logTipi: 'success',
        istekVerisi: paytrData,
        yanitVerisi: paytrResponse,
        ipAdresi,
      });

      if (paytrResponse.status === 'success') {
        // PayTR ödeme iframe URL'i
        const paymentUrl = `https://www.paytr.com/odeme/guvenli/${paytrResponse.token}`;
        
        savedOdeme.paytrPaymentUrl = paymentUrl;
        await this.odemelerRepository.save(savedOdeme);

        return {
          success: true,
          odemeId: savedOdeme.id,
          merchantOid,
          paymentUrl,
          token: paytrResponse.token,
        };
      } else {
        throw new BadRequestException(
          paytrResponse.reason || 'PayTR ödeme başlatılamadı',
        );
      }
    } catch (error) {
      // Hata logu
      await this.logOdeme({
        merchantOid,
        logTipi: 'error',
        istekVerisi: paytrData,
        yanitVerisi: { error: error.message },
        ipAdresi,
      });

      throw new BadRequestException(
        'Ödeme işlemi başlatılamadı: ' + error.message,
      );
    }
  }

  async handlePaytrCallback(callbackData: PaytrCallbackDto, ipAdresi: string) {
    const { merchant_oid, status, total_amount, hash } = callbackData;

    // Ödemeyi bul
    const odeme = await this.odemelerRepository.findOne({
      where: { merchantOid: merchant_oid },
      relations: ['rezervasyon'],
    });

    if (!odeme) {
      await this.logOdeme({
        merchantOid: merchant_oid,
        logTipi: 'error',
        istekVerisi: callbackData,
        yanitVerisi: { error: 'Ödeme bulunamadı' },
        ipAdresi,
      });
      throw new NotFoundException('Ödeme bulunamadı');
    }

    // Hash doğrulama
    const expectedHash = crypto
      .createHmac('sha256', this.paytrMerchantKey)
      .update(merchant_oid + this.paytrMerchantSalt + status + total_amount)
      .digest('base64');

    if (hash !== expectedHash) {
      await this.logOdeme({
        odemeId: odeme.id,
        merchantOid: merchant_oid,
        logTipi: 'error',
        istekVerisi: callbackData,
        yanitVerisi: { error: 'Hash doğrulama hatası' },
        ipAdresi,
      });
      throw new BadRequestException('Hash doğrulama hatası');
    }

    // Ödeme durumunu güncelle
    if (status === 'success') {
      odeme.durum = 'basarili';
      odeme.odemeTarihi = new Date();
      odeme.callbackData = { ...odeme.callbackData, callback: callbackData };

      // Rezervasyon durumunu güncelle
      if (odeme.rezervasyon) {
        odeme.rezervasyon.odeme_durumu = 'odendi' as any;
        odeme.rezervasyon.durum = 'onaylandi' as any;
        await this.rezervasyonlarRepository.save(odeme.rezervasyon);
      }
    } else {
      odeme.durum = 'basarisiz';
      odeme.hataMesaji = callbackData.failed_reason_msg || 'Ödeme başarısız';
      odeme.callbackData = { ...odeme.callbackData, callback: callbackData };

      // Rezervasyon durumunu güncelle
      if (odeme.rezervasyon) {
        odeme.rezervasyon.odeme_durumu = 'bekleniyor' as any;
        odeme.rezervasyon.durum = 'beklemede' as any;
        await this.rezervasyonlarRepository.save(odeme.rezervasyon);
      }
    }

    await this.odemelerRepository.save(odeme);

    // Log kaydet
    await this.logOdeme({
      odemeId: odeme.id,
      merchantOid: merchant_oid,
      logTipi: 'callback',
      istekVerisi: callbackData,
      yanitVerisi: { status: 'processed' },
      ipAdresi,
    });

    return { success: true, status: odeme.durum };
  }

  private async logOdeme(logData: {
    odemeId?: number;
    merchantOid: string;
    logTipi: string;
    istekVerisi: any;
    yanitVerisi: any;
    ipAdresi: string;
  }) {
    const log = this.odemeLoglariRepository.create(logData);
    return this.odemeLoglariRepository.save(log);
  }

  async findAll() {
    return this.odemelerRepository.find({
      relations: ['kullanici', 'rezervasyon'],
      order: { olusturmaTarihi: 'DESC' },
    });
  }

  async findByKullanici(kullaniciId: number) {
    return this.odemelerRepository.find({
      where: { kullaniciId },
      relations: ['rezervasyon'],
      order: { olusturmaTarihi: 'DESC' },
    });
  }

  async findOne(id: number) {
    const odeme = await this.odemelerRepository.findOne({
      where: { id },
      relations: ['kullanici', 'rezervasyon'],
    });

    if (!odeme) {
      throw new NotFoundException('Ödeme bulunamadı');
    }

    return odeme;
  }

  async findByMerchantOid(merchantOid: string) {
    const odeme = await this.odemelerRepository.findOne({
      where: { merchantOid },
      relations: ['kullanici', 'rezervasyon'],
    });

    if (!odeme) {
      throw new NotFoundException('Ödeme bulunamadı');
    }

    return odeme;
  }
}

