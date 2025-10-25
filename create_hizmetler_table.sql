-- Hizmetler tablosu oluşturma (PostgreSQL)
CREATE TABLE IF NOT EXISTS hizmetler (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    aciklama TEXT,
    ikon VARCHAR(100),
    renk VARCHAR(7),
    sira INTEGER DEFAULT 0,
    aktif BOOLEAN DEFAULT true,
    url VARCHAR(255) NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_hizmetler_slug ON hizmetler(slug);
CREATE INDEX IF NOT EXISTS idx_hizmetler_aktif ON hizmetler(aktif);
CREATE INDEX IF NOT EXISTS idx_hizmetler_sira ON hizmetler(sira);

-- Örnek veriler
INSERT INTO hizmetler (ad, slug, aciklama, ikon, renk, sira, aktif, url, meta_title, meta_description) VALUES
('Konaklama', 'stays', 'Mükemmel konaklama seçenekleri bulun', 'House03Icon', '#3B82F6', 1, true, '/', 'Konaklama Rezervasyonu - Chisfis', 'Dünyanın her yerinde konaklama seçenekleri bulun ve rezervasyon yapın'),
('Araç Kiralama', 'cars', 'Seyahatiniz için ideal aracı bulun', 'Car05Icon', '#10B981', 2, true, '/car', 'Araç Kiralama - Chisfis', 'Uygun fiyatlarla araç kiralama seçenekleri'),
('Emlak', 'real-estate', 'Satın almak veya kiralamak için mükemmel yeri bulun', 'RealEstate02Icon', '#F59E0B', 3, true, '/real-estate', 'Emlak - Chisfis', 'Emlak satış ve kiralama seçenekleri'),
('Deneyimler', 'experiences', 'Unutulmaz deneyimler yaşayın', 'HotAirBalloonFreeIcons', '#8B5CF6', 4, true, '/experiences', 'Deneyimler - Chisfis', 'Yerel deneyimler ve aktiviteler'),
('Uçuşlar', 'flights', 'En uygun uçuş fiyatlarını bulun', 'Airplane02Icon', '#EF4444', 5, true, '/flights', 'Uçuş Rezervasyonu - Chisfis', 'Ucuz uçak bileti ve uçuş seçenekleri')
ON CONFLICT (slug) DO NOTHING;

-- Updated_at otomatik güncelleme için trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hizmetler_updated_at 
    BEFORE UPDATE ON hizmetler 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();














