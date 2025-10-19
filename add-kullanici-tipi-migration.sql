-- Kullanıcı tipi enum'unu oluştur
CREATE TYPE kullanici_tipi_enum AS ENUM ('musteri', 'acente', 'personel', 'yonetici');

-- Kullanicilar tablosuna kullanici_tipi sütunu ekle
ALTER TABLE kullanicilar 
ADD COLUMN IF NOT EXISTS kullanici_tipi kullanici_tipi_enum DEFAULT 'musteri';

-- Mevcut kullanıcıları güncelle (varsayılan olarak müşteri yap)
UPDATE kullanicilar SET kullanici_tipi = 'musteri' WHERE kullanici_tipi IS NULL;

-- İlk yönetici kullanıcı oluştur (seed data)
-- Şifre: admin123 (bcrypt hash'i)
INSERT INTO kullanicilar (
  ad, 
  soyad, 
  email, 
  kullanici_adi, 
  sifre, 
  kullanici_tipi, 
  durum
) VALUES (
  'Admin',
  'User',
  'admin@mamontravel.com',
  'admin',
  '$2b$10$yTOiaRMLidvhTMmXavDpBOZdoR7/A9LekS42jjRmledhmrCc9CzMG', 
  'yonetici',
  1
) ON CONFLICT (email) DO NOTHING;

-- Test amaçlı diğer kullanıcı tipleri (opsiyonel)
INSERT INTO kullanicilar (
  ad, 
  soyad, 
  email, 
  kullanici_adi, 
  sifre, 
  kullanici_tipi, 
  durum
) VALUES 
(
  'Test',
  'Acente',
  'acente@mamontravel.com',
  'acente',
  '$2b$10$yTOiaRMLidvhTMmXavDpBOZdoR7/A9LekS42jjRmledhmrCc9CzMG',
  'acente',
  1
),
(
  'Test',
  'Personel',
  'personel@mamontravel.com',
  'personel',
  '$2b$10$yTOiaRMLidvhTMmXavDpBOZdoR7/A9LekS42jjRmledhmrCc9CzMG',
  'personel',
  1
),
(
  'Test',
  'Müşteri',
  'musteri@mamontravel.com',
  'musteri',
  '$2b$10$yTOiaRMLidvhTMmXavDpBOZdoR7/A9LekS42jjRmledhmrCc9CzMG',
  'musteri',
  1
) ON CONFLICT (email) DO NOTHING;

