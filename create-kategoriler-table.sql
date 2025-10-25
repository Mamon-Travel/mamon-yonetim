-- Kategoriler tablosu (Stays, Cars, Experiences, Real Estate, Flights için kategoriler)

CREATE TABLE IF NOT EXISTS kategoriler (
  id SERIAL PRIMARY KEY,
  hizmet_id INTEGER NOT NULL,
  ad VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  bolge VARCHAR(255),
  adet INTEGER DEFAULT 0,
  aciklama TEXT,
  thumbnail VARCHAR(500),
  kapak_gorseli VARCHAR(500),
  sira INTEGER DEFAULT 0,
  durum SMALLINT DEFAULT 1,
  olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_hizmet FOREIGN KEY (hizmet_id) REFERENCES hizmetler(id) ON DELETE CASCADE,
  CONSTRAINT unique_hizmet_slug UNIQUE (hizmet_id, slug)
);

-- Index'ler
CREATE INDEX idx_kategoriler_hizmet_id ON kategoriler(hizmet_id);
CREATE INDEX idx_kategoriler_slug ON kategoriler(slug);
CREATE INDEX idx_kategoriler_durum ON kategoriler(durum);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_kategoriler_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
  NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_kategoriler_guncelleme_tarihi
  BEFORE UPDATE ON kategoriler
  FOR EACH ROW
  EXECUTE FUNCTION update_kategoriler_guncelleme_tarihi();

-- Örnek seed data (categories.ts'deki verilerden)
-- Önce hizmetlere bakalım (1=Konaklama olduğunu biliyoruz)

-- Konaklama kategorileri (hizmet_id = 1)
INSERT INTO kategoriler (hizmet_id, ad, slug, bolge, adet, aciklama, thumbnail, sira, durum) VALUES
(1, 'New York, USA', 'new-york-usa', 'United States', 5000, 'Explore the Big Apple', 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg', 1, 1),
(1, 'Singapore', 'singapore', 'Singapore', 2500, 'Garden city of Asia', 'https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg', 2, 1),
(1, 'Paris, France', 'paris-france', 'France', 3000, 'City of lights', 'https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg', 3, 1),
(1, 'London, UK', 'london-uk', 'United Kingdom', 116288, 'Historic and modern blend', 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg', 4, 1),
(1, 'Tokyo, Japan', 'tokyo-japan', 'Japan', 5000, 'Where tradition meets future', 'https://images.pexels.com/photos/4151484/pexels-photo-4151484.jpeg', 5, 1),
(1, 'Maldives', 'maldives', 'Indian Ocean', 7500, 'The Maldives, officially the Republic of Maldives', 'https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg', 6, 1),
(1, 'Roma, Italy', 'roma-italy', 'Italy', 8100, 'Italy, a European country with a long Mediterranean', 'https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg', 7, 1),
(1, 'Enjoy the great cold', 'enjoy-the-great-cold', 'Arctic', 15600, 'The Arctic is the northernmost region of Earth', 'https://images.pexels.com/photos/5764100/pexels-photo-5764100.jpeg', 8, 1),
(1, 'Sleep in a floating way', 'sleep-in-a-floating-way', 'Worldwide', 1000, 'A floating hotel is a type of hotel', 'https://images.pexels.com/photos/2869499/pexels-photo-2869499.jpeg', 9, 1),
(1, 'In the billionaire''s house', 'in-the-billionaires-house', 'Worldwide', 3000, 'A billionaire''s house', 'https://images.pexels.com/photos/7031413/pexels-photo-7031413.jpeg', 10, 1),
(1, 'Cool in the deep forest', 'cool-in-the-deep-forest', 'Worldwide', 6000, 'Cool in the deep forest', 'https://images.pexels.com/photos/247532/pexels-photo-247532.jpeg', 11, 1),
(1, 'Sunset in the desert', 'sunset-in-the-desert', 'Worldwide', 1000, 'Sunset in the desert', 'https://images.pexels.com/photos/32223288/pexels-photo-32223288/free-photo-of-ngoi-nha-da-d-a-trung-h-i-quy-n-ru-v-i-di-m-nh-n-mau-vang.jpeg', 12, 1);

COMMENT ON TABLE kategoriler IS 'Hizmet kategorileri (Konaklama, Araç, Deneyim vb. için şehir/bölge kategorileri)';
COMMENT ON COLUMN kategoriler.hizmet_id IS 'Hizmet ID (1=Konaklama, 2=Araç Kiralama, vb.)';
COMMENT ON COLUMN kategoriler.ad IS 'Kategori adı (örn: New York, USA)';
COMMENT ON COLUMN kategoriler.slug IS 'URL için slug (örn: new-york-usa)';
COMMENT ON COLUMN kategoriler.bolge IS 'Bölge/Region (örn: United States)';
COMMENT ON COLUMN kategoriler.adet IS 'Bu kategorideki ilan sayısı';
COMMENT ON COLUMN kategoriler.thumbnail IS 'Thumbnail görsel URL';
COMMENT ON COLUMN kategoriler.kapak_gorseli IS 'Kapak görseli URL (opsiyonel)';

