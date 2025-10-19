# Mamon Travel - Üyelik ve Yetkilendirme Sistemi

## 📋 Genel Bakış

Mamon Travel projesi için 4 farklı kullanıcı tipine sahip kapsamlı bir üyelik ve yetkilendirme sistemi oluşturulmuştur.

## 👥 Kullanıcı Tipleri

1. **Müşteri (musteri)**
   - mamon-site üzerinden kayıt olabilir
   - mamon-site üzerinden giriş yapabilir
   - Panel'e erişim yetkisi yoktur

2. **Acente (acente)**
   - Sadece yönetici tarafından oluşturulabilir
   - mamon-panel üzerinden giriş yapabilir
   - Acente işlemlerini gerçekleştirebilir

3. **Personel (personel)**
   - Sadece yönetici tarafından oluşturulabilir
   - mamon-panel üzerinden giriş yapabilir
   - Personel işlemlerini gerçekleştirebilir

4. **Yönetici (yonetici)**
   - Sadece yönetici tarafından oluşturulabilir
   - mamon-panel üzerinden giriş yapabilir
   - Tüm kullanıcı yönetimi yetkisine sahiptir
   - Diğer yöneticileri oluşturabilir

## 🔐 API Endpoint'leri

### Herkese Açık Endpoint'ler

#### 1. Müşteri Kaydı (mamon-site için)
```bash
POST /auth/register
Content-Type: application/json

{
  "ad": "Barış",
  "soyad": "Gül",
  "email": "baris@example.com",
  "kullanici_adi": "barisgul",
  "sifre": "123456",
  "telefon": "0532 123 45 67"  # opsiyonel
}
```

#### 2. Müşteri Girişi (mamon-site için)
```bash
POST /auth/login
Content-Type: application/json

{
  "kullanici_adi": "barisgul",  # veya email
  "sifre": "123456"
}
```

#### 3. Panel Girişi (acente, personel, yönetici için)
```bash
POST /auth/login-panel
Content-Type: application/json

{
  "kullanici_adi": "admin",
  "sifre": "admin123"
}
```

**Not:** Müşteri kullanıcıları bu endpoint'e erişemez.

### Yetkili Endpoint'ler

#### 4. Profil Görüntüleme (Tüm giriş yapmış kullanıcılar)
```bash
GET /auth/profile
Authorization: Bearer {token}
```

#### 5. Yönetici Tarafından Kullanıcı Oluşturma (Sadece Yönetici)
```bash
POST /auth/register-admin
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "ad": "Test",
  "soyad": "Personel",
  "email": "personel@example.com",
  "kullanici_adi": "personel01",
  "sifre": "123456",
  "kullanici_tipi": "personel"  # acente, personel, yonetici
}
```

### Kullanıcı Yönetimi (Sadece Yönetici)

```bash
# Tüm kullanıcıları listele
GET /kullanicilar
Authorization: Bearer {admin_token}

# Kullanıcı detayı
GET /kullanicilar/{id}
Authorization: Bearer {admin_token}

# Kullanıcı oluştur
POST /kullanicilar
Authorization: Bearer {admin_token}

# Kullanıcı güncelle
PATCH /kullanicilar/{id}
Authorization: Bearer {admin_token}

# Kullanıcı sil
DELETE /kullanicilar/{id}
Authorization: Bearer {admin_token}
```

## 🚀 Kurulum

### 1. Veritabanı Migration
```bash
cd /Users/barisgul/projeler/mamontravel/mamon-yonetim
psql -U baris -d mamon_travel -f add-kullanici-tipi-migration.sql
```

### 2. Uygulamayı Başlatma
```bash
npm run start:dev
```

### 3. Swagger Dokümantasyonu
Tarayıcınızda açın: http://localhost:3000/api

## 🧪 Test Kullanıcıları

Migration dosyası otomatik olarak aşağıdaki test kullanıcılarını oluşturur:

| Kullanıcı Adı | Şifre | Kullanıcı Tipi | Email |
|---------------|-------|----------------|--------|
| admin | admin123 | yonetici | admin@mamontravel.com |
| acente | admin123 | acente | acente@mamontravel.com |
| personel | admin123 | personel | personel@mamontravel.com |
| musteri | admin123 | musteri | musteri@mamontravel.com |

## 📊 Test Sonuçları

Tüm testler başarıyla tamamlanmıştır:

✅ **Müşteri Kaydı**: Başarılı - Kullanıcı otomatik olarak "musteri" tipiyle kaydedildi  
✅ **Müşteri Girişi**: Başarılı - JWT token alındı  
✅ **Panel Girişi (Yönetici)**: Başarılı - JWT token alındı  
✅ **Panel Girişi (Personel)**: Başarılı - JWT token alındı  
✅ **Panel Girişi Engelleme (Müşteri)**: Başarılı - Müşteri kullanıcısı panel login yapamıyor  
✅ **Admin ile Personel Oluşturma**: Başarılı - Yönetici yeni personel oluşturabildi  
✅ **Yetki Kontrolü (Personel)**: Başarılı - Personel kullanıcı listesine erişemedi (403)  
✅ **Yetki Kontrolü (Yönetici)**: Başarılı - Yönetici kullanıcı listesine erişebildi  

## 🔒 Güvenlik Özellikleri

- ✅ JWT tabanlı authentication
- ✅ Bcrypt ile şifre hashleme
- ✅ Role-based access control (RBAC)
- ✅ Token süresi: 7 gün
- ✅ Şifreler response'da döndürülmüyor
- ✅ Email ve kullanıcı adı unique kontrolü
- ✅ Hesap durumu kontrolü (aktif/pasif)

## 📱 Frontend Entegrasyonu

### mamon-site (Next.js) - Müşteri Kaydı ve Girişi

```typescript
// Müşteri kaydı
const registerCustomer = async (data) => {
  const response = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  
  if (result.access_token) {
    localStorage.setItem('token', result.access_token);
    localStorage.setItem('user', JSON.stringify(result.kullanici));
  }
  
  return result;
};

// Müşteri girişi
const loginCustomer = async (data) => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  
  if (result.access_token) {
    localStorage.setItem('token', result.access_token);
    localStorage.setItem('user', JSON.stringify(result.kullanici));
  }
  
  return result;
};
```

### mamon-panel (React/Next.js) - Panel Girişi

```typescript
// Panel girişi (acente, personel, yönetici)
const loginPanel = async (data) => {
  const response = await fetch('http://localhost:3000/auth/login-panel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  
  if (response.status === 401) {
    throw new Error(result.message);
  }
  
  if (result.access_token) {
    localStorage.setItem('token', result.access_token);
    localStorage.setItem('user', JSON.stringify(result.kullanici));
  }
  
  return result;
};

// Yönetici - Yeni kullanıcı oluşturma
const createUser = async (data) => {
  const token = localStorage.getItem('token');
  
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

// Kullanıcı listesi (Sadece yönetici)
const getUsers = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3000/kullanicilar', {
    headers: { 
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

## 📁 Oluşturulan Dosyalar

### Auth Modülü
- `src/auth/auth.module.ts`
- `src/auth/auth.controller.ts`
- `src/auth/auth.service.ts`
- `src/auth/jwt.strategy.ts`

### DTO'lar
- `src/auth/dto/register.dto.ts`
- `src/auth/dto/login.dto.ts`
- `src/auth/dto/register-admin.dto.ts`

### Guards ve Decorators
- `src/auth/guards/jwt-auth.guard.ts`
- `src/auth/guards/roles.guard.ts`
- `src/auth/decorators/roles.decorator.ts`
- `src/auth/decorators/current-user.decorator.ts`

### Enum
- `src/kullanicilar/enums/kullanici-tipi.enum.ts`

### Migration
- `add-kullanici-tipi-migration.sql`

## 🎯 Sonraki Adımlar

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

## 💡 Önemli Notlar

- **JWT Secret**: Production ortamında `.env` dosyasında güçlü bir secret belirleyin
- **CORS**: CORS ayarları aktif, production'da sadece izin verilen domainlere açın
- **Token Süresi**: Token'lar 7 gün geçerli, ihtiyaca göre değiştirilebilir
- **Şifre Güvenliği**: Minimum 6 karakter, daha güçlü politikalar eklenebilir

## 🆘 Sorun Giderme

### Kullanıcı girişi yapamıyor
- Şifrenin doğru olduğundan emin olun
- Kullanıcının `durum` değerinin 1 (aktif) olduğunu kontrol edin
- Veritabanında kullanıcının var olduğunu kontrol edin

### Token geçersiz hatası
- Token'ın doğru formatta gönderildiğinden emin olun: `Authorization: Bearer {token}`
- Token'ın süresinin dolmadığını kontrol edin (7 gün)
- JWT_SECRET'in doğru olduğundan emin olun

### 403 Forbidden hatası
- Kullanıcının gerekli yetkiye sahip olduğunu kontrol edin
- Endpoint'in doğru role decorator'ına sahip olduğunu kontrol edin

## 📞 İletişim

Herhangi bir sorunuz veya öneriniz için iletişime geçebilirsiniz.

---

**Geliştirici:** Barış Gül  
**Tarih:** 19 Ekim 2025  
**Versiyon:** 1.0.0

