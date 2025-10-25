-- Site Özellikleri tablosu (Ana sayfadaki "Our Features" bölümü için)

CREATE TABLE IF NOT EXISTS site_ozellikleri (
  id SERIAL PRIMARY KEY,
  sayfa VARCHAR(100) NOT NULL DEFAULT 'anasayfa',
  rozet VARCHAR(100) NOT NULL,
  rozet_renk VARCHAR(20) DEFAULT 'blue',
  baslik VARCHAR(255) NOT NULL,
  aciklama TEXT,
  sira INTEGER DEFAULT 0,
  durum SMALLINT DEFAULT 1,
  olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index'ler
CREATE INDEX idx_site_ozellikleri_sayfa ON site_ozellikleri(sayfa);
CREATE INDEX idx_site_ozellikleri_durum ON site_ozellikleri(durum);
CREATE INDEX idx_site_ozellikleri_sira ON site_ozellikleri(sira);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_site_ozellikleri_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
  NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_site_ozellikleri_guncelleme_tarihi
  BEFORE UPDATE ON site_ozellikleri
  FOR EACH ROW
  EXECUTE FUNCTION update_site_ozellikleri_guncelleme_tarihi();

-- Seed data (varsayılan özellikler)
INSERT INTO site_ozellikleri (sayfa, rozet, rozet_renk, baslik, aciklama, sira, durum) VALUES
('anasayfa', 'Advertising', 'blue', 'Cost-effective advertising', 'With a free listing, you can advertise your rental with no upfront costs', 1, 1),
('anasayfa', 'Exposure', 'green', 'Reach millions with Chisfis', 'Millions of people are searching for unique places to stay around the world', 2, 1),
('anasayfa', 'Secure', 'red', 'Secure and simple', 'A Holiday Lettings listing gives you a secure and easy way to take bookings and payments online', 3, 1)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE site_ozellikleri IS 'Site özellikleri ve avantajlar (Ana sayfadaki Features bölümü)';
COMMENT ON COLUMN site_ozellikleri.sayfa IS 'Hangi sayfada gösterilecek (anasayfa, hakkimizda, vb.)';
COMMENT ON COLUMN site_ozellikleri.rozet IS 'Rozet metni (Advertising, Exposure, vb.)';
COMMENT ON COLUMN site_ozellikleri.rozet_renk IS 'Rozet rengi (red, green, blue)';
COMMENT ON COLUMN site_ozellikleri.baslik IS 'Özellik başlığı';
COMMENT ON COLUMN site_ozellikleri.aciklama IS 'Özellik açıklaması';

