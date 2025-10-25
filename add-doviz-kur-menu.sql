-- DÖVİZ KUR YÖNETİMİ MENÜ EKLEME
-- Ayarlar menüsü altına eklenir

INSERT INTO menu (
    anamenu_alt_id,
    menu,
    rota,
    sira
)
SELECT 
    (SELECT id FROM anamenu_alt WHERE baslik = 'Ayarlar' LIMIT 1),
    'Döviz Kurları',
    '/ayarlar/doviz-kurlar',
    20
WHERE NOT EXISTS (
    SELECT 1 FROM menu WHERE rota = '/ayarlar/doviz-kurlar'
);

-- Kontrol
SELECT 
    am.anamenu as "Ana Menü",
    ama.baslik as "Alt Menü",
    m.menu as "Menü",
    m.rota as "URL",
    m.sira as "Sıra"
FROM menu m
JOIN anamenu_alt ama ON m.anamenu_alt_id = ama.id
JOIN anamenu am ON ama.anamenu_id = am.id
WHERE ama.baslik = 'Ayarlar'
ORDER BY m.sira ASC;

