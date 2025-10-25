-- Footer Menüleri tablosu

CREATE TABLE IF NOT EXISTS footer_menuler (
  id SERIAL PRIMARY KEY,
  kategori VARCHAR(100) NOT NULL,
  baslik VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  sira INTEGER DEFAULT 0,
  durum SMALLINT DEFAULT 1,
  olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Footer Ayarları tablosu (Logo, copyright, sosyal medya)
CREATE TABLE IF NOT EXISTS footer_ayarlar (
  id SERIAL PRIMARY KEY,
  anahtar VARCHAR(100) NOT NULL UNIQUE,
  deger TEXT,
  tip VARCHAR(50) DEFAULT 'text',
  aciklama TEXT,
  olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index'ler
CREATE INDEX idx_footer_menuler_kategori ON footer_menuler(kategori);
CREATE INDEX idx_footer_menuler_durum ON footer_menuler(durum);
CREATE INDEX idx_footer_menuler_sira ON footer_menuler(sira);
CREATE INDEX idx_footer_ayarlar_anahtar ON footer_ayarlar(anahtar);

-- Trigger for footer_menuler
CREATE OR REPLACE FUNCTION update_footer_menuler_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
  NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_footer_menuler_guncelleme_tarihi
  BEFORE UPDATE ON footer_menuler
  FOR EACH ROW
  EXECUTE FUNCTION update_footer_menuler_guncelleme_tarihi();

-- Trigger for footer_ayarlar
CREATE OR REPLACE FUNCTION update_footer_ayarlar_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
  NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_footer_ayarlar_guncelleme_tarihi
  BEFORE UPDATE ON footer_ayarlar
  FOR EACH ROW
  EXECUTE FUNCTION update_footer_ayarlar_guncelleme_tarihi();

-- Seed data - Footer Menüleri
INSERT INTO footer_menuler (kategori, baslik, url, sira, durum) VALUES
-- Solutions
('solutions', 'Marketing', '#', 1, 1),
('solutions', 'Analytics', '#', 2, 1),
('solutions', 'Automation', '#', 3, 1),
('solutions', 'Commerce', '#', 4, 1),
-- Support
('support', 'Submit ticket', '#', 1, 1),
('support', 'Documentation', '#', 2, 1),
('support', 'Guides', '#', 3, 1),
-- Company
('company', 'About', '/about', 1, 1),
('company', 'Blog', '#', 2, 1),
('company', 'Jobs', '#', 3, 1),
('company', 'Press', '#', 4, 1),
-- Legal
('legal', 'Terms of service', '#', 1, 1),
('legal', 'Privacy policy', '#', 2, 1),
('legal', 'License', '#', 3, 1),
('legal', 'Insights', '#', 4, 1)
ON CONFLICT DO NOTHING;

-- Seed data - Footer Ayarları
INSERT INTO footer_ayarlar (anahtar, deger, tip, aciklama) VALUES
('about_text', 'Making the world a better place through constructing elegant hierarchies.', 'text', 'Footer hakkında metni'),
('copyright', '© 2025 Your Company, Inc. All rights reserved.', 'text', 'Copyright metni'),
('facebook_url', '#', 'url', 'Facebook URL'),
('instagram_url', '#', 'url', 'Instagram URL'),
('twitter_url', '#', 'url', 'Twitter/X URL'),
('github_url', '#', 'url', 'GitHub URL'),
('youtube_url', '#', 'url', 'YouTube URL')
ON CONFLICT (anahtar) DO NOTHING;

COMMENT ON TABLE footer_menuler IS 'Footer menü linkleri (Solutions, Support, Company, Legal)';
COMMENT ON TABLE footer_ayarlar IS 'Footer genel ayarları (Logo metni, copyright, sosyal medya)';
COMMENT ON COLUMN footer_menuler.kategori IS 'Menü kategorisi (solutions, support, company, legal)';

