-- File Manager Tablosu
CREATE TABLE IF NOT EXISTS file_manager (
  id SERIAL PRIMARY KEY,
  dosya_adi VARCHAR(255) NOT NULL,
  orijinal_dosya_adi VARCHAR(255) NOT NULL,
  dosya_yolu VARCHAR(500) NOT NULL,
  dosya_tipi VARCHAR(100) NOT NULL,
  dosya_boyutu BIGINT NOT NULL,
  kategori VARCHAR(50) NOT NULL,
  aciklama TEXT,
  etiketler VARCHAR(500),
  yukleyen_kullanici_id INTEGER NOT NULL,
  goruntuleme_sayisi INTEGER DEFAULT 0,
  indirme_sayisi INTEGER DEFAULT 0,
  durum SMALLINT DEFAULT 1,
  olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index'ler
CREATE INDEX idx_file_manager_kategori ON file_manager(kategori);
CREATE INDEX idx_file_manager_yukleyen ON file_manager(yukleyen_kullanici_id);
CREATE INDEX idx_file_manager_durum ON file_manager(durum);
CREATE INDEX idx_file_manager_tarih ON file_manager(olusturma_tarihi DESC);

