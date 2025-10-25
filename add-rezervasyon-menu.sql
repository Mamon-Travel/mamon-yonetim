-- REZERVASYON SİSTEMİ MENÜ EKLEMELERI
-- Otel alt menüsünün altına menu öğeleri eklenir

-- 1. Fiyat Takvimi
INSERT INTO menu (
    anamenu_alt_id,
    menu,
    rota,
    sira
)
SELECT 
    (SELECT id FROM anamenu_alt WHERE rota = '/hizmetler/otel' LIMIT 1),
    'Fiyat Takvimi',
    '/otel/fiyat-takvimi',
    80
WHERE NOT EXISTS (
    SELECT 1 FROM menu WHERE rota = '/otel/fiyat-takvimi'
);

-- 2. Stok Takvimi
INSERT INTO menu (
    anamenu_alt_id,
    menu,
    rota,
    sira
)
SELECT 
    (SELECT id FROM anamenu_alt WHERE rota = '/hizmetler/otel' LIMIT 1),
    'Stok Takvimi',
    '/otel/stok-takvimi',
    90
WHERE NOT EXISTS (
    SELECT 1 FROM menu WHERE rota = '/otel/stok-takvimi'
);

-- 3. İptal Politikaları
INSERT INTO menu (
    anamenu_alt_id,
    menu,
    rota,
    sira
)
SELECT 
    (SELECT id FROM anamenu_alt WHERE rota = '/hizmetler/otel' LIMIT 1),
    'İptal Politikaları',
    '/otel/iptal-politikalari',
    100
WHERE NOT EXISTS (
    SELECT 1 FROM menu WHERE rota = '/otel/iptal-politikalari'
);

-- Mevcut menülerin sırasını kontrol et
SELECT 
    am.anamenu as "Ana Menü",
    ama.baslik as "Alt Menü",
    m.menu as "Menü",
    m.rota as "URL",
    m.sira as "Sıra"
FROM menu m
JOIN anamenu_alt ama ON m.anamenu_alt_id = ama.id
JOIN anamenu am ON ama.anamenu_id = am.id
WHERE ama.rota = '/hizmetler/otel'
ORDER BY m.sira ASC;

