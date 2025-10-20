-- Panel Kullanıcılar Tablosu Oluşturma
CREATE TABLE IF NOT EXISTS panel_kullanicilar (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    soyad VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    kullanici_adi VARCHAR(100) NOT NULL UNIQUE,
    sifre VARCHAR(255) NOT NULL,
    telefon VARCHAR(20),
    resim VARCHAR(500),
    rol VARCHAR(50) DEFAULT 'editor',
    durum SMALLINT DEFAULT 1,
    yetki_ids VARCHAR(255),
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX idx_panel_kullanicilar_email ON panel_kullanicilar(email);
CREATE INDEX idx_panel_kullanicilar_kullanici_adi ON panel_kullanicilar(kullanici_adi);
CREATE INDEX idx_panel_kullanicilar_durum ON panel_kullanicilar(durum);
CREATE INDEX idx_panel_kullanicilar_rol ON panel_kullanicilar(rol);

-- Güncelleme zamanı için trigger fonksiyonu
CREATE OR REPLACE FUNCTION update_panel_kullanicilar_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger oluştur
CREATE TRIGGER trigger_panel_kullanicilar_guncelleme_tarihi
    BEFORE UPDATE ON panel_kullanicilar
    FOR EACH ROW
    EXECUTE FUNCTION update_panel_kullanicilar_guncelleme_tarihi();

-- Örnek admin kullanıcı ekle (şifre: admin123)
INSERT INTO panel_kullanicilar (ad, soyad, email, kullanici_adi, sifre, rol, durum)
VALUES (
    'Admin',
    'User',
    'admin@mamon.com',
    'admin',
    '$2b$10$78Q1b59yk2Um9WdkpjW4I.m.eGrn2mJ1cBaiSDS0TdL6bEh19eBG.',
    'admin',
    1
) ON CONFLICT (email) DO NOTHING;

COMMENT ON TABLE panel_kullanicilar IS 'Yönetim paneli kullanıcıları';
COMMENT ON COLUMN panel_kullanicilar.id IS 'Kullanıcı ID';
COMMENT ON COLUMN panel_kullanicilar.ad IS 'Kullanıcı adı';
COMMENT ON COLUMN panel_kullanicilar.soyad IS 'Kullanıcı soyadı';
COMMENT ON COLUMN panel_kullanicilar.email IS 'E-posta adresi';
COMMENT ON COLUMN panel_kullanicilar.kullanici_adi IS 'Kullanıcı adı (login için)';
COMMENT ON COLUMN panel_kullanicilar.sifre IS 'Hash''lenmiş şifre';
COMMENT ON COLUMN panel_kullanicilar.telefon IS 'Telefon numarası';
COMMENT ON COLUMN panel_kullanicilar.resim IS 'Profil resmi URL';
COMMENT ON COLUMN panel_kullanicilar.rol IS 'Kullanıcı rolü (admin, editor, viewer)';
COMMENT ON COLUMN panel_kullanicilar.durum IS 'Durum (1: Aktif, 0: Pasif)';
COMMENT ON COLUMN panel_kullanicilar.yetki_ids IS 'Yetki ID''leri (virgülle ayrılmış)';
COMMENT ON COLUMN panel_kullanicilar.olusturma_tarihi IS 'Kayıt oluşturma tarihi';
COMMENT ON COLUMN panel_kullanicilar.guncelleme_tarihi IS 'Son güncellenme tarihi';

