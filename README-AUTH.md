# Mamon Travel - Üyelik Sistemi Dokümantasyonu

## Kullanıcı Tipleri

Sistemde 4 farklı kullanıcı tipi bulunmaktadır:

1. **Müşteri (musteri)** - mamon-site üzerinden kayıt olabilir ve giriş yapabilir
2. **Acente (acente)** - mamon-panel üzerinden giriş yapabilir
3. **Personel (personel)** - mamon-panel üzerinden giriş yapabilir
4. **Yönetici (yonetici)** - mamon-panel üzerinden giriş yapabilir ve kullanıcı yönetimi yapabilir

## Kurulum

### 1. Gerekli Paketlerin Kurulumu
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install -D @types/passport-jwt
```

### 2. Veritabanı Migration
```bash
psql -U baris -d mamon_travel -f add-kullanici-tipi-migration.sql
```

### 3. Ortam Değişkenlerini Ayarlama
`.env` dosyasını oluşturun:
```bash
cp .env.example .env
```

### 4. Uygulamayı Çalıştırma
```bash
npm run start:dev
```

## API Endpoints

### Authentication (Herkese Açık)

#### 1. Müşteri Kaydı (mamon-site için)
```
POST /auth/register
Content-Type: application/json

{
  "ad": "Barış",
  "soyad": "Gül",
  "email": "baris@example.com",
  "kullanici_adi": "barisgul",
  "sifre": "123456",
  "telefon": "0532 123 45 67" // opsiyonel
}
```

Müşteri kaydında `kullanici_tipi` otomatik olarak "musteri" atanır.

#### 2. Müşteri Girişi (mamon-site için)
```
POST /auth/login
Content-Type: application/json

{
  "kullanici_adi": "barisgul", // veya email
  "sifre": "123456"
}
```

Yanıt:
```json
{
  "kullanici": {
    "id": 1,
    "ad": "Barış",
    "soyad": "Gül",
    "email": "baris@example.com",
    "kullanici_adi": "barisgul",
    "kullanici_tipi": "musteri",
    "durum": 1
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Panel Girişi (mamon-panel için - acente, personel, yönetici)
```
POST /auth/login-panel
Content-Type: application/json

{
  "kullanici_adi": "admin", // veya email
  "sifre": "admin123"
}
```

Bu endpoint sadece acente, personel ve yönetici kullanıcılarının girişine izin verir.
Müşteri kullanıcıları bu endpoint ile giriş yapamaz.

#### 4. Profil Bilgisi (Giriş yapmış kullanıcı)
```
GET /auth/profile
Authorization: Bearer {access_token}
```

### Admin İşlemleri (Sadece Yönetici)

#### 5. Yönetici Tarafından Kullanıcı Oluşturma
```
POST /auth/register-admin
Authorization: Bearer {admin_access_token}
Content-Type: application/json

{
  "ad": "Test",
  "soyad": "Personel",
  "email": "personel@example.com",
  "kullanici_adi": "personel01",
  "sifre": "123456",
  "kullanici_tipi": "personel", // acente, personel, yonetici
  "telefon": "0532 123 45 67" // opsiyonel
}
```

Bu endpoint ile yönetici, acente, personel veya başka bir yönetici oluşturabilir.

### Kullanıcı Yönetimi (Sadece Yönetici)

Tüm `/kullanicilar` endpoint'leri sadece yönetici kullanıcılar tarafından erişilebilir.

#### 6. Tüm Kullanıcıları Listele
```
GET /kullanicilar
Authorization: Bearer {admin_access_token}
```

#### 7. Kullanıcı Detayı
```
GET /kullanicilar/{id}
Authorization: Bearer {admin_access_token}
```

#### 8. Kullanıcı Oluştur
```
POST /kullanicilar
Authorization: Bearer {admin_access_token}
Content-Type: application/json

{
  "ad": "Test",
  "soyad": "Kullanıcı",
  "email": "test@example.com",
  "kullanici_adi": "testuser",
  "sifre": "123456",
  "kullanici_tipi": "musteri",
  "durum": 1
}
```

#### 9. Kullanıcı Güncelle
```
PATCH /kullanicilar/{id}
Authorization: Bearer {admin_access_token}
Content-Type: application/json

{
  "ad": "Güncel Ad",
  "durum": 0 // Hesabı pasif yap
}
```

#### 10. Kullanıcı Sil
```
DELETE /kullanicilar/{id}
Authorization: Bearer {admin_access_token}
```

## Test Kullanıcıları

Migration dosyası çalıştırıldığında otomatik olarak oluşturulan test kullanıcıları:

| Kullanıcı Adı | Şifre | Kullanıcı Tipi | Email |
|---------------|-------|----------------|--------|
| admin | admin123 | yonetici | admin@mamontravel.com |
| acente | admin123 | acente | acente@mamontravel.com |
| personel | admin123 | personel | personel@mamontravel.com |
| musteri | admin123 | musteri | musteri@mamontravel.com |

## Yetkilendirme Sistemi

### JWT Token Kullanımı
1. Login veya register endpoint'inden dönen `access_token`'ı alın
2. Korumalı endpoint'lere istek yaparken header'a ekleyin:
   ```
   Authorization: Bearer {access_token}
   ```

### Role-Based Access Control (RBAC)
- `@Roles()` decorator ile endpoint'lere yetki kontrolü eklenmiştir
- `JwtAuthGuard` - Token kontrolü yapar
- `RolesGuard` - Kullanıcı tipini kontrol eder

### Kullanıcı Tipine Göre Erişim

| Endpoint | Müşteri | Acente | Personel | Yönetici |
|----------|---------|--------|----------|----------|
| /auth/register | ✅ | ✅ | ✅ | ✅ |
| /auth/login | ✅ | ✅ | ✅ | ✅ |
| /auth/login-panel | ❌ | ✅ | ✅ | ✅ |
| /auth/profile | ✅ | ✅ | ✅ | ✅ |
| /auth/register-admin | ❌ | ❌ | ❌ | ✅ |
| /kullanicilar/* | ❌ | ❌ | ❌ | ✅ |

## Frontend Entegrasyonu

### mamon-site (Next.js)
```typescript
// Müşteri kaydı
const registerCustomer = async (data) => {
  const response = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

// Müşteri girişi
const loginCustomer = async (data) => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  // Token'ı localStorage'a kaydet
  localStorage.setItem('token', result.access_token);
  return result;
};
```

### mamon-panel (React/Next.js)
```typescript
// Panel girişi (acente, personel, yönetici)
const loginPanel = async (data) => {
  const response = await fetch('http://localhost:3000/auth/login-panel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  localStorage.setItem('token', result.access_token);
  return result;
};

// Yönetici - Yeni kullanıcı oluştur
const createUser = async (data, token) => {
  const response = await fetch('http://localhost:3000/auth/register-admin', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

## Swagger Dokümantasyonu

Uygulamayı çalıştırdıktan sonra Swagger dokümantasyonuna aşağıdaki adresten erişebilirsiniz:
```
http://localhost:3000/api
```

Swagger üzerinden:
- Tüm endpoint'leri görebilirsiniz
- Test istekleri gönderebilirsiniz
- JWT token ile authenticate olabilirsiniz (sağ üst "Authorize" butonu)

## Güvenlik Notları

1. **JWT Secret**: Production'da mutlaka güçlü bir secret kullanın
2. **HTTPS**: Production'da HTTPS kullanın
3. **Token Süresi**: JWT token'lar 7 gün geçerlidir, ihtiyaca göre ayarlayın
4. **Şifre Politikası**: Minimum 6 karakter, daha güçlü politikalar ekleyebilirsiniz
5. **Rate Limiting**: API'ye rate limiting ekleyebilirsiniz
6. **CORS**: Production'da CORS ayarlarını düzenleyin

## Sonraki Adımlar

1. ✅ Kullanıcı tiplerini tanımla
2. ✅ JWT Authentication ekle
3. ✅ Role-based guards oluştur
4. ✅ Register/Login endpoint'leri
5. ✅ Admin kullanıcı yönetimi
6. 🔄 Frontend entegrasyonu (mamon-site)
7. 🔄 Frontend entegrasyonu (mamon-panel)
8. 🔄 Refresh token mekanizması
9. 🔄 Password reset fonksiyonu
10. 🔄 Email doğrulama














