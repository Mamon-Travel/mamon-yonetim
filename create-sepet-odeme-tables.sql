-- SEPET VE ÖDEME SİSTEMİ TABLOLARI

-- 1. SEPET TABLOSU
CREATE TABLE IF NOT EXISTS sepet (
    id SERIAL PRIMARY KEY,
    kullanici_id INTEGER NOT NULL,
    urun_id INTEGER NOT NULL,
    miktar INTEGER DEFAULT 1,
    birim_fiyat DECIMAL(10, 2) NOT NULL,
    toplam_fiyat DECIMAL(10, 2) NOT NULL,
    rezervasyon_bilgileri JSONB,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sepet_kullanici FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE,
    CONSTRAINT fk_sepet_urun FOREIGN KEY (urun_id) REFERENCES urunler(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sepet_kullanici ON sepet(kullanici_id);
CREATE INDEX IF NOT EXISTS idx_sepet_urun ON sepet(urun_id);

-- 2. ÖDEMELER TABLOSU (PayTR Entegrasyonu)
CREATE TABLE IF NOT EXISTS odemeler (
    id SERIAL PRIMARY KEY,
    rezervasyon_id INTEGER,
    kullanici_id INTEGER NOT NULL,
    merchant_oid VARCHAR(100) UNIQUE NOT NULL,
    tutar DECIMAL(10, 2) NOT NULL,
    para_birimi VARCHAR(10) DEFAULT 'TRY',
    durum VARCHAR(20) DEFAULT 'beklemede' CHECK (durum IN ('beklemede', 'basarili', 'basarisiz', 'iptal')),
    odeme_yontemi VARCHAR(50) DEFAULT 'paytr',
    paytr_token TEXT,
    paytr_payment_url TEXT,
    hash_value TEXT,
    islem_no VARCHAR(100),
    banka_adi VARCHAR(100),
    taksit_sayisi INTEGER DEFAULT 1,
    hata_mesaji TEXT,
    callback_data JSONB,
    ip_adresi VARCHAR(45),
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    odeme_tarihi TIMESTAMP,
    CONSTRAINT fk_odeme_kullanici FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE,
    CONSTRAINT fk_odeme_rezervasyon FOREIGN KEY (rezervasyon_id) REFERENCES rezervasyonlar(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_odemeler_kullanici ON odemeler(kullanici_id);
CREATE INDEX IF NOT EXISTS idx_odemeler_rezervasyon ON odemeler(rezervasyon_id);
CREATE INDEX IF NOT EXISTS idx_odemeler_merchant_oid ON odemeler(merchant_oid);
CREATE INDEX IF NOT EXISTS idx_odemeler_durum ON odemeler(durum);

-- 3. ÖDEME LOGLARı TABLOSU (PayTR Callback/Webhook Logları)
CREATE TABLE IF NOT EXISTS odeme_loglari (
    id SERIAL PRIMARY KEY,
    odeme_id INTEGER,
    merchant_oid VARCHAR(100),
    log_tipi VARCHAR(50) DEFAULT 'callback' CHECK (log_tipi IN ('callback', 'webhook', 'error', 'success')),
    istek_verisi JSONB,
    yanit_verisi JSONB,
    ip_adresi VARCHAR(45),
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_odeme FOREIGN KEY (odeme_id) REFERENCES odemeler(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_loglari_odeme ON odeme_loglari(odeme_id);
CREATE INDEX IF NOT EXISTS idx_loglari_merchant_oid ON odeme_loglari(merchant_oid);
CREATE INDEX IF NOT EXISTS idx_loglari_tip ON odeme_loglari(log_tipi);


