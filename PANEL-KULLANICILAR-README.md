# Panel Kullanıcıları Modülü

Bu modül, `mamon-panel` yönetim paneli için ayrı bir kullanıcı yönetim sistemi sağlar. Site kullanıcılarından (`kullanicilar` tablosu) bağımsız olarak panel yöneticilerini yönetir.

## Özellikler

- ✅ Panel kullanıcıları için CRUD işlemleri
- ✅ Rol bazlı yetkilendirme (admin, editor, viewer)
- ✅ JWT tabanlı authentication
- ✅ Profil yönetimi
- ✅ Şifre değiştirme
- ✅ Swagger dokümantasyonu

## Kurulum

### 1. Veritabanı Tablosunu Oluşturma

```bash
cd /Users/barisgul/projeler/mamontravel/mamon-yonetim
psql -U baris -d mamon_travel -f create-panel-kullanicilar-table.sql
```

### 2. Varsayılan Admin Kullanıcı Şifresi Oluşturma

Migration dosyasında örnek kullanıcı için şifreyi hash'lemeniz gerekiyor:

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
```

Çıkan hash'i SQL dosyasındaki `$2b$10$YourHashedPasswordHere` yerine yazın ve tekrar çalıştırın.

## API Endpoints

### Authentication

#### Panel Kullanıcı Girişi
```http
POST /auth/login-panel-user
Content-Type: application/json

{
  "kullanici_adi": "admin",
  "sifre": "admin123"
}
```

**Response:**
```json
{
  "kullanici": {
    "id": 1,
    "ad": "Admin",
    "soyad": "User",
    "email": "admin@mamon.com",
    "kullanici_adi": "admin",
    "rol": "admin",
    "durum": 1,
    "olusturma_tarihi": "2025-01-15T10:00:00Z",
    "guncelleme_tarihi": "2025-01-15T10:00:00Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Panel Kullanıcı Yönetimi

#### Tüm Panel Kullanıcılarını Listele
```http
GET /panel-kullanicilar
Authorization: Bearer {token}
```

#### Panel Kullanıcı Detayı
```http
GET /panel-kullanicilar/{id}
Authorization: Bearer {token}
```

#### Yeni Panel Kullanıcı Oluştur
```http
POST /panel-kullanicilar
Authorization: Bearer {token}
Content-Type: application/json

{
  "ad": "Barış",
  "soyad": "Gül",
  "email": "baris@mamon.com",
  "kullanici_adi": "barisgul",
  "sifre": "123456",
  "telefon": "0532 123 45 67",
  "rol": "editor",
  "durum": 1
}
```

#### Panel Kullanıcı Güncelle
```http
PATCH /panel-kullanicilar/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "ad": "Güncellenmiş Ad",
  "rol": "admin"
}
```

#### Panel Kullanıcı Sil
```http
DELETE /panel-kullanicilar/{id}
Authorization: Bearer {token}
```

### Profil Yönetimi

#### Profil Bilgilerini Getir
```http
GET /panel-profile
Authorization: Bearer {token}
```

#### Profil Güncelle
```http
PATCH /panel-profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "ad": "Yeni Ad",
  "soyad": "Yeni Soyad",
  "telefon": "0532 999 88 77",
  "mevcutSifre": "eskiSifre123",
  "yeniSifre": "yeniSifre456"
}
```

## Roller (Roles)

- **admin**: Tüm yetkilere sahip
- **editor**: İçerik düzenleme yetkisi
- **viewer**: Sadece görüntüleme yetkisi

## JWT Token Yapısı

Panel kullanıcı token'ında şu bilgiler bulunur:

```json
{
  "sub": 1,
  "kullanici_adi": "admin",
  "email": "admin@mamon.com",
  "rol": "admin",
  "isPanelUser": true,
  "iat": 1673785200,
  "exp": 1674390000
}
```

## Site Kullanıcıları vs Panel Kullanıcıları

| Özellik | Site Kullanıcıları | Panel Kullanıcıları |
|---------|-------------------|---------------------|
| Tablo | `kullanicilar` | `panel_kullanicilar` |
| Kullanım | mamon-site | mamon-panel |
| Login Endpoint | `/auth/login` | `/auth/login-panel-user` |
| Roller | KullaniciTipi enum | rol field (string) |
| Token Flag | `isPanelUser: false` | `isPanelUser: true` |

## Swagger Dokümantasyonu

API dokümantasyonuna erişmek için:

```
http://localhost:3000/api
```

Panel Kullanıcıları endpoints'leri "Panel Kullanıcıları" ve "Panel Profil" tag'leri altında bulunur.

## Güvenlik Notları

1. Şifreler bcrypt ile hash'lenir (10 rounds)
2. JWT token'lar 7 gün geçerlidir
3. Pasif kullanıcılar (durum=0) giriş yapamaz
4. Token her istekte kontrol edilir
5. Şifreler hiçbir zaman response'da dönmez

## Örnek Kullanım (Frontend)

```typescript
// Login
const login = async (username: string, password: string) => {
  const response = await fetch('http://localhost:3000/auth/login-panel-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      kullanici_adi: username,
      sifre: password
    })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
};

// API İsteği
const getPanelUsers = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/panel-kullanicilar', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  return await response.json();
};
```

## Geliştirme

```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## Test

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

