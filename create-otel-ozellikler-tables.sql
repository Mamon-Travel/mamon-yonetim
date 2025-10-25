-- Otel Özellikleri Tablosu
CREATE TABLE IF NOT EXISTS otel_ozellik (
    id SERIAL PRIMARY KEY,
    baslik VARCHAR(100) NOT NULL,
    aciklama TEXT,
    ikon VARCHAR(100),
    sira INTEGER DEFAULT 0,
    durum SMALLINT DEFAULT 1,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Otel Oda Özellikleri Tablosu
CREATE TABLE IF NOT EXISTS otel_oda_ozellik (
    id SERIAL PRIMARY KEY,
    baslik VARCHAR(100) NOT NULL,
    aciklama TEXT,
    ikon VARCHAR(100),
    sira INTEGER DEFAULT 0,
    durum SMALLINT DEFAULT 1,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_otel_ozellik_durum ON otel_ozellik(durum);
CREATE INDEX IF NOT EXISTS idx_otel_ozellik_sira ON otel_ozellik(sira);
CREATE INDEX IF NOT EXISTS idx_otel_oda_ozellik_durum ON otel_oda_ozellik(durum);
CREATE INDEX IF NOT EXISTS idx_otel_oda_ozellik_sira ON otel_oda_ozellik(sira);

-- Güncelleme zamanı için trigger fonksiyonları
CREATE OR REPLACE FUNCTION update_otel_ozellik_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_otel_oda_ozellik_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger'ları oluştur
DROP TRIGGER IF EXISTS trigger_otel_ozellik_guncelleme_tarihi ON otel_ozellik;
CREATE TRIGGER trigger_otel_ozellik_guncelleme_tarihi
    BEFORE UPDATE ON otel_ozellik
    FOR EACH ROW
    EXECUTE FUNCTION update_otel_ozellik_guncelleme_tarihi();

DROP TRIGGER IF EXISTS trigger_otel_oda_ozellik_guncelleme_tarihi ON otel_oda_ozellik;
CREATE TRIGGER trigger_otel_oda_ozellik_guncelleme_tarihi
    BEFORE UPDATE ON otel_oda_ozellik
    FOR EACH ROW
    EXECUTE FUNCTION update_otel_oda_ozellik_guncelleme_tarihi();

-- Örnek Otel Özellikleri
INSERT INTO otel_ozellik (baslik, aciklama, ikon, sira, durum) VALUES
('Ücretsiz Wi-Fi', 'Tüm otel genelinde ücretsiz kablosuz internet', 'wifi', 1, 1),
('Ücretsiz Otopark', 'Açık veya kapalı otopark imkanı', 'parking', 2, 1),
('Açık Havuz', 'Açık yüzme havuzu', 'pool', 3, 1),
('Kapalı Havuz', 'Kapalı yüzme havuzu', 'pool', 4, 1),
('Spa & Wellness', 'Spa ve sağlık merkezi', 'spa', 5, 1),
('Fitness Merkezi', 'Spor salonu ve fitness imkanları', 'gym', 6, 1),
('Restoran', 'Otel içi restoran', 'restaurant', 7, 1),
('Bar', 'Otel içi bar', 'bar', 8, 1),
('24 Saat Resepsiyon', 'Kesintisiz resepsiyon hizmeti', 'reception', 9, 1),
('Oda Servisi', 'Oda servisi hizmeti', 'room-service', 10, 1),
('Transfer Hizmeti', 'Havalimanı transfer hizmeti', 'transfer', 11, 1),
('Çocuk Kulübü', 'Çocuklar için aktivite alanı', 'kids-club', 12, 1),
('Evcil Hayvan Dostu', 'Evcil hayvanlarla konaklama', 'pet', 13, 1),
('Denize Sıfır', 'Denize yürüme mesafesi', 'beach', 14, 1),
('Plaj', 'Özel plaj', 'beach', 15, 1)
ON CONFLICT DO NOTHING;

-- Örnek Oda Özellikleri
INSERT INTO otel_oda_ozellik (baslik, aciklama, ikon, sira, durum) VALUES
('Klima', 'Soğutma ve ısıtma sistemi', 'ac', 1, 1),
('LCD TV', 'Düz ekran televizyon', 'tv', 2, 1),
('Minibar', 'Mini buzdolabı', 'minibar', 3, 1),
('Kasa', 'Güvenlik kasası', 'safe', 4, 1),
('Balkon', 'Özel balkon', 'balcony', 5, 1),
('Deniz Manzarası', 'Deniz manzaralı oda', 'sea-view', 6, 1),
('Saç Kurutma Makinesi', 'Saç kurutma cihazı', 'hairdryer', 7, 1),
('Duş', 'Duş kabini', 'shower', 8, 1),
('Küvet', 'Banyo küveti', 'bathtub', 9, 1),
('Bornoz & Terlik', 'Bornoz ve terlik', 'bathrobe', 10, 1),
('Oda İçi Wi-Fi', 'Ücretsiz oda içi internet', 'wifi', 11, 1),
('Çalışma Masası', 'Çalışma alanı', 'desk', 12, 1),
('Telefon', 'Oda telefonu', 'phone', 13, 1),
('Uydu Yayını', 'Uydu TV kanalları', 'satellite', 14, 1),
('Ses Yalıtımı', 'Ses geçirmez odalar', 'soundproof', 15, 1),
('Sigara İçilmeyen', 'Sigara içilmeyen oda', 'no-smoking', 16, 1),
('Kahve/Çay Makinesi', 'Kahve ve çay hazırlama imkanı', 'coffee', 17, 1)
ON CONFLICT DO NOTHING;

-- Yorumlar
COMMENT ON TABLE otel_ozellik IS 'Otel genel özellikleri (Wi-Fi, Havuz, Spa vb.)';
COMMENT ON COLUMN otel_ozellik.id IS 'Özellik ID';
COMMENT ON COLUMN otel_ozellik.baslik IS 'Özellik başlığı';
COMMENT ON COLUMN otel_ozellik.aciklama IS 'Özellik açıklaması';
COMMENT ON COLUMN otel_ozellik.ikon IS 'İkon adı';
COMMENT ON COLUMN otel_ozellik.sira IS 'Sıralama';
COMMENT ON COLUMN otel_ozellik.durum IS 'Durum (1: Aktif, 0: Pasif)';

COMMENT ON TABLE otel_oda_ozellik IS 'Otel oda özellikleri (Klima, TV, Minibar vb.)';
COMMENT ON COLUMN otel_oda_ozellik.id IS 'Özellik ID';
COMMENT ON COLUMN otel_oda_ozellik.baslik IS 'Özellik başlığı';
COMMENT ON COLUMN otel_oda_ozellik.aciklama IS 'Özellik açıklaması';
COMMENT ON COLUMN otel_oda_ozellik.ikon IS 'İkon adı';
COMMENT ON COLUMN otel_oda_ozellik.sira IS 'Sıralama';
COMMENT ON COLUMN otel_oda_ozellik.durum IS 'Durum (1: Aktif, 0: Pasif)';









