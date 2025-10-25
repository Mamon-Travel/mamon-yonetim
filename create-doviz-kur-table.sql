-- DÖVİZ KURLARI TABLOSU
-- TCMB (Türkiye Cumhuriyet Merkez Bankası) kurlarını saklar

CREATE TABLE IF NOT EXISTS doviz_kurlar (
    id SERIAL PRIMARY KEY,
    para_birimi VARCHAR(10) NOT NULL,
    para_adi VARCHAR(100) NOT NULL,
    alis_kuru DECIMAL(10, 4) NOT NULL,
    satis_kuru DECIMAL(10, 4) NOT NULL,
    tcmb_alis DECIMAL(10, 4) NOT NULL,
    tcmb_satis DECIMAL(10, 4) NOT NULL,
    yuzde_marj DECIMAL(5, 2) DEFAULT 0,
    kur_tarihi DATE NOT NULL,
    son_guncelleme TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    durum SMALLINT DEFAULT 1,
    UNIQUE(para_birimi, kur_tarihi)
);

CREATE INDEX idx_doviz_para_birimi ON doviz_kurlar(para_birimi);
CREATE INDEX idx_doviz_kur_tarihi ON doviz_kurlar(kur_tarihi);
CREATE INDEX idx_doviz_durum ON doviz_kurlar(durum);

COMMENT ON TABLE doviz_kurlar IS 'TCMB döviz kurları ve marj yönetimi';
COMMENT ON COLUMN doviz_kurlar.tcmb_alis IS 'Merkez Bankasından çekilen orijinal alış kuru';
COMMENT ON COLUMN doviz_kurlar.tcmb_satis IS 'Merkez Bankasından çekilen orijinal satış kuru';
COMMENT ON COLUMN doviz_kurlar.alis_kuru IS 'Marj eklenmiş alış kuru (müşteriye gösterilen)';
COMMENT ON COLUMN doviz_kurlar.satis_kuru IS 'Marj eklenmiş satış kuru (müşteriye gösterilen)';
COMMENT ON COLUMN doviz_kurlar.yuzde_marj IS 'TCMB kuruna eklenen yüzde (örn: 2.5 = %2.5 marj)';

-- Güncelleme trigger
CREATE OR REPLACE FUNCTION update_doviz_kur_guncelleme()
RETURNS TRIGGER AS $$
BEGIN
    NEW.son_guncelleme = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_doviz_kur_guncelleme ON doviz_kurlar;
CREATE TRIGGER trigger_doviz_kur_guncelleme
    BEFORE UPDATE ON doviz_kurlar
    FOR EACH ROW
    EXECUTE FUNCTION update_doviz_kur_guncelleme();

-- Marj hesaplama trigger (alis_kuru ve satis_kuru otomatik hesaplanır)
CREATE OR REPLACE FUNCTION hesapla_marjli_kur()
RETURNS TRIGGER AS $$
BEGIN
    -- Alış kuruna marj ekle (satıyoruz, daha yüksek)
    NEW.alis_kuru = NEW.tcmb_alis * (1 + (NEW.yuzde_marj / 100));
    
    -- Satış kuruna marj ekle (alıyoruz, daha düşük)
    NEW.satis_kuru = NEW.tcmb_satis * (1 + (NEW.yuzde_marj / 100));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_hesapla_marjli_kur ON doviz_kurlar;
CREATE TRIGGER trigger_hesapla_marjli_kur
    BEFORE INSERT OR UPDATE ON doviz_kurlar
    FOR EACH ROW
    EXECUTE FUNCTION hesapla_marjli_kur();

-- Örnek veriler (manuel giriş için)
INSERT INTO doviz_kurlar (para_birimi, para_adi, tcmb_alis, tcmb_satis, yuzde_marj, kur_tarihi) VALUES
('USD', 'Amerikan Doları', 34.20, 34.35, 2.5, CURRENT_DATE),
('EUR', 'Euro', 37.10, 37.25, 2.5, CURRENT_DATE),
('GBP', 'İngiliz Sterlini', 43.50, 43.70, 2.5, CURRENT_DATE),
('CHF', 'İsviçre Frangı', 39.80, 40.00, 2.5, CURRENT_DATE),
('RUB', 'Rus Rublesi', 0.35, 0.36, 3.0, CURRENT_DATE)
ON CONFLICT (para_birimi, kur_tarihi) DO UPDATE SET
    tcmb_alis = EXCLUDED.tcmb_alis,
    tcmb_satis = EXCLUDED.tcmb_satis,
    yuzde_marj = EXCLUDED.yuzde_marj;

