-- Otel Yönetimi Alt Menülerini Ekle
-- NOT: Aşağıdaki anamenu_id değerini kendi anamenu id'niz ile değiştirin!

-- Önce mevcut anamenu'leri görelim
SELECT id, anamenu, ikon FROM anamenu ORDER BY sira;

-- Otel alt menülerini ekle (anamenu_id'yi yukarıdaki sonuca göre değiştir)
INSERT INTO anamenu_alt (baslik, anamenu_id, rota, ikon, sira, yetki_ids, durum) VALUES
('Otel Listesi', 1, '/otel/otel-listesi', 'PiListBold', 1, '1,2', 1),
('Yeni Otel Ekle', 1, '/otel/yeni-otel', 'PiPlusBold', 2, '1,2', 1),
('Otel Özellikleri', 1, '/otel/otel-ozellikler', 'PiStarBold', 3, '1,2', 1),
('Oda Özellikleri', 1, '/otel/oda-ozellikler', 'PiHouseLineBold', 4, '1,2', 1);

-- Eklenen kayıtları kontrol et
SELECT aa.id, aa.baslik, aa.rota, aa.ikon, aa.sira, am.anamenu 
FROM anamenu_alt aa 
JOIN anamenu am ON aa.anamenu_id = am.id 
WHERE aa.rota LIKE '/otel%' 
ORDER BY aa.sira;

