-- ================================================
-- GÜVENLİ MİGRATİON - Mevcut Veriler Korunarak
-- ================================================
-- NOT: Bu scripti mamon_travel veritabanına bağlıyken çalıştırın

-- 1. Önce mevcut ID'leri kontrol edelim
SELECT 'Mevcut ANAMENU Kayıtları:' as bilgi;
SELECT id, anamenu FROM anamenu ORDER BY id;

SELECT 'Mevcut ANAMENU_ALT Kayıtları:' as bilgi;
SELECT id, baslik FROM anamenu_alt ORDER BY id;

SELECT 'Mevcut MENU Kayıtları:' as bilgi;
SELECT id, menu FROM menu ORDER BY id;

-- ================================================
-- 2. Foreign Key'leri kaldır
-- ================================================
DO $$
BEGIN
    -- Tüm constraint'leri bul ve kaldır
    EXECUTE (
        SELECT string_agg('ALTER TABLE ' || quote_ident(table_name) || 
               ' DROP CONSTRAINT IF EXISTS ' || quote_ident(constraint_name) || ';', ' ')
        FROM information_schema.table_constraints
        WHERE table_name IN ('menu', 'anamenu_alt')
        AND constraint_type = 'FOREIGN KEY'
    );
END $$;

-- ================================================
-- 3. Verileri temizle VE sequence'ları resetle
-- ================================================
-- Menu'deki verileri sil
DELETE FROM menu;

-- Anamenu_alt'daki verileri sil  
DELETE FROM anamenu_alt;

-- Anamenu'deki verileri sil
DELETE FROM anamenu;

-- Sequence'ları 1'e çek
SELECT setval('anamenu_id_seq', 1, false);
SELECT setval('anamenu_alt_id_seq', 1, false);
SELECT setval('menu_id_seq', 1, false);

-- ================================================
-- 4. Tablo yapılarını güncelle
-- ================================================

-- anamenu_alt tablosunu güncelle (menu_id -> anamenu_id)
ALTER TABLE anamenu_alt DROP COLUMN IF EXISTS menu_id;
ALTER TABLE anamenu_alt ADD COLUMN IF NOT EXISTS anamenu_id INTEGER NOT NULL DEFAULT 1;

-- menu tablosunu güncelle (anamenu_id -> anamenu_alt_id)  
ALTER TABLE menu DROP COLUMN IF EXISTS anamenu_id;
ALTER TABLE menu ADD COLUMN IF NOT EXISTS anamenu_alt_id INTEGER NOT NULL DEFAULT 1;

-- ================================================
-- 5. Yeni Foreign Key'leri ekle
-- ================================================
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

-- ================================================
-- 6. Index'leri güncelle
-- ================================================
DROP INDEX IF EXISTS idx_anamenu_alt_menu_id;
CREATE INDEX IF NOT EXISTS idx_anamenu_alt_anamenu_id ON anamenu_alt(anamenu_id);

DROP INDEX IF EXISTS idx_menu_anamenu_id;
CREATE INDEX IF NOT EXISTS idx_menu_anamenu_alt_id ON menu(anamenu_alt_id);

-- ================================================
-- 7. Örnek Veriler Ekle
-- ================================================

-- Anamenu (Kategoriler) - ID'ler 1'den başlayacak
INSERT INTO anamenu (anamenu, ikon, sira, yetki_ids) VALUES
('Dashboard', 'dashboard', 1, '1,2,3'),
('Yönetim', 'settings', 2, '1,2'),
('Raporlar', 'chart', 3, '1,2,3');

-- Anamenu Alt (Ana Menü Öğeleri)
INSERT INTO anamenu_alt (baslik, anamenu_id, rota, ikon, sira, yetki_ids, durum) VALUES
-- Dashboard altında (anamenu_id=1)
('Ana Sayfa', 1, '/dashboard', 'home', 1, '1,2,3', 1),
('Analizler', 1, '/dashboard/analizler', 'analytics', 2, '1,2', 1),

-- Yönetim altında (anamenu_id=2)
('Kullanıcılar', 2, '/yonetim/kullanicilar', 'users', 1, '1,2', 1),
('Yetkiler', 2, '/yonetim/yetkiler', 'shield', 2, '1', 1),
('Menü Yönetimi', 2, '/yonetim/menuler', 'menu', 3, '1', 1),

-- Raporlar altında (anamenu_id=3)
('Satış Raporları', 3, '/raporlar/satis', 'trending-up', 1, '1,2,3', 1),
('Kullanıcı Raporları', 3, '/raporlar/kullanicilar', 'users', 2, '1,2', 1);

-- Menu (Alt Menüler)
INSERT INTO menu (menu, anamenu_alt_id, rota, ikon, sira, yetki_ids) VALUES
-- Kullanıcılar (anamenu_alt_id=3) altında
('Kullanıcı Listesi', 3, '/yonetim/kullanicilar/liste', 'list', 1, '1,2'),
('Yeni Kullanıcı', 3, '/yonetim/kullanicilar/yeni', 'plus', 2, '1,2'),
('Kullanıcı Raporları', 3, '/yonetim/kullanicilar/raporlar', 'chart', 3, '1'),

-- Satış Raporları (anamenu_alt_id=6) altında
('Günlük Satışlar', 6, '/raporlar/satis/gunluk', 'calendar', 1, '1,2,3'),
('Aylık Satışlar', 6, '/raporlar/satis/aylik', 'calendar', 2, '1,2,3'),
('Yıllık Satışlar', 6, '/raporlar/satis/yillik', 'calendar', 3, '1,2');

-- ================================================
-- 8. Sonuç Kontrolleri
-- ================================================
SELECT '==================== SONUÇLAR ====================' as bilgi;

SELECT 'ANAMENU Tablosu:' as tablo, COUNT(*) as kayit_sayisi FROM anamenu
UNION ALL
SELECT 'ANAMENU_ALT Tablosu:', COUNT(*) FROM anamenu_alt
UNION ALL
SELECT 'MENU Tablosu:', COUNT(*) FROM menu;

-- Hiyerarşiyi göster
SELECT 
    a.id as anamenu_id,
    a.anamenu as kategori,
    aa.id as anamenu_alt_id,
    aa.baslik as ana_menu,
    m.id as menu_id,
    m.menu as alt_menu
FROM anamenu a
LEFT JOIN anamenu_alt aa ON aa.anamenu_id = a.id
LEFT JOIN menu m ON m.anamenu_alt_id = aa.id
ORDER BY a.sira, aa.sira, m.sira;

SELECT '==================== TAMAMLANDI ====================' as bilgi;

