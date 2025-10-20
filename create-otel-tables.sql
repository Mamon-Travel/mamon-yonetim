-- Otel Ana Tablosu
CREATE TABLE IF NOT EXISTS otel (
    id SERIAL PRIMARY KEY,
    hizmet_id INTEGER DEFAULT 1,
    ad VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    yildiz SMALLINT DEFAULT 5,
    konsept VARCHAR(100),
    sehir VARCHAR(100),
    bolge VARCHAR(100),
    adres TEXT,
    telefon VARCHAR(50),
    email VARCHAR(100),
    web_site VARCHAR(255),
    check_in_time VARCHAR(20) DEFAULT '14:00',
    check_out_time VARCHAR(20) DEFAULT '12:00',
    min_fiyat DECIMAL(10,2),
    kapak_gorseli VARCHAR(500),
    video_url VARCHAR(500),
    enlem DECIMAL(10, 8),
    boylam DECIMAL(11, 8),
    durum SMALLINT DEFAULT 1,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hizmet_id) REFERENCES hizmetler(id) ON DELETE SET NULL
);

-- Otel Detay Tablosu
CREATE TABLE IF NOT EXISTS otel_detay (
    id SERIAL PRIMARY KEY,
    otel_id INTEGER NOT NULL,
    kisa_aciklama TEXT,
    uzun_aciklama TEXT,
    denize_mesafe VARCHAR(100),
    havalimani_mesafe VARCHAR(100),
    sehir_merkezi_mesafe VARCHAR(100),
    oda_sayisi INTEGER,
    acilis_yili INTEGER,
    renovasyon_yili INTEGER,
    kat_sayisi INTEGER,
    onemli_bilgiler TEXT,
    covid_onlemleri TEXT,
    cocuk_politikasi TEXT,
    evcil_hayvan_politikasi TEXT,
    iptal_politikasi TEXT,
    FOREIGN KEY (otel_id) REFERENCES otel(id) ON DELETE CASCADE
);

-- Otel Görselleri
CREATE TABLE IF NOT EXISTS otel_gorsel (
    id SERIAL PRIMARY KEY,
    otel_id INTEGER NOT NULL,
    gorsel_url VARCHAR(500) NOT NULL,
    baslik VARCHAR(255),
    sira INTEGER DEFAULT 0,
    gorsel_tipi VARCHAR(50) DEFAULT 'genel',
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (otel_id) REFERENCES otel(id) ON DELETE CASCADE
);

-- Otel - Otel Özellik İlişki Tablosu (Çoktan Çoğa)
CREATE TABLE IF NOT EXISTS otel_otel_ozellik_iliski (
    id SERIAL PRIMARY KEY,
    otel_id INTEGER NOT NULL,
    otel_ozellik_id INTEGER NOT NULL,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (otel_id) REFERENCES otel(id) ON DELETE CASCADE,
    FOREIGN KEY (otel_ozellik_id) REFERENCES otel_ozellik(id) ON DELETE CASCADE,
    UNIQUE(otel_id, otel_ozellik_id)
);

-- Otel Oda Tipleri
CREATE TABLE IF NOT EXISTS otel_oda_tipi (
    id SERIAL PRIMARY KEY,
    otel_id INTEGER NOT NULL,
    ad VARCHAR(255) NOT NULL,
    kapasite INTEGER DEFAULT 2,
    yetiskin_kapasite INTEGER DEFAULT 2,
    cocuk_kapasite INTEGER DEFAULT 0,
    oda_sayisi INTEGER DEFAULT 1,
    metrekare INTEGER,
    yatak_tipi VARCHAR(100),
    manzara VARCHAR(100),
    fiyat DECIMAL(10,2),
    aciklama TEXT,
    durum SMALLINT DEFAULT 1,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (otel_id) REFERENCES otel(id) ON DELETE CASCADE
);

-- Oda Tipi - Oda Özellik İlişki Tablosu
CREATE TABLE IF NOT EXISTS otel_oda_tipi_ozellik_iliski (
    id SERIAL PRIMARY KEY,
    oda_tipi_id INTEGER NOT NULL,
    oda_ozellik_id INTEGER NOT NULL,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (oda_tipi_id) REFERENCES otel_oda_tipi(id) ON DELETE CASCADE,
    FOREIGN KEY (oda_ozellik_id) REFERENCES otel_oda_ozellik(id) ON DELETE CASCADE,
    UNIQUE(oda_tipi_id, oda_ozellik_id)
);

-- Oda Tipi Görselleri
CREATE TABLE IF NOT EXISTS otel_oda_tipi_gorsel (
    id SERIAL PRIMARY KEY,
    oda_tipi_id INTEGER NOT NULL,
    gorsel_url VARCHAR(500) NOT NULL,
    sira INTEGER DEFAULT 0,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (oda_tipi_id) REFERENCES otel_oda_tipi(id) ON DELETE CASCADE
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_otel_hizmet_id ON otel(hizmet_id);
CREATE INDEX IF NOT EXISTS idx_otel_sehir ON otel(sehir);
CREATE INDEX IF NOT EXISTS idx_otel_durum ON otel(durum);
CREATE INDEX IF NOT EXISTS idx_otel_slug ON otel(slug);
CREATE INDEX IF NOT EXISTS idx_otel_detay_otel_id ON otel_detay(otel_id);
CREATE INDEX IF NOT EXISTS idx_otel_gorsel_otel_id ON otel_gorsel(otel_id);
CREATE INDEX IF NOT EXISTS idx_otel_ozellik_iliski_otel_id ON otel_otel_ozellik_iliski(otel_id);
CREATE INDEX IF NOT EXISTS idx_otel_oda_tipi_otel_id ON otel_oda_tipi(otel_id);
CREATE INDEX IF NOT EXISTS idx_oda_ozellik_iliski_oda_tipi_id ON otel_oda_tipi_ozellik_iliski(oda_tipi_id);

-- Trigger fonksiyonları
CREATE OR REPLACE FUNCTION update_otel_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_otel_oda_tipi_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Slug oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION generate_otel_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug = lower(regexp_replace(
            regexp_replace(NEW.ad, '[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s-]', '', 'g'),
            '\s+', '-', 'g'
        ));
        -- Türkçe karakterleri değiştir
        NEW.slug = replace(NEW.slug, 'ğ', 'g');
        NEW.slug = replace(NEW.slug, 'ü', 'u');
        NEW.slug = replace(NEW.slug, 'ş', 's');
        NEW.slug = replace(NEW.slug, 'ı', 'i');
        NEW.slug = replace(NEW.slug, 'ö', 'o');
        NEW.slug = replace(NEW.slug, 'ç', 'c');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger'ları oluştur
DROP TRIGGER IF EXISTS trigger_otel_guncelleme_tarihi ON otel;
CREATE TRIGGER trigger_otel_guncelleme_tarihi
    BEFORE UPDATE ON otel
    FOR EACH ROW
    EXECUTE FUNCTION update_otel_guncelleme_tarihi();

DROP TRIGGER IF EXISTS trigger_otel_slug ON otel;
CREATE TRIGGER trigger_otel_slug
    BEFORE INSERT OR UPDATE ON otel
    FOR EACH ROW
    EXECUTE FUNCTION generate_otel_slug();

DROP TRIGGER IF EXISTS trigger_otel_oda_tipi_guncelleme_tarihi ON otel_oda_tipi;
CREATE TRIGGER trigger_otel_oda_tipi_guncelleme_tarihi
    BEFORE UPDATE ON otel_oda_tipi
    FOR EACH ROW
    EXECUTE FUNCTION update_otel_oda_tipi_guncelleme_tarihi();

-- Yorumlar
COMMENT ON TABLE otel IS 'Otel ana bilgileri';
COMMENT ON TABLE otel_detay IS 'Otel detaylı bilgileri';
COMMENT ON TABLE otel_gorsel IS 'Otel görselleri';
COMMENT ON TABLE otel_otel_ozellik_iliski IS 'Otel - Otel Özellikleri ilişki tablosu';
COMMENT ON TABLE otel_oda_tipi IS 'Otel oda tipleri ve fiyatları';
COMMENT ON TABLE otel_oda_tipi_ozellik_iliski IS 'Oda Tipi - Oda Özellikleri ilişki tablosu';
COMMENT ON TABLE otel_oda_tipi_gorsel IS 'Oda tipi görselleri';

-- Örnek veri
INSERT INTO otel (ad, yildiz, konsept, sehir, bolge, adres, telefon, check_in_time, check_out_time, min_fiyat, durum) VALUES
('Voyage Kundu', 5, 'Ultra Her Şey Dahil', 'Antalya', 'Kundu', 'Kundu Mahallesi, Antalya', '+90 242 431 00 00', '14:00', '12:00', 3500.00, 1)
ON CONFLICT DO NOTHING;

-- Otel detay örneği
INSERT INTO otel_detay (otel_id, kisa_aciklama, uzun_aciklama, denize_mesafe, havalimani_mesafe, sehir_merkezi_mesafe, oda_sayisi, acilis_yili) 
SELECT 
    id,
    'Antalya Kundu bölgesinde yer alan 5 yıldızlı ultra her şey dahil otel',
    'Voyage Kundu, muhteşem Akdeniz kıyısında konumlanmış, modern mimarisi ve lüks hizmet anlayışı ile misafirlerine unutulmaz bir tatil deneyimi sunar.',
    'Denize Sıfır',
    '15 km',
    '25 km',
    500,
    2019
FROM otel WHERE ad = 'Voyage Kundu' AND NOT EXISTS (
    SELECT 1 FROM otel_detay WHERE otel_id = (SELECT id FROM otel WHERE ad = 'Voyage Kundu' LIMIT 1)
);

