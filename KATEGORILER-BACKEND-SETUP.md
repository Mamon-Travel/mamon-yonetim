# 📁 Kategoriler Backend Sistemi

## 🎯 Amaç
Kategoriler (New York, Paris, Tokyo vb.) artık **backend'den yönetiliyor**. Frontend fake data yerine backend API'den veri çekiyor.

## 🗄️ Veritabanı Kurulumu

### 1. Tabloyu Oluştur
```bash
cd /Users/barisgul/projeler/mamontravel/mamon-yonetim
psql -U kullanici_adi -d veritabani_adi -f create-kategoriler-table.sql
```

### 2. Hizmetler ve Kategorileri Seed Et
```bash
psql -U kullanici_adi -d veritabani_adi -f seed-hizmetler-kategoriler.sql
```

## 📊 Tablo Yapısı

### `kategoriler` Tablosu
| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | SERIAL | Primary Key |
| `hizmet_id` | INTEGER | Hizmet ID (1=Konaklama, 2=Araç, 3=Deneyim, 4=Emlak, 5=Uçuş) |
| `ad` | VARCHAR(255) | Kategori adı (örn: "New York, USA") |
| `slug` | VARCHAR(255) | URL slug (örn: "new-york-usa") |
| `bolge` | VARCHAR(255) | Bölge/Region (örn: "United States") |
| `adet` | INTEGER | Bu kategorideki ilan sayısı |
| `aciklama` | TEXT | Kategori açıklaması |
| `thumbnail` | VARCHAR(500) | Thumbnail görsel URL |
| `kapak_gorseli` | VARCHAR(500) | Kapak görseli URL |
| `sira` | INTEGER | Sıralama |
| `durum` | SMALLINT | Durum (1=Aktif, 0=Pasif) |
| `olusturma_tarihi` | TIMESTAMP | Oluşturma tarihi |
| `guncelleme_tarihi` | TIMESTAMP | Güncelleme tarihi |

### İlişkiler
- **Foreign Key**: `hizmet_id` → `hizmetler(id)` ON DELETE CASCADE
- **Unique**: `(hizmet_id, slug)` - Aynı hizmette aynı slug olamaz

## 🔌 API Endpoint'leri

### Backend (NestJS)
```
GET    /kategoriler                      - Tüm kategorileri getir
GET    /kategoriler/:id                  - ID'ye göre kategori
GET    /kategoriler/hizmet/:hizmetId     - Hizmete göre kategoriler
GET    /kategoriler/hizmet-slug/:slug    - Hizmet slug'ına göre kategoriler
GET    /kategoriler/slug/:slug           - Slug'a göre kategori
POST   /kategoriler                      - Yeni kategori oluştur
PATCH  /kategoriler/:id                  - Kategori güncelle
DELETE /kategoriler/:id                  - Kategori sil
PATCH  /kategoriler/:id/soft-delete      - Kategori pasif yap
```

### Frontend Kullanımı

#### Eski Kullanım (Fake Data):
```typescript
import { getStayCategories } from '@/data/categories'

const categories = await getStayCategories() // Fake data
```

#### Yeni Kullanım (Backend):
```typescript
import { getStayCategories } from '@/data/categories'

const categories = await getStayCategories() // Backend'den çekiliyor! 🚀
```

**Kod değişikliği YOK!** Sadece backend'den veri çekiliyor.

## 🎨 Frontend Service

`src/services/categoryService.ts` dosyası backend ile iletişimi sağlıyor:

```typescript
import categoryService from '@/services/categoryService'

// Hizmete göre kategorileri çek
const categories = await categoryService.getByHizmetId(1) // 1 = Konaklama

// Formatlı kategori al
const formatted = categoryService.formatCategory(category, 'stay')
```

## 📋 Hizmet ID'leri

| Hizmet | ID | Slug |
|--------|----|----|
| Konaklama | 1 | `stays` |
| Araç Kiralama | 2 | `cars` |
| Deneyimler | 3 | `experiences` |
| Emlak | 4 | `real-estates` |
| Uçuşlar | 5 | `flights` |

## 🔄 Veri Akışı

```
Backend (PostgreSQL)
  ↓
kategoriler tablosu
  ↓
NestJS API (kategoriler module)
  ↓
Frontend categoryService.ts
  ↓
data/categories.ts (adapter)
  ↓
Components (StayCategories, vb.)
```

## ✅ Avantajlar

1. ✅ **Dinamik yönetim**: Kategoriler artık backend panelinden yönetilebilir
2. ✅ **Gerçek zamanlı**: Yeni kategori eklersen hemen sitede görünür
3. ✅ **Çok dilli**: Kategori isimleri çeviri sistemiyle entegre edilebilir
4. ✅ **SEO dostu**: Türkçe kolon adları ama API'de temiz yapı
5. ✅ **Fallback**: Backend yoksa boş array döner, site crash olmaz

## 🚀 Kullanıma Hazır!

Backend sunucusunu başlattığınızda:
```bash
cd /Users/barisgul/projeler/mamontravel/mamon-yonetim
npm run start:dev
```

Swagger: `http://localhost:3001/api` (veya backend portun)

Artık kategoriler **Swagger panelinden yönetilebilir!** 🎉

