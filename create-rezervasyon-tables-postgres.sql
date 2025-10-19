-- POSTGRESQL İÇİN REZERVASYON SİSTEMİ TABLOLARI

-- 1. ÜRÜNLER TABLOSU
CREATE TABLE IF NOT EXISTS urunler (
    id SERIAL PRIMARY KEY,
    hizmet_id INTEGER NOT NULL,
    baslik VARCHAR(255) NOT NULL,
    aciklama TEXT,
    ana_resim VARCHAR(500),
    resimler JSONB,
    fiyat DECIMAL(10, 2) NOT NULL,
    fiyat_birimi VARCHAR(10) DEFAULT 'TRY',
    fiyat_tipi VARCHAR(20) DEFAULT 'gunluk' CHECK (fiyat_tipi IN ('gunluk', 'gece', 'saat', 'adet', 'kisi')),
    stok_durumu VARCHAR(20) DEFAULT 'mevcut' CHECK (stok_durumu IN ('mevcut', 'tukendi', 'rezerve')),
    ozellikler JSONB,
    durum SMALLINT DEFAULT 1,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hizmet FOREIGN KEY (hizmet_id) REFERENCES hizmetler(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_urunler_hizmet ON urunler(hizmet_id);
CREATE INDEX IF NOT EXISTS idx_urunler_durum ON urunler(durum);

-- 2. REZERVASYONLAR TABLOSU
CREATE TABLE IF NOT EXISTS rezervasyonlar (
    id SERIAL PRIMARY KEY,
    kullanici_id INTEGER NOT NULL,
    rezervasyon_no VARCHAR(50) UNIQUE NOT NULL,
    toplam_tutar DECIMAL(10, 2) NOT NULL,
    para_birimi VARCHAR(10) DEFAULT 'TRY',
    durum VARCHAR(20) DEFAULT 'beklemede' CHECK (durum IN ('beklemede', 'onaylandi', 'iptal_edildi', 'tamamlandi')),
    odeme_durumu VARCHAR(20) DEFAULT 'bekleniyor' CHECK (odeme_durumu IN ('bekleniyor', 'odendi', 'iade_edildi')),
    odeme_yontemi VARCHAR(50),
    "not" TEXT,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_kullanici FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_rezervasyonlar_kullanici ON rezervasyonlar(kullanici_id);
CREATE INDEX IF NOT EXISTS idx_rezervasyonlar_durum ON rezervasyonlar(durum);
CREATE INDEX IF NOT EXISTS idx_rezervasyonlar_no ON rezervasyonlar(rezervasyon_no);

-- 3. REZERVASYON DETAYLARI TABLOSU
CREATE TABLE IF NOT EXISTS rezervasyon_detaylari (
    id SERIAL PRIMARY KEY,
    rezervasyon_id INTEGER NOT NULL,
    urun_id INTEGER NOT NULL,
    hizmet_adi VARCHAR(100),
    urun_adi VARCHAR(255),
    miktar INTEGER DEFAULT 1,
    birim_fiyat DECIMAL(10, 2) NOT NULL,
    toplam_fiyat DECIMAL(10, 2) NOT NULL,
    rezervasyon_bilgileri JSONB,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rezervasyon FOREIGN KEY (rezervasyon_id) REFERENCES rezervasyonlar(id) ON DELETE CASCADE,
    CONSTRAINT fk_urun FOREIGN KEY (urun_id) REFERENCES urunler(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_detay_rezervasyon ON rezervasyon_detaylari(rezervasyon_id);
CREATE INDEX IF NOT EXISTS idx_detay_urun ON rezervasyon_detaylari(urun_id);

-- ÖRNEK VERİLER (Hizmet ID'leri mevcut hizmetlerden olmalı)
-- Önce hizmet var mı kontrol edin, yoksa bu satırları çalıştırmayın

