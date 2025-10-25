-- OTEL REZERVASYON SİSTEMİ - TAKVİM VE FİYATLANDIRMA
-- Bu dosya mevcut otel tablolarına ek olarak rezervasyon sistemi için gerekli tabloları oluşturur

-- =============================================================================
-- 1. PANSİYON TİPLERİ TABLOSU
-- =============================================================================
CREATE TABLE IF NOT EXISTS otel_pansiyon_tipleri (
    id SERIAL PRIMARY KEY,
    kod VARCHAR(10) UNIQUE NOT NULL,
    ad VARCHAR(100) NOT NULL,
    aciklama TEXT,
    sira INTEGER DEFAULT 0,
    durum SMALLINT DEFAULT 1,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE otel_pansiyon_tipleri IS 'Pansiyon tipleri: Oda+Kahvaltı, Yarım Pansiyon, Tam Pansiyon, Her Şey Dahil vb.';
COMMENT ON COLUMN otel_pansiyon_tipleri.kod IS 'RO, BB, HB, FB, AI, UAI gibi standart kodlar';

-- =============================================================================
-- 2. OTEL - PANSİYON İLİŞKİSİ (Otelin hangi pansiyonları sunduğu)
-- =============================================================================
CREATE TABLE IF NOT EXISTS otel_pansiyon_iliski (
    id SERIAL PRIMARY KEY,
    otel_id INTEGER NOT NULL,
    pansiyon_tipi_id INTEGER NOT NULL,
    ek_fiyat DECIMAL(10,2) DEFAULT 0,
    durum SMALLINT DEFAULT 1,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (otel_id) REFERENCES otel(id) ON DELETE CASCADE,
    FOREIGN KEY (pansiyon_tipi_id) REFERENCES otel_pansiyon_tipleri(id) ON DELETE CASCADE,
    UNIQUE(otel_id, pansiyon_tipi_id)
);

CREATE INDEX idx_otel_pansiyon_otel ON otel_pansiyon_iliski(otel_id);
COMMENT ON TABLE otel_pansiyon_iliski IS 'Hangi otelde hangi pansiyon tipleri mevcut';

-- =============================================================================
-- 3. ODA FİYAT TAKVİMİ (Tarih bazlı fiyatlandırma ve minimum konaklama)
-- =============================================================================
CREATE TABLE IF NOT EXISTS otel_oda_fiyat_takvimi (
    id SERIAL PRIMARY KEY,
    oda_tipi_id INTEGER NOT NULL,
    pansiyon_tipi_id INTEGER,
    baslangic_tarihi DATE NOT NULL,
    bitis_tarihi DATE NOT NULL,
    fiyat DECIMAL(10,2) NOT NULL,
    min_konaklama_gece INTEGER DEFAULT 1,
    max_konaklama_gece INTEGER,
    ozel_donem_adi VARCHAR(100),
    durum SMALLINT DEFAULT 1,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (oda_tipi_id) REFERENCES otel_oda_tipi(id) ON DELETE CASCADE,
    FOREIGN KEY (pansiyon_tipi_id) REFERENCES otel_pansiyon_tipleri(id) ON DELETE SET NULL
);

CREATE INDEX idx_fiyat_takvim_oda_tipi ON otel_oda_fiyat_takvimi(oda_tipi_id);
CREATE INDEX idx_fiyat_takvim_tarih ON otel_oda_fiyat_takvimi(baslangic_tarihi, bitis_tarihi);
CREATE INDEX idx_fiyat_takvim_pansiyon ON otel_oda_fiyat_takvimi(pansiyon_tipi_id);

COMMENT ON TABLE otel_oda_fiyat_takvimi IS 'Oda tiplerinin tarih bazlı fiyatlandırması ve minimum konaklama kuralları';
COMMENT ON COLUMN otel_oda_fiyat_takvimi.min_konaklama_gece IS 'Bu tarih aralığında minimum kaç gece kalınması gerektiği';

-- =============================================================================
-- 4. ODA STOK TAKVİMİ (Günlük müsaitlik kontrolü)
-- =============================================================================
CREATE TABLE IF NOT EXISTS otel_oda_stok_takvimi (
    id SERIAL PRIMARY KEY,
    oda_tipi_id INTEGER NOT NULL,
    tarih DATE NOT NULL,
    toplam_oda INTEGER NOT NULL,
    rezerve_oda INTEGER DEFAULT 0,
    bloke_oda INTEGER DEFAULT 0,
    musait_oda INTEGER GENERATED ALWAYS AS (toplam_oda - rezerve_oda - bloke_oda) STORED,
    notlar TEXT,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (oda_tipi_id) REFERENCES otel_oda_tipi(id) ON DELETE CASCADE,
    UNIQUE(oda_tipi_id, tarih)
);

CREATE INDEX idx_stok_takvim_oda_tipi ON otel_oda_stok_takvimi(oda_tipi_id);
CREATE INDEX idx_stok_takvim_tarih ON otel_oda_stok_takvimi(tarih);
CREATE INDEX idx_stok_takvim_musait ON otel_oda_stok_takvimi(musait_oda);

COMMENT ON TABLE otel_oda_stok_takvimi IS 'Oda tiplerinin günlük stok ve müsaitlik takibi';
COMMENT ON COLUMN otel_oda_stok_takvimi.musait_oda IS 'Otomatik hesaplanan müsait oda sayısı';

-- =============================================================================
-- 5. OTEL REZERVASYON DETAYLARI (Rezervasyon - Oda ilişkisi)
-- =============================================================================
CREATE TABLE IF NOT EXISTS otel_rezervasyon_detaylari (
    id SERIAL PRIMARY KEY,
    rezervasyon_id INTEGER NOT NULL,
    oda_tipi_id INTEGER NOT NULL,
    pansiyon_tipi_id INTEGER,
    giris_tarihi DATE NOT NULL,
    cikis_tarihi DATE NOT NULL,
    gece_sayisi INTEGER NOT NULL,
    oda_sayisi INTEGER DEFAULT 1,
    yetiskin_sayisi INTEGER DEFAULT 2,
    cocuk_sayisi INTEGER DEFAULT 0,
    bebek_sayisi INTEGER DEFAULT 0,
    birim_fiyat DECIMAL(10,2) NOT NULL,
    toplam_fiyat DECIMAL(10,2) NOT NULL,
    ozel_istekler TEXT,
    durum VARCHAR(20) DEFAULT 'aktif' CHECK (durum IN ('aktif', 'iptal', 'degistirildi')),
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rezervasyon_id) REFERENCES rezervasyonlar(id) ON DELETE CASCADE,
    FOREIGN KEY (oda_tipi_id) REFERENCES otel_oda_tipi(id) ON DELETE RESTRICT,
    FOREIGN KEY (pansiyon_tipi_id) REFERENCES otel_pansiyon_tipleri(id) ON DELETE SET NULL
);

CREATE INDEX idx_otel_rez_rezervasyon ON otel_rezervasyon_detaylari(rezervasyon_id);
CREATE INDEX idx_otel_rez_oda_tipi ON otel_rezervasyon_detaylari(oda_tipi_id);
CREATE INDEX idx_otel_rez_tarih ON otel_rezervasyon_detaylari(giris_tarihi, cikis_tarihi);

COMMENT ON TABLE otel_rezervasyon_detaylari IS 'Otel rezervasyonlarının detaylı bilgileri';

-- =============================================================================
-- 6. İPTAL POLİTİKALARI
-- =============================================================================
CREATE TABLE IF NOT EXISTS otel_iptal_politikalari (
    id SERIAL PRIMARY KEY,
    otel_id INTEGER NOT NULL,
    ad VARCHAR(200) NOT NULL,
    gun_oncesi INTEGER NOT NULL,
    iade_orani DECIMAL(5,2) DEFAULT 100,
    aciklama TEXT,
    sira INTEGER DEFAULT 0,
    durum SMALLINT DEFAULT 1,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (otel_id) REFERENCES otel(id) ON DELETE CASCADE
);

CREATE INDEX idx_iptal_politika_otel ON otel_iptal_politikalari(otel_id);

COMMENT ON TABLE otel_iptal_politikalari IS 'Otellerin iptal politikaları';
COMMENT ON COLUMN otel_iptal_politikalari.gun_oncesi IS 'Giriş tarihinden kaç gün önce iptal edilirse bu politika geçerli';
COMMENT ON COLUMN otel_iptal_politikalari.iade_orani IS '100 = tam iade, 50 = yarı iade, 0 = iade yok';

-- =============================================================================
-- TRIGGER FONKSİYONLARI
-- =============================================================================

-- Güncelleme tarihi trigger'ı
CREATE OR REPLACE FUNCTION update_otel_rezervasyon_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fiyat takvimi güncellendiğinde
DROP TRIGGER IF EXISTS trigger_fiyat_takvim_guncelleme ON otel_oda_fiyat_takvimi;
CREATE TRIGGER trigger_fiyat_takvim_guncelleme
    BEFORE UPDATE ON otel_oda_fiyat_takvimi
    FOR EACH ROW
    EXECUTE FUNCTION update_otel_rezervasyon_guncelleme_tarihi();

-- Stok takvimi güncellendiğinde
DROP TRIGGER IF EXISTS trigger_stok_takvim_guncelleme ON otel_oda_stok_takvimi;
CREATE TRIGGER trigger_stok_takvim_guncelleme
    BEFORE UPDATE ON otel_oda_stok_takvimi
    FOR EACH ROW
    EXECUTE FUNCTION update_otel_rezervasyon_guncelleme_tarihi();

-- Otel rezervasyon detayları güncellendiğinde
DROP TRIGGER IF EXISTS trigger_otel_rez_detay_guncelleme ON otel_rezervasyon_detaylari;
CREATE TRIGGER trigger_otel_rez_detay_guncelleme
    BEFORE UPDATE ON otel_rezervasyon_detaylari
    FOR EACH ROW
    EXECUTE FUNCTION update_otel_rezervasyon_guncelleme_tarihi();

-- =============================================================================
-- ÖRNEK VERİLER
-- =============================================================================

-- Pansiyon tipleri
INSERT INTO otel_pansiyon_tipleri (kod, ad, aciklama, sira) VALUES
('RO', 'Sadece Oda', 'Yalnızca oda konaklama, yemek dahil değil', 1),
('BB', 'Oda + Kahvaltı', 'Bed & Breakfast - Kahvaltı dahil', 2),
('HB', 'Yarım Pansiyon', 'Half Board - Kahvaltı + Akşam yemeği', 3),
('FB', 'Tam Pansiyon', 'Full Board - Kahvaltı + Öğle + Akşam yemeği', 4),
('AI', 'Her Şey Dahil', 'All Inclusive - Tüm yeme içme dahil', 5),
('UAI', 'Ultra Her Şey Dahil', 'Ultra All Inclusive - Premium içecekler ve ekstralar dahil', 6)
ON CONFLICT (kod) DO NOTHING;

-- İptal politikası örnekleri (Otel ID 1 için)
INSERT INTO otel_iptal_politikalari (otel_id, ad, gun_oncesi, iade_orani, aciklama, sira) 
SELECT 1, 'Ücretsiz İptal', 7, 100, 'Girişten 7 gün öncesine kadar ücretsiz iptal', 1
WHERE EXISTS (SELECT 1 FROM otel WHERE id = 1)
ON CONFLICT DO NOTHING;

INSERT INTO otel_iptal_politikalari (otel_id, ad, gun_oncesi, iade_orani, aciklama, sira) 
SELECT 1, 'Yarı İade', 3, 50, 'Girişten 3-7 gün arası iptal için %50 iade', 2
WHERE EXISTS (SELECT 1 FROM otel WHERE id = 1)
ON CONFLICT DO NOTHING;

INSERT INTO otel_iptal_politikalari (otel_id, ad, gun_oncesi, iade_orani, aciklama, sira) 
SELECT 1, 'İade Yok', 0, 0, 'Girişten 3 gün öncesinden sonra iade yok', 3
WHERE EXISTS (SELECT 1 FROM otel WHERE id = 1)
ON CONFLICT DO NOTHING;

-- Tablo açıklamaları
COMMENT ON TABLE otel_pansiyon_iliski IS 'Hangi otelde hangi pansiyon tipleri mevcut';
COMMENT ON COLUMN otel_pansiyon_iliski.ek_fiyat IS 'Oda fiyatına eklenen pansiyon ücreti';
COMMENT ON TABLE otel_oda_fiyat_takvimi IS 'Oda tiplerinin tarih bazlı fiyatlandırması ve minimum konaklama kuralları';
COMMENT ON COLUMN otel_oda_fiyat_takvimi.min_konaklama_gece IS 'Bu tarih aralığında minimum kaç gece kalınması gerektiği';
COMMENT ON TABLE otel_oda_stok_takvimi IS 'Oda tiplerinin günlük stok ve müsaitlik takibi';
COMMENT ON COLUMN otel_oda_stok_takvimi.musait_oda IS 'Otomatik hesaplanan müsait oda sayısı';
COMMENT ON TABLE otel_rezervasyon_detaylari IS 'Otel rezervasyonlarının detaylı bilgileri';
COMMENT ON TABLE otel_iptal_politikalari IS 'Otellerin iptal politikaları';
COMMENT ON COLUMN otel_iptal_politikalari.gun_oncesi IS 'Giriş tarihinden kaç gün önce iptal edilirse bu politika geçerli';
COMMENT ON COLUMN otel_iptal_politikalari.iade_orani IS '100 = tam iade, 50 = yarı iade, 0 = iade yok';

