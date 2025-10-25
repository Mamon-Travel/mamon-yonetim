# DeepSeek AI Entegrasyonu

Bu proje, DeepSeek AI API'sini kullanarak otel içeriklerini otomatik oluşturma özelliğine sahiptir.

## 🚀 Kurulum

### 1. DeepSeek API Key Alma

1. [https://platform.deepseek.com](https://platform.deepseek.com) adresine gidin
2. Hesap oluşturun veya giriş yapın
3. API Keys bölümünden yeni bir API anahtarı oluşturun

### 2. Ortam Değişkeni Ayarlama

`.env` dosyanıza aşağıdaki satırı ekleyin:

```env
DEEPSEEK_API_KEY=your_api_key_here
```

### 3. Backend'i Başlatma

```bash
cd mamon-yonetim
npm install
npm run start:dev
```

## 📚 API Endpoints

### Genel İçerik Oluşturma
```
POST /ai/generate
Body: {
  "prompt": "Antalya'da lüks bir otel için açıklama yaz",
  "context": "5 yıldızlı otel, deniz kenarı"
}
```

### Otel İçeriği Oluşturma
```
POST /ai/otel/generate
Body: {
  "otelAdi": "Luxury Beach Hotel",
  "yildiz": 5,
  "konsept": "Ultra Her Şey Dahil",
  "sehir": "Antalya",
  "bolge": "Belek",
  "contentType": "kisa_aciklama" // veya "uzun_aciklama", "meta_aciklama"
}
```

### Toplu İçerik Oluşturma
```
POST /ai/otel/generate-multiple
Body: {
  "otelAdi": "Luxury Beach Hotel",
  "yildiz": 5,
  "konsept": "Ultra Her Şey Dahil",
  "sehir": "Antalya",
  "bolge": "Belek"
}
Response: {
  "kisaAciklama": "...",
  "uzunAciklama": "..."
}
```

### Metin İyileştirme
```
POST /ai/improve
Body: {
  "text": "İyileştirilecek metin",
  "instructions": "daha profesyonel yap" // opsiyonel
}
```

### Metin Özetleme
```
POST /ai/summarize
Body: {
  "text": "Özetlenecek uzun metin",
  "maxLength": 150 // opsiyonel, varsayılan: 150
}
```

### Anahtar Kelime Önerisi
```
POST /ai/keywords
Body: {
  "otelAdi": "Luxury Beach Hotel",
  "sehir": "Antalya",
  "konsept": "Ultra Her Şey Dahil"
}
Response: {
  "keywords": ["antalya otel", "lüks otel belek", ...]
}
```

## 🎨 Frontend Kullanımı

### Otel Düzenleme Sayfasında AI Özellikleri

Otel düzenleme sayfasında (`/otel/[id]/duzenle`):

1. **Tüm Açıklamaları AI ile Oluştur**: Kısa ve uzun açıklamayı aynı anda oluşturur
2. **AI ile Oluştur** (Her alan için): Tek bir açıklama oluşturur
3. **İyileştir**: Mevcut metni AI ile geliştirir

### Servis Kullanımı

```typescript
import {
  generateOtelContent,
  generateMultipleOtelContent,
  improveText,
  ContentType
} from '@/services/ai.service';

// Tek içerik oluşturma
const content = await generateOtelContent({
  otelAdi: 'Luxury Hotel',
  yildiz: 5,
  konsept: 'Her Şey Dahil',
  sehir: 'Antalya',
  bolge: 'Belek',
  contentType: ContentType.KISA_ACIKLAMA
});

// Toplu içerik oluşturma
const { kisaAciklama, uzunAciklama } = await generateMultipleOtelContent({
  otelAdi: 'Luxury Hotel',
  yildiz: 5,
  konsept: 'Her Şey Dahil',
  sehir: 'Antalya'
});

// Metin iyileştirme
const improved = await improveText(
  'Mevcut açıklama',
  'daha satış odaklı'
);
```

## 🔒 Güvenlik

- Tüm AI endpoint'leri JWT authentication gerektirir
- API anahtarı asla frontend'e gönderilmez
- Tüm istekler backend üzerinden yapılır

## 💰 Maliyet

DeepSeek API kullanımı token bazlıdır ve **çok uygun fiyatlıdır**.

### Fiyatlandırma (DeepSeek-V3)

**Normal Saatler:**
- Girdi (Input): ~0.27 USD / 1 milyon token
- Çıktı (Output): ~1.10 USD / 1 milyon token

**İndirimli Saatler (UTC 16:30–00:30):**
- Girdi: %50-75 indirim
- Çıktı: %50 indirim

### Pratik Örnekler

| İşlem | Yaklaşık Maliyet |
|-------|------------------|
| Kısa açıklama (150 kelime) | ~$0.001 |
| Uzun açıklama (500 kelime) | ~$0.003 |
| Metin iyileştirme | ~$0.002 |
| 100 otel için toplu içerik | ~$0.40 |
| Aylık 1000 içerik | ~$4-5 |

### Karşılaştırma

| Model | Fiyat (1M token input) | DeepSeek'e göre |
|-------|----------------------|-----------------|
| GPT-4 | $30 | 100x daha pahalı |
| GPT-4 Turbo | $10 | 37x daha pahalı |
| **DeepSeek** | **$0.27** | **✅ En ucuz** |

> **Not**: GPT-4'e göre yaklaşık **100 kat daha ucuz!**

Detaylı fiyatlandırma için: https://platform.deepseek.com/pricing

## 🐛 Sorun Giderme

### API Key Bulunamadı Hatası

```
⚠️ DEEPSEEK_API_KEY bulunamadı! AI özellikleri çalışmayacak.
```

**Çözüm**: `.env` dosyasına `DEEPSEEK_API_KEY` ekleyin ve uygulamayı yeniden başlatın.

### 503 Service Unavailable

API servisi yapılandırılmamış demektir. API anahtarını kontrol edin.

### Rate Limit Hatası

DeepSeek API'nin rate limit'ine ulaştınız. Birkaç saniye bekleyip tekrar deneyin.

## 📝 Notlar

- AI tarafından oluşturulan içerikler her zaman kontrol edilmelidir
- İçerikler SEO uyumlu olacak şekilde optimize edilmiştir
- Türkçe içerik oluşturmak için optimize edilmiştir
- Her istek ortalama 2-5 saniye sürer

## 🔄 Güncelleme

Sistemi güncellemek için:

```bash
cd mamon-yonetim
git pull
npm install
npm run start:dev
```

