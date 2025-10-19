# PayTR Ödeme Sistemi Kurulum Kılavuzu

## 🔐 PayTR Hesap Ayarları

PayTR üyeliği oluşturduktan sonra aşağıdaki bilgileri edinmeniz gerekiyor:

1. **Merchant ID**: PayTR panelinden alacağınız mağaza numarası
2. **Merchant Key**: API Key (Entegrasyon ayarları)
3. **Merchant Salt**: API Salt Key (Entegrasyon ayarları)

## 📝 .env Dosyası Yapılandırması

`mamon-yonetim` klasöründe `.env` dosyası oluşturun:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=baris
DB_PASSWORD=
DB_DATABASE=mamon_travel

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# PayTR Configuration
PAYTR_MERCHANT_ID=123456
PAYTR_MERCHANT_KEY=your_merchant_key_here
PAYTR_MERCHANT_SALT=your_merchant_salt_here
PAYTR_TEST_MODE=1
PAYTR_OK_URL=http://localhost:3001/odeme/basarili
PAYTR_FAIL_URL=http://localhost:3001/odeme/basarisiz

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 🚀 Kullanım Akışı

### 1. Sepete Ürün Ekleme
```bash
POST /sepet
Authorization: Bearer {token}

{
  "urunId": 1,
  "miktar": 2,
  "rezervasyonBilgileri": {
    "giris_tarihi": "2024-01-15",
    "cikis_tarihi": "2024-01-20",
    "misafir_sayisi": 2
  }
}
```

### 2. Sepeti Görüntüleme
```bash
GET /sepet
Authorization: Bearer {token}
```

### 3. Sepet Toplamını Getirme
```bash
GET /sepet/toplam
Authorization: Bearer {token}
```

### 4. Ödeme Başlatma (Sepetten)
```bash
POST /odeme/basla
Authorization: Bearer {token}

{
  "kaynak": "sepet",
  "taksitSayisi": 1
}
```

**Yanıt:**
```json
{
  "success": true,
  "odemeId": 1,
  "merchantOid": "MO1234567890",
  "paymentUrl": "https://www.paytr.com/odeme/guvenli/TOKEN",
  "token": "TOKEN"
}
```

### 5. Frontend'te Ödeme iframe'i Gösterme

```html
<iframe 
  src="https://www.paytr.com/odeme/guvenli/TOKEN" 
  id="paytriframe" 
  frameborder="0" 
  scrolling="no" 
  style="width: 100%; height: 800px;">
</iframe>
```

### 6. PayTR Callback (Otomatik)

PayTR ödeme tamamlandığında otomatik olarak `/odeme/callback` endpoint'ine POST isteği gönderir.

## 📊 API Endpoint'leri

### Sepet İşlemleri
- `POST /sepet` - Sepete ürün ekle
- `GET /sepet` - Sepeti listele
- `GET /sepet/toplam` - Sepet toplamını getir
- `GET /sepet/:id` - Sepetteki tek ürün
- `PATCH /sepet/:id` - Sepetteki ürünü güncelle
- `DELETE /sepet/:id` - Sepetten ürün sil
- `DELETE /sepet` - Sepeti temizle

### Ödeme İşlemleri
- `POST /odeme/basla` - PayTR ile ödeme başlat
- `POST /odeme/callback` - PayTR callback (sistem kullanımı)
- `GET /odeme` - Tüm ödemeler (Yönetici)
- `GET /odeme/benim` - Kullanıcının ödemeleri
- `GET /odeme/:id` - Ödeme detayı
- `GET /odeme/merchant/:merchantOid` - Merchant OID ile ödeme

### Rezervasyon İşlemleri
- `POST /rezervasyonlar` - Manuel rezervasyon oluştur
- `GET /rezervasyonlar` - Tüm rezervasyonlar (Yönetici)
- `GET /rezervasyonlar/benim` - Kullanıcının rezervasyonları
- `GET /rezervasyonlar/:id` - Rezervasyon detayı
- `GET /rezervasyonlar/no/:rezervasyonNo` - Rezervasyon no ile getir
- `PATCH /rezervasyonlar/:id` - Rezervasyon güncelle
- `DELETE /rezervasyonlar/:id` - Rezervasyon sil

## 🔒 Güvenlik

1. **Hash Doğrulama**: PayTR callback'lerinde hash doğrulaması yapılır
2. **JWT Authentication**: Tüm endpoint'ler JWT ile korunur
3. **IP Takibi**: Tüm ödeme işlemleri IP adresi ile loglanır
4. **Ödeme Logları**: Her işlem detaylı olarak `odeme_loglari` tablosuna kaydedilir

## 🧪 Test Modu

`PAYTR_TEST_MODE=1` olduğunda PayTR test ortamında çalışır. Gerçek para hareketi olmaz.

**Test Kartları:**
- Kart No: 5400010000000004
- Son Kullanma: 12/26
- CVV: 000

## 📦 Database Tabloları

- `sepet` - Kullanıcı sepet öğeleri
- `odemeler` - Ödeme kayıtları
- `odeme_loglari` - Ödeme işlem logları
- `rezervasyonlar` - Rezervasyon kayıtları
- `rezervasyon_detaylari` - Rezervasyon detay bilgileri
- `urunler` - Ürün/Hizmet bilgileri

## 🛠️ Troubleshooting

### Ödeme başlatılamıyor
- PayTR credential'larını kontrol edin
- `.env` dosyasının doğru yüklendiğinden emin olun
- Backend loglarını kontrol edin

### Callback çalışmıyor
- PayTR panelinde callback URL'i ayarlayın
- URL'in dışarıdan erişilebilir olduğundan emin olun
- Test için ngrok kullanabilirsiniz

### Sepet boş görünüyor
- Kullanıcının giriş yaptığından emin olun
- JWT token'ın geçerli olduğundan emin olun

## 📞 Destek

PayTR teknik destek: https://www.paytr.com/destek

