-- PAYLAŞIM ŞABLONU VE GÖRSEL YÖNETİMİ SİSTEMİ

-- =============================================================================
-- 1. PAYLAŞIM ŞABLONLARI (Social Media Share Templates)
-- =============================================================================
CREATE TABLE IF NOT EXISTS paylasim_sablonlari (
    id SERIAL PRIMARY KEY,
    sablon_adi VARCHAR(200) NOT NULL,
    aciklama TEXT,
    arka_plan_rengi VARCHAR(500) DEFAULT '#FFFFFF',
    arka_plan_gorsel VARCHAR(500),
    logo_url VARCHAR(500),
    logo_konum VARCHAR(20) DEFAULT 'ust-sol' CHECK (logo_konum IN ('ust-sol', 'ust-sag', 'alt-sol', 'alt-sag', 'merkez')),
    baslik_font_family VARCHAR(100) DEFAULT 'Arial',
    baslik_font_size INTEGER DEFAULT 48,
    baslik_renk VARCHAR(20) DEFAULT '#000000',
    aciklama_font_family VARCHAR(100) DEFAULT 'Arial',
    aciklama_font_size INTEGER DEFAULT 24,
    aciklama_renk VARCHAR(20) DEFAULT '#666666',
    genislik INTEGER DEFAULT 1200,
    yukseklik INTEGER DEFAULT 630,
    sablon_json JSONB,
    durum SMALLINT DEFAULT 1,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_paylasim_sablon_durum ON paylasim_sablonlari(durum);

COMMENT ON TABLE paylasim_sablonlari IS 'Sosyal medya paylaşımları için görsel şablonlar (Open Graph, Twitter Card)';
COMMENT ON COLUMN paylasim_sablonlari.sablon_json IS 'Gelişmiş şablon ayarları JSON formatında';

-- =============================================================================
-- 2. GÖRSEL META BİLGİLERİ (Her yüklenen görselin detaylı bilgileri)
-- =============================================================================
CREATE TABLE IF NOT EXISTS gorsel_meta (
    id SERIAL PRIMARY KEY,
    orijinal_dosya_adi VARCHAR(500) NOT NULL,
    kayitli_dosya_adi VARCHAR(500) NOT NULL,
    dosya_yolu VARCHAR(1000) NOT NULL,
    mime_type VARCHAR(100),
    dosya_boyutu BIGINT,
    genislik INTEGER,
    yukseklik INTEGER,
    format VARCHAR(20),
    kalite INTEGER DEFAULT 90,
    iliskili_tablo VARCHAR(100),
    iliskili_id INTEGER,
    alt_text TEXT,
    baslik TEXT,
    aciklama TEXT,
    webp_url VARCHAR(500),
    avif_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    durum SMALLINT DEFAULT 1,
    yukleyen_kullanici_id INTEGER,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gorsel_iliskili ON gorsel_meta(iliskili_tablo, iliskili_id);
CREATE INDEX idx_gorsel_format ON gorsel_meta(format);
CREATE INDEX idx_gorsel_durum ON gorsel_meta(durum);

COMMENT ON TABLE gorsel_meta IS 'Yüklenen tüm görsellerin meta bilgileri ve farklı formatları';
COMMENT ON COLUMN gorsel_meta.iliskili_tablo IS 'Hangi tabloya ait (otel, urunler, blog vb.)';
COMMENT ON COLUMN gorsel_meta.iliskili_id IS 'İlgili tablodaki kayıt ID';
COMMENT ON COLUMN gorsel_meta.webp_url IS 'Otomatik oluşturulan WebP formatı URL';
COMMENT ON COLUMN gorsel_meta.avif_url IS 'Otomatik oluşturulan AVIF formatı URL';

-- =============================================================================
-- 3. İÇERİK PAYLAŞIM AYARLARI (Her otel/içerik için)
-- =============================================================================
CREATE TABLE IF NOT EXISTS icerik_paylasim_ayarlari (
    id SERIAL PRIMARY KEY,
    iliskili_tablo VARCHAR(100) NOT NULL,
    iliskili_id INTEGER NOT NULL,
    paylasim_aktif BOOLEAN DEFAULT false,
    sablon_id INTEGER,
    og_baslik VARCHAR(200),
    og_aciklama TEXT,
    og_gorsel_id INTEGER,
    twitter_card_type VARCHAR(50) DEFAULT 'summary_large_image',
    paylasim_yapildi BOOLEAN DEFAULT false,
    paylasim_tarihi TIMESTAMP,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sablon_id) REFERENCES paylasim_sablonlari(id) ON DELETE SET NULL,
    FOREIGN KEY (og_gorsel_id) REFERENCES gorsel_meta(id) ON DELETE SET NULL,
    UNIQUE(iliskili_tablo, iliskili_id)
);

CREATE INDEX idx_paylasim_iliskili ON icerik_paylasim_ayarlari(iliskili_tablo, iliskili_id);
CREATE INDEX idx_paylasim_aktif ON icerik_paylasim_ayarlari(paylasim_aktif);

COMMENT ON TABLE icerik_paylasim_ayarlari IS 'Her içerik için sosyal medya paylaşım ayarları';
COMMENT ON COLUMN icerik_paylasim_ayarlari.paylasim_aktif IS 'Checkbox: Paylaşıma açık mı?';
COMMENT ON COLUMN icerik_paylasim_ayarlari.og_baslik IS 'Open Graph başlık';
COMMENT ON COLUMN icerik_paylasim_ayarlari.og_aciklama IS 'Open Graph açıklama';

-- =============================================================================
-- TRIGGER FONKSİYONLARI
-- =============================================================================

-- Güncelleme tarihi trigger
CREATE OR REPLACE FUNCTION update_paylasim_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_paylasim_sablon_guncelleme ON paylasim_sablonlari;
CREATE TRIGGER trigger_paylasim_sablon_guncelleme
    BEFORE UPDATE ON paylasim_sablonlari
    FOR EACH ROW
    EXECUTE FUNCTION update_paylasim_guncelleme_tarihi();

DROP TRIGGER IF EXISTS trigger_gorsel_meta_guncelleme ON gorsel_meta;
CREATE TRIGGER trigger_gorsel_meta_guncelleme
    BEFORE UPDATE ON gorsel_meta
    FOR EACH ROW
    EXECUTE FUNCTION update_paylasim_guncelleme_tarihi();

DROP TRIGGER IF EXISTS trigger_icerik_paylasim_guncelleme ON icerik_paylasim_ayarlari;
CREATE TRIGGER trigger_icerik_paylasim_guncelleme
    BEFORE UPDATE ON icerik_paylasim_ayarlari
    FOR EACH ROW
    EXECUTE FUNCTION update_paylasim_guncelleme_tarihi();

-- =============================================================================
-- ÖRNEK VERİLER
-- =============================================================================

-- Varsayılan paylaşım şablonu
INSERT INTO paylasim_sablonlari (
    sablon_adi,
    aciklama,
    arka_plan_rengi,
    baslik_font_size,
    baslik_renk,
    aciklama_font_size,
    aciklama_renk
) VALUES (
    'Varsayılan Şablon',
    'Tüm içerikler için kullanılabilecek varsayılan paylaşım şablonu',
    '#1E40AF',
    54,
    '#FFFFFF',
    28,
    '#E5E7EB'
) ON CONFLICT DO NOTHING;

-- Modern gradient şablon
INSERT INTO paylasim_sablonlari (
    sablon_adi,
    aciklama,
    arka_plan_rengi,
    baslik_font_size,
    baslik_renk,
    aciklama_font_size,
    aciklama_renk,
    sablon_json
) VALUES (
    'Modern Gradient',
    'Gradient arka plan ile modern görünüm',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    60,
    '#FFFFFF',
    30,
    '#F3F4F6',
    '{"gradient": true, "overlay": "rgba(0,0,0,0.3)"}'::jsonb
) ON CONFLICT DO NOTHING;

