import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GenerateContentDto } from './dto/generate-content.dto';
import { GenerateOtelContentDto, ContentType } from './dto/generate-otel-content.dto';

@Injectable()
export class AiService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.deepseek.com/v1/chat/completions';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('DEEPSEEK_API_KEY') || '';
    
    if (!this.apiKey) {
      console.warn('⚠️ DEEPSEEK_API_KEY bulunamadı! AI özellikleri çalışmayacak.');
    }
  }

  /**
   * Genel amaçlı içerik oluşturma
   */
  async generateContent(dto: GenerateContentDto): Promise<string> {
    if (!this.apiKey) {
      throw new HttpException(
        'AI servisi yapılandırılmamış. Lütfen DEEPSEEK_API_KEY ayarlayın.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    try {
      const systemPrompt = 'Sen profesyonel bir otel ve turizm içerik yazarısın. Türkçe, akıcı, satış odaklı ve SEO uyumlu içerikler oluşturuyorsun.';
      
      const userPrompt = dto.context 
        ? `Bağlam: ${dto.context}\n\nİstek: ${dto.prompt}`
        : dto.prompt;

      const response = await axios.post(
        this.apiUrl,
        {
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        },
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('DeepSeek API Hatası:', error.response?.data || error.message);
      throw new HttpException(
        'İçerik oluşturulurken hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Otel için özel içerik oluşturma
   */
  async generateOtelContent(dto: GenerateOtelContentDto): Promise<string> {
    const { otelAdi, yildiz, konsept, sehir, bolge, contentType } = dto;

    // Bağlam oluştur
    let context = `Otel: ${otelAdi} (${yildiz} yıldız)`;
    if (konsept) context += `, Konsept: ${konsept}`;
    if (sehir) context += `, Şehir: ${sehir}`;
    if (bolge) context += `, Bölge: ${bolge}`;

    // İçerik tipine göre prompt oluştur
    let prompt = '';
    switch (contentType) {
      case ContentType.KISA_ACIKLAMA:
        prompt = 'Bu otel için kısa, çekici ve satış odaklı bir açıklama yaz (2-3 cümle, maksimum 150 kelime). Otelin öne çıkan özelliklerini vurgula.';
        break;
      case ContentType.UZUN_ACIKLAMA:
        prompt = 'Bu otel için detaylı, kapsamlı ve satış odaklı bir açıklama yaz (300-500 kelime). Otelin konumunu, özelliklerini, hizmetlerini, konseptini ve misafir deneyimini profesyonel bir dille anlat. SEO uyumlu olmasına dikkat et.';
        break;
      case ContentType.META_ACIKLAMA:
        prompt = 'Bu otel için SEO uyumlu meta açıklama yaz (maksimum 160 karakter). Anahtar kelimeleri doğal bir şekilde kullan ve tıklanmayı teşvik et.';
        break;
    }

    return this.generateContent({ prompt, context });
  }

  /**
   * Toplu içerik oluşturma (kısa + uzun açıklama)
   */
  async generateMultipleOtelContent(dto: Omit<GenerateOtelContentDto, 'contentType'>): Promise<{
    kisaAciklama: string;
    uzunAciklama: string;
  }> {
    const [kisaAciklama, uzunAciklama] = await Promise.all([
      this.generateOtelContent({ ...dto, contentType: ContentType.KISA_ACIKLAMA }),
      this.generateOtelContent({ ...dto, contentType: ContentType.UZUN_ACIKLAMA }),
    ]);

    return { kisaAciklama, uzunAciklama };
  }

  /**
   * Mevcut metni iyileştirme
   */
  async improveText(text: string, instructions?: string): Promise<string> {
    const prompt = instructions
      ? `Şu metni ${instructions} şekilde iyileştir: "${text}"`
      : `Şu metni daha profesyonel, akıcı ve satış odaklı hale getir: "${text}"`;

    return this.generateContent({ prompt });
  }

  /**
   * Metni özetleme
   */
  async summarizeText(text: string, maxLength: number = 150): Promise<string> {
    const prompt = `Şu metni maksimum ${maxLength} kelime ile özetle: "${text}"`;
    return this.generateContent({ prompt });
  }

  /**
   * SEO anahtar kelimeleri önerme
   */
  async suggestKeywords(otelAdi: string, sehir?: string, konsept?: string): Promise<string[]> {
    let context = `Otel: ${otelAdi}`;
    if (sehir) context += `, Şehir: ${sehir}`;
    if (konsept) context += `, Konsept: ${konsept}`;

    const prompt = 'Bu otel için SEO anahtar kelimeleri öner (virgülle ayrılmış liste olarak, Türkçe)';
    
    const result = await this.generateContent({ prompt, context });
    return result.split(',').map(k => k.trim()).filter(k => k.length > 0);
  }
}

