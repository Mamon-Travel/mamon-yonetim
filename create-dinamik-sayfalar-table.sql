-- Dinamik Sayfa Tanımlamaları Tablosu
CREATE TABLE IF NOT EXISTS dinamik_sayfalar (
    id SERIAL PRIMARY KEY,
    baslik VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    aciklama TEXT,
    
    -- Filtre Kriterleri (JSON formatında)
    filtre_kriterleri JSONB NOT NULL DEFAULT '{}',
    -- Örnek: {
    --   "bolgeler": ["Antalya", "Muğla"],
    --   "kategoriler": [1, 2, 3],
    --   "ozellikler": [5, 8, 12],
    --   "yildiz": [4, 5],
    --   "konseptler": ["Her Şey Dahil", "Ultra Her Şey Dahil"],
    --   "min_fiyat": 1000,
    --   "max_fiyat": 5000
    -- }
    
    -- SEO Alanları
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    
    -- Görsel
    kapak_gorseli VARCHAR(500),
    
    -- Sıralama ve Gösterim
    sira INTEGER DEFAULT 0,
    durum INTEGER DEFAULT 1, -- 0: Pasif, 1: Aktif
    
    -- Sayfa İçeriği (Opsiyonel)
    ust_icerik TEXT, -- Sayfa başında gösterilecek içerik
    alt_icerik TEXT, -- Sayfa sonunda gösterilecek içerik
    
    -- Sistem Alanları
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    olusturan_kullanici_id INTEGER
);

-- İndeksler
CREATE INDEX idx_dinamik_sayfalar_slug ON dinamik_sayfalar(slug);
CREATE INDEX idx_dinamik_sayfalar_durum ON dinamik_sayfalar(durum);
CREATE INDEX idx_dinamik_sayfalar_sira ON dinamik_sayfalar(sira);

-- Trigger: Güncelleme tarihi otomatik güncelleme
CREATE OR REPLACE FUNCTION update_dinamik_sayfalar_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_dinamik_sayfalar_guncelleme_tarihi
    BEFORE UPDATE ON dinamik_sayfalar
    FOR EACH ROW
    EXECUTE FUNCTION update_dinamik_sayfalar_guncelleme_tarihi();

-- Örnek Veri
INSERT INTO dinamik_sayfalar (baslik, slug, aciklama, filtre_kriterleri, meta_title, meta_description, durum) VALUES
('Akdeniz Otelleri', 'akdeniz-otelleri', 'Akdeniz bölgesindeki en iyi oteller', 
 '{"bolgeler": ["Antalya", "Muğla", "Mersin"], "yildiz": [4, 5]}'::jsonb,
 'Akdeniz Otelleri - En İyi Fiyatlar', 
 'Akdeniz bölgesindeki 4 ve 5 yıldızlı otellerde tatil fırsatları. Antalya, Muğla ve Mersin otelleri.', 
 1),

('Lüks Oteller', 'luks-oteller', '5 yıldızlı ultra lüks oteller',
 '{"yildiz": [5], "konseptler": ["Ultra Her Şey Dahil"], "min_fiyat": 5000}'::jsonb,
 '5 Yıldızlı Lüks Oteller',
 'Ultra her şey dahil konseptli 5 yıldızlı lüks otellerde unutulmaz bir tatil.',
 1),

('Ekonomik Tatil', 'ekonomik-tatil', 'Uygun fiyatlı otel seçenekleri',
 '{"yildiz": [3, 4], "max_fiyat": 2000}'::jsonb,
 'Ekonomik Tatil Otelleri',
 'Bütçe dostu, kaliteli 3 ve 4 yıldızlı otellerde tatil imkanı.',
 1),

('Denize Sıfır Oteller', 'denize-sifir-oteller', 'Denize sıfır konumlu oteller',
 '{"ozellikler": ["Denize Sıfır", "Özel Plaj"], "bolgeler": ["Antalya", "Muğla"]}'::jsonb,
 'Denize Sıfır Oteller - Özel Plajlı',
 'Antalya ve Muğla''da denize sıfır, özel plajlı otellerde tatil.',
 1);

COMMENT ON TABLE dinamik_sayfalar IS 'Site için dinamik filtreli otel listeleme sayfaları';
COMMENT ON COLUMN dinamik_sayfalar.filtre_kriterleri IS 'JSON formatında filtre kriterleri';
COMMENT ON COLUMN dinamik_sayfalar.slug IS 'URL için benzersiz slug (örn: akdeniz-otelleri)';

