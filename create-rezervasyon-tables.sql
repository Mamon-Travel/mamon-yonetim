-- REZERVASYON SİSTEMİ TABLOLARI

-- 1. ÜRÜNLER TABLOSU (Otel odaları, Araçlar, Emlak, Deneyimler, Uçuşlar)
CREATE TABLE IF NOT EXISTS urunler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hizmet_id INT NOT NULL COMMENT 'Hangi hizmete ait (hizmetler tablosundan)',
    baslik VARCHAR(255) NOT NULL COMMENT 'Ürün başlığı (örn: "Deluxe Oda", "BMW 320i")',
    aciklama TEXT COMMENT 'Detaylı açıklama',
    ana_resim VARCHAR(500) COMMENT 'Ana ürün resmi',
    resimler JSON COMMENT 'Diğer ürün resimleri array',
    fiyat DECIMAL(10, 2) NOT NULL COMMENT 'Temel fiyat',
    fiyat_birimi VARCHAR(10) DEFAULT 'TRY' COMMENT 'Para birimi',
    fiyat_tipi ENUM('gunluk', 'gece', 'saat', 'adet', 'kisi') DEFAULT 'gunluk' COMMENT 'Fiyatlandırma tipi',
    stok_durumu ENUM('mevcut', 'tukendi', 'rezerve') DEFAULT 'mevcut',
    ozellikler JSON COMMENT 'Hizmete özel özellikler (dinamik)',
    durum SMALLINT DEFAULT 1 COMMENT '1: Aktif, 0: Pasif',
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hizmet_id) REFERENCES hizmetler(id) ON DELETE CASCADE,
    INDEX idx_hizmet (hizmet_id),
    INDEX idx_durum (durum)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tüm hizmetlerin ürünlerini tutan ana tablo';

-- ÖRNEK ÖZELLIKLER JSON YAPISI:
-- Konaklama: {"konum": "İstanbul, Türkiye", "oda_tipi": "Deluxe", "kapasite": 2, "banyo": 1, "balkon": true}
-- Araç: {"marka": "BMW", "model": "320i", "yil": 2023, "yakit": "Benzin", "vites": "Otomatik", "konum": "İstanbul"}
-- Emlak: {"konum": "Beşiktaş, İstanbul", "metrekare": 120, "oda_sayisi": 3, "kat": 5, "tipi": "satilik"}
-- Deneyimler: {"konum": "Kapadokya", "sure": "2 saat", "dil": "Türkçe, İngilizce", "min_kisi": 2, "max_kisi": 10}
-- Uçuşlar: {"havayolu": "Turkish Airlines", "ucus_no": "TK123", "kalkis": "IST", "varis": "JFK", "sinif": "Ekonomi"}

-- 2. REZERVASYONLAR (SİPARİŞLER) TABLOSU
CREATE TABLE IF NOT EXISTS rezervasyonlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kullanici_id INT NOT NULL COMMENT 'Rezervasyonu yapan kullanıcı',
    rezervasyon_no VARCHAR(50) UNIQUE NOT NULL COMMENT 'Benzersiz rezervasyon numarası (örn: RSV-2024-001)',
    toplam_tutar DECIMAL(10, 2) NOT NULL COMMENT 'Toplam rezervasyon tutarı',
    para_birimi VARCHAR(10) DEFAULT 'TRY',
    durum ENUM('beklemede', 'onaylandi', 'iptal_edildi', 'tamamlandi') DEFAULT 'beklemede',
    odeme_durumu ENUM('bekleniyor', 'odendi', 'iade_edildi') DEFAULT 'bekleniyor',
    odeme_yontemi VARCHAR(50) COMMENT 'Kredi kartı, Havale, vb.',
    not TEXT COMMENT 'Müşteri notu',
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE,
    INDEX idx_kullanici (kullanici_id),
    INDEX idx_durum (durum),
    INDEX idx_rezervasyon_no (rezervasyon_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Rezervasyonların ana tablosu';

-- 3. REZERVASYON DETAYLARI TABLOSU
CREATE TABLE IF NOT EXISTS rezervasyon_detaylari (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rezervasyon_id INT NOT NULL COMMENT 'Bağlı olduğu rezervasyon',
    urun_id INT NOT NULL COMMENT 'Rezerve edilen ürün',
    hizmet_adi VARCHAR(100) COMMENT 'Hizmet adı (referans için)',
    urun_adi VARCHAR(255) COMMENT 'Ürün adı (referans için)',
    miktar INT DEFAULT 1 COMMENT 'Kaç adet/gece/gün',
    birim_fiyat DECIMAL(10, 2) NOT NULL COMMENT 'Ürün birim fiyatı',
    toplam_fiyat DECIMAL(10, 2) NOT NULL COMMENT 'Satır toplamı',
    rezervasyon_bilgileri JSON COMMENT 'Hizmete özel rezervasyon bilgileri',
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rezervasyon_id) REFERENCES rezervasyonlar(id) ON DELETE CASCADE,
    FOREIGN KEY (urun_id) REFERENCES urunler(id) ON DELETE RESTRICT,
    INDEX idx_rezervasyon (rezervasyon_id),
    INDEX idx_urun (urun_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Rezervasyon detayları - her satır bir ürün';

-- ÖRNEK REZERVASYON BİLGİLERİ JSON YAPISI:
-- Konaklama: {"giris_tarihi": "2024-12-20", "cikis_tarihi": "2024-12-25", "misafir_sayisi": 2, "ozel_istek": "Deniz manzaralı"}
-- Araç: {"alis_konumu": "İstanbul Havalimanı", "teslim_konumu": "Ankara", "alis_tarihi": "2024-12-20 10:00", "teslim_tarihi": "2024-12-23 18:00", "ek_surucu": true}
-- Emlak: {"gorusme_tarihi": "2024-12-20 14:00", "tip": "satilik", "teklif_tutari": 2500000}
-- Deneyimler: {"tarih": "2024-12-20", "saat": "09:00", "kisi_sayisi": 4, "dil": "Türkçe"}
-- Uçuşlar: {"gidis_tarihi": "2024-12-20", "donus_tarihi": "2024-12-25", "yolcu_sayisi": 2, "bagaj": "20kg"}

-- 4. SEPET TABLOSU (Opsiyonel - Geçici sepet için)
CREATE TABLE IF NOT EXISTS sepet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kullanici_id INT NOT NULL,
    urun_id INT NOT NULL,
    miktar INT DEFAULT 1,
    rezervasyon_bilgileri JSON COMMENT 'Kullanıcının seçtiği tarih, konum vb.',
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE,
    FOREIGN KEY (urun_id) REFERENCES urunler(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (kullanici_id, urun_id),
    INDEX idx_kullanici (kullanici_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Kullanıcı sepeti';

-- 5. ÜRÜN DEĞERLENDİRMELERİ (Opsiyonel)
CREATE TABLE IF NOT EXISTS urun_degerlendirmeleri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    urun_id INT NOT NULL,
    kullanici_id INT NOT NULL,
    rezervasyon_id INT COMMENT 'Hangi rezervasyon sonrası yapıldı',
    puan TINYINT CHECK (puan BETWEEN 1 AND 5),
    yorum TEXT,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (urun_id) REFERENCES urunler(id) ON DELETE CASCADE,
    FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE,
    FOREIGN KEY (rezervasyon_id) REFERENCES rezervasyonlar(id) ON DELETE SET NULL,
    INDEX idx_urun (urun_id),
    INDEX idx_kullanici (kullanici_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ürün yorumları ve puanları';

-- ÖRNEK VERİ EKLEMELERI
-- Konaklama Ürünü
INSERT INTO urunler (hizmet_id, baslik, aciklama, ana_resim, fiyat, fiyat_tipi, ozellikler) VALUES 
(1, 'Deluxe Deniz Manzaralı Oda', 'Geniş ve konforlu oda, özel balkon, deniz manzarası', '/uploads/deluxe-room.jpg', 850.00, 'gece', 
'{"konum": "Bodrum, Muğla", "oda_tipi": "Deluxe", "kapasite": 2, "yatak": "Çift kişilik", "banyo": 1, "balkon": true, "manzara": "Deniz", "alan": "35m²"}');

-- Araç Ürünü
INSERT INTO urunler (hizmet_id, baslik, aciklama, ana_resim, fiyat, fiyat_tipi, ozellikler) VALUES 
(2, 'BMW 320i - Otomatik', 'Lüks sedan araç, yakıt tasarruflu, konforlu', '/uploads/bmw-320i.jpg', 450.00, 'gunluk', 
'{"marka": "BMW", "model": "320i", "yil": 2023, "yakit": "Benzin", "vites": "Otomatik", "konum": "İstanbul", "renk": "Siyah", "koltuk": 5, "bagaj": "Büyük"}');

-- Emlak Ürünü
INSERT INTO urunler (hizmet_id, baslik, aciklama, ana_resim, fiyat, fiyat_tipi, ozellikler) VALUES 
(3, '3+1 Satılık Daire - Beşiktaş', 'Modern daire, asansörlü, güvenlikli site', '/uploads/daire-besiktas.jpg', 3500000.00, 'adet', 
'{"konum": "Beşiktaş, İstanbul", "metrekare": 120, "oda_sayisi": "3+1", "kat": 5, "bina_yasi": 3, "isitma": "Kombi", "tipi": "satilik"}');

