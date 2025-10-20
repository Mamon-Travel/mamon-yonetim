-- Otel Yönetimi Ana Menü Ekle
INSERT INTO anamenu (anamenu, ikon, sira, yetki_ids, durum) 
VALUES ('Otel Yönetimi', 'PiBuildings', 4, '1,2', 1);

-- Otel Yönetimi Alt Menüleri (anamenu_id'yi dinamik olarak al)
INSERT INTO anamenu_alt (baslik, anamenu_id, rota, ikon, sira, yetki_ids, durum) 
SELECT 'Otel Listesi', id, '/otel/otel-listesi', 'PiListBold', 1, '1,2', 1 FROM anamenu WHERE anamenu = 'Otel Yönetimi'
UNION ALL
SELECT 'Yeni Otel Ekle', id, '/otel/yeni-otel', 'PiPlusBold', 2, '1,2', 1 FROM anamenu WHERE anamenu = 'Otel Yönetimi'
UNION ALL
SELECT 'Otel Özellikleri', id, '/otel/otel-ozellikler', 'PiStarBold', 3, '1,2', 1 FROM anamenu WHERE anamenu = 'Otel Yönetimi'
UNION ALL
SELECT 'Oda Özellikleri', id, '/otel/oda-ozellikler', 'PiHouseLineBold', 4, '1,2', 1 FROM anamenu WHERE anamenu = 'Otel Yönetimi';

-- Sonuçları göster
SELECT 
    am.id as anamenu_id,
    am.anamenu,
    aa.id as alt_menu_id,
    aa.baslik,
    aa.rota,
    aa.ikon,
    aa.sira
FROM anamenu am
LEFT JOIN anamenu_alt aa ON am.id = aa.anamenu_id
WHERE am.anamenu = 'Otel Yönetimi'
ORDER BY aa.sira;

