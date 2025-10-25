-- Nasıl Çalışır tablosu (Ana sayfadaki "How it works" bölümü için)

CREATE TABLE IF NOT EXISTS nasil_calisir (
  id SERIAL PRIMARY KEY,
  sayfa VARCHAR(100) NOT NULL DEFAULT 'anasayfa',
  baslik VARCHAR(255) NOT NULL,
  aciklama TEXT,
  gorsel_url VARCHAR(500),
  gorsel_url_dark VARCHAR(500),
  sira INTEGER DEFAULT 0,
  durum SMALLINT DEFAULT 1,
  olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index'ler
CREATE INDEX idx_nasil_calisir_sayfa ON nasil_calisir(sayfa);
CREATE INDEX idx_nasil_calisir_durum ON nasil_calisir(durum);
CREATE INDEX idx_nasil_calisir_sira ON nasil_calisir(sira);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_nasil_calisir_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
  NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_nasil_calisir_guncelleme_tarihi
  BEFORE UPDATE ON nasil_calisir
  FOR EACH ROW
  EXECUTE FUNCTION update_nasil_calisir_guncelleme_tarihi();

-- Seed data (varsayılan adımlar)
INSERT INTO nasil_calisir (sayfa, baslik, aciklama, gorsel_url, sira, durum) VALUES
('anasayfa', 'Book & relax', 'Let each trip be an inspirational journey, each room a peaceful space', '/images/HIW1.png', 1, 1),
('anasayfa', 'Smart checklist', 'Let each trip be an inspirational journey, each room a peaceful space', '/images/HIW2.png', 2, 1),
('anasayfa', 'Save more', 'Let each trip be an inspirational journey, each room a peaceful space', '/images/HIW3.png', 3, 1)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE nasil_calisir IS 'Nasıl çalışır adımları (Ana sayfadaki How it Works bölümü)';
COMMENT ON COLUMN nasil_calisir.sayfa IS 'Hangi sayfada gösterilecek (anasayfa, hakkimizda, vb.)';
COMMENT ON COLUMN nasil_calisir.baslik IS 'Adım başlığı';
COMMENT ON COLUMN nasil_calisir.aciklama IS 'Adım açıklaması';
COMMENT ON COLUMN nasil_calisir.gorsel_url IS 'Görsel URL (light mode)';
COMMENT ON COLUMN nasil_calisir.gorsel_url_dark IS 'Görsel URL (dark mode - opsiyonel)';

