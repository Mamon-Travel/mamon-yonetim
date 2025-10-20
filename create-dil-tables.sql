-- Diller Tablosu
CREATE TABLE IF NOT EXISTS diller (
  id SERIAL PRIMARY KEY,
  kod VARCHAR(10) NOT NULL UNIQUE,  -- tr, en, ja, de, ru vb.
  ad VARCHAR(100) NOT NULL,  -- Türkçe, English, 日本語 vb.
  yerel_ad VARCHAR(100),  -- Kendi dilinde adı
  varsayilan BOOLEAN DEFAULT FALSE,  -- Varsayılan dil
  durum INTEGER DEFAULT 1,  -- 0: Pasif, 1: Aktif
  olusturma_tarihi TIMESTAMP DEFAULT NOW(),
  guncelleme_tarihi TIMESTAMP DEFAULT NOW()
);

-- Çeviriler Tablosu
CREATE TABLE IF NOT EXISTS ceviriler (
  id SERIAL PRIMARY KEY,
  dil_id INTEGER NOT NULL REFERENCES diller(id) ON DELETE CASCADE,
  anahtar VARCHAR(255) NOT NULL,  -- common.welcome, home.title vb.
  deger TEXT NOT NULL,  -- Çeviri metni
  kategori VARCHAR(100),  -- common, home, hotel, auth vb. (gruplama için)
  aciklama TEXT,  -- Bu çevirinin ne için kullanıldığı
  durum INTEGER DEFAULT 1,  -- 0: Pasif, 1: Aktif
  olusturma_tarihi TIMESTAMP DEFAULT NOW(),
  guncelleme_tarihi TIMESTAMP DEFAULT NOW(),
  UNIQUE(dil_id, anahtar)
);

-- İndeksler
CREATE INDEX idx_ceviriler_dil_id ON ceviriler(dil_id);
CREATE INDEX idx_ceviriler_anahtar ON ceviriler(anahtar);
CREATE INDEX idx_ceviriler_kategori ON ceviriler(kategori);
CREATE INDEX idx_diller_kod ON diller(kod);

-- Varsayılan Türkçe dili ekle
INSERT INTO diller (kod, ad, yerel_ad, varsayilan, durum) VALUES
('tr', 'Türkçe', 'Türkçe', TRUE, 1),
('en', 'İngilizce', 'English', FALSE, 1),
('de', 'Almanca', 'Deutsch', FALSE, 1),
('ru', 'Rusça', 'Русский', FALSE, 1);

-- Örnek çeviriler (Türkçe)
INSERT INTO ceviriler (dil_id, anahtar, deger, kategori, aciklama) VALUES
-- Common (Genel)
(1, 'common.welcome', 'Hoş Geldiniz', 'common', 'Karşılama mesajı'),
(1, 'common.search', 'Ara', 'common', 'Arama butonu'),
(1, 'common.save', 'Kaydet', 'common', 'Kaydet butonu'),
(1, 'common.cancel', 'İptal', 'common', 'İptal butonu'),
(1, 'common.delete', 'Sil', 'common', 'Sil butonu'),
(1, 'common.edit', 'Düzenle', 'common', 'Düzenle butonu'),
(1, 'common.add', 'Ekle', 'common', 'Ekle butonu'),
(1, 'common.loading', 'Yükleniyor...', 'common', 'Yükleme mesajı'),
(1, 'common.error', 'Bir hata oluştu', 'common', 'Genel hata mesajı'),
(1, 'common.success', 'İşlem başarılı', 'common', 'Başarı mesajı'),

-- Home (Anasayfa)
(1, 'home.title', 'Anasayfa', 'home', 'Anasayfa başlığı'),
(1, 'home.subtitle', 'Tatil Fırsatlarını Keşfedin', 'home', 'Anasayfa alt başlığı'),
(1, 'home.search_placeholder', 'Nereye gitmek istersiniz?', 'home', 'Arama kutusu placeholder'),

-- Hotel (Otel)
(1, 'hotel.title', 'Oteller', 'hotel', 'Otel listesi başlığı'),
(1, 'hotel.details', 'Otel Detayları', 'hotel', 'Otel detay sayfası başlığı'),
(1, 'hotel.book_now', 'Hemen Rezervasyon Yap', 'hotel', 'Rezervasyon butonu'),
(1, 'hotel.features', 'Otel Özellikleri', 'hotel', 'Özellikler bölümü'),
(1, 'hotel.rooms', 'Oda Tipleri', 'hotel', 'Oda tipleri bölümü'),
(1, 'hotel.location', 'Konum', 'hotel', 'Konum bölümü'),
(1, 'hotel.price_per_night', 'Gecelik Fiyat', 'hotel', 'Fiyat etiketi'),
(1, 'hotel.stars', 'Yıldız', 'hotel', 'Yıldız sayısı'),

-- Auth (Kimlik Doğrulama)
(1, 'auth.login', 'Giriş Yap', 'auth', 'Giriş butonu'),
(1, 'auth.register', 'Kayıt Ol', 'auth', 'Kayıt butonu'),
(1, 'auth.logout', 'Çıkış Yap', 'auth', 'Çıkış butonu'),
(1, 'auth.email', 'E-posta', 'auth', 'E-posta alanı'),
(1, 'auth.password', 'Şifre', 'auth', 'Şifre alanı');

-- Örnek İngilizce çeviriler
INSERT INTO ceviriler (dil_id, anahtar, deger, kategori, aciklama) VALUES
(2, 'common.welcome', 'Welcome', 'common', 'Welcome message'),
(2, 'common.search', 'Search', 'common', 'Search button'),
(2, 'common.save', 'Save', 'common', 'Save button'),
(2, 'common.cancel', 'Cancel', 'common', 'Cancel button'),
(2, 'common.delete', 'Delete', 'common', 'Delete button'),
(2, 'common.edit', 'Edit', 'common', 'Edit button'),
(2, 'common.add', 'Add', 'common', 'Add button'),
(2, 'hotel.title', 'Hotels', 'hotel', 'Hotel list title'),
(2, 'hotel.book_now', 'Book Now', 'hotel', 'Booking button'),
(2, 'auth.login', 'Login', 'auth', 'Login button');

COMMENT ON TABLE diller IS 'Sistem dillerini saklar';
COMMENT ON TABLE ceviriler IS 'Çoklu dil çevirilerini saklar';

