-- ================================================
-- Menü Tablolarını Yeniden Yapılandırma
-- ================================================
-- NOT: Bu scripti mamon_travel veritabanına bağlıyken çalıştırın

-- 1. Önce mevcut verileri yedekleyin (isteğe bağlı)
-- CREATE TABLE anamenu_backup AS SELECT * FROM anamenu;
-- CREATE TABLE menu_backup AS SELECT * FROM menu;
-- CREATE TABLE anamenu_alt_backup AS SELECT * FROM anamenu_alt;

-- 2. Foreign key'leri kaldır
ALTER TABLE anamenu_alt DROP CONSTRAINT IF EXISTS fk_anamenu_alt_menu;
ALTER TABLE menu DROP CONSTRAINT IF EXISTS fk_menu_anamenu;

-- 3. Eski verileri temizle (yeni yapıya uygun olmadığı için)
DELETE FROM menu;
DELETE FROM anamenu_alt;
DELETE FROM anamenu;

-- Sequence'ları sıfırla (ID'ler 1'den başlasın)
ALTER SEQUENCE anamenu_id_seq RESTART WITH 1;
ALTER SEQUENCE anamenu_alt_id_seq RESTART WITH 1;
ALTER SEQUENCE menu_id_seq RESTART WITH 1;

-- 4. anamenu_alt tablosunu güncelle (menu_id -> anamenu_id)
ALTER TABLE anamenu_alt DROP COLUMN IF EXISTS menu_id;
ALTER TABLE anamenu_alt ADD COLUMN anamenu_id INTEGER NOT NULL DEFAULT 1;

-- 5. menu tablosunu güncelle (anamenu_id -> anamenu_alt_id)
ALTER TABLE menu DROP COLUMN IF EXISTS anamenu_id;
ALTER TABLE menu ADD COLUMN anamenu_alt_id INTEGER NOT NULL DEFAULT 1;

-- 6. Yeni foreign key'leri ekle
ALTER TABLE anamenu_alt 
  ADD CONSTRAINT fk_anamenu_alt_anamenu 
  FOREIGN KEY (anamenu_id) 
  REFERENCES anamenu(id) 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

ALTER TABLE menu 
  ADD CONSTRAINT fk_menu_anamenu_alt 
  FOREIGN KEY (anamenu_alt_id) 
  REFERENCES anamenu_alt(id) 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

-- 7. Index'leri güncelle
DROP INDEX IF EXISTS idx_anamenu_alt_menu_id;
CREATE INDEX idx_anamenu_alt_anamenu_id ON anamenu_alt(anamenu_id);

DROP INDEX IF EXISTS idx_menu_anamenu_id;
CREATE INDEX idx_menu_anamenu_alt_id ON menu(anamenu_alt_id);

-- 8. Comment'leri güncelle
COMMENT ON COLUMN anamenu_alt.anamenu_id IS 'Bağlı olduğu anamenu ID';
COMMENT ON COLUMN menu.anamenu_alt_id IS 'Bağlı olduğu anamenu_alt ID';

-- 9. Örnek veriler
-- Anamenu (Kategoriler)
INSERT INTO anamenu (anamenu, ikon, sira, yetki_ids) VALUES
('Dashboard', 'dashboard', 1, '1,2,3'),
('Yönetim', 'settings', 2, '1,2'),
('Raporlar', 'chart', 3, '1,2,3');

-- Anamenu Alt (Ana Menü Öğeleri)
INSERT INTO anamenu_alt (baslik, anamenu_id, rota, ikon, sira, yetki_ids, durum) VALUES
-- Dashboard altında
('Ana Sayfa', 1, '/dashboard', 'home', 1, '1,2,3', 1),
('Analizler', 1, '/dashboard/analizler', 'analytics', 2, '1,2', 1),

-- Yönetim altında
('Kullanıcılar', 2, '/yonetim/kullanicilar', 'users', 1, '1,2', 1),
('Yetkiler', 2, '/yonetim/yetkiler', 'shield', 2, '1', 1),
('Menü Yönetimi', 2, '/yonetim/menuler', 'menu', 3, '1', 1),

-- Raporlar altında
('Satış Raporları', 3, '/raporlar/satis', 'trending-up', 1, '1,2,3', 1),
('Kullanıcı Raporları', 3, '/raporlar/kullanicilar', 'users', 2, '1,2', 1);

-- Menu (Alt Menüler - sadece Kullanıcılar ve Satış Raporları için örnek)
INSERT INTO menu (menu, anamenu_alt_id, rota, ikon, sira, yetki_ids) VALUES
-- Kullanıcılar (anamenu_alt_id=3) altında
('Kullanıcı Listesi', 3, '/yonetim/kullanicilar/liste', 'list', 1, '1,2'),
('Yeni Kullanıcı', 3, '/yonetim/kullanicilar/yeni', 'plus', 2, '1,2'),
('Kullanıcı Raporları', 3, '/yonetim/kullanicilar/raporlar', 'chart', 3, '1', 1),

-- Satış Raporları (anamenu_alt_id=6) altında
('Günlük Satışlar', 6, '/raporlar/satis/gunluk', 'calendar', 1, '1,2,3'),
('Aylık Satışlar', 6, '/raporlar/satis/aylik', 'calendar', 2, '1,2,3'),
('Yıllık Satışlar', 6, '/raporlar/satis/yillik', 'calendar', 3, '1,2');

-- 10. Doğrulama sorguları
SELECT 'ANAMENU' as tablo, COUNT(*) as kayit_sayisi FROM anamenu
UNION ALL
SELECT 'ANAMENU_ALT', COUNT(*) FROM anamenu_alt
UNION ALL
SELECT 'MENU', COUNT(*) FROM menu;

-- Yapıyı görmek için
SELECT 
    a.anamenu as kategori,
    aa.baslik as ana_menu,
    m.menu as alt_menu
FROM anamenu a
LEFT JOIN anamenu_alt aa ON aa.anamenu_id = a.id
LEFT JOIN menu m ON m.anamenu_alt_id = aa.id
ORDER BY a.sira, aa.sira, m.sira;

-- ================================================
-- Yeni Tablo Yapısı:
-- ================================================
-- anamenu:
--   - id, anamenu, ikon, sira, yetki_ids
--
-- anamenu_alt:
--   - id, baslik, anamenu_id, rota, ikon, sira, yetki_ids, durum
--
-- menu:
--   - id, menu, anamenu_alt_id, rota, ikon, sira, yetki_ids
-- ================================================

