-- PAYLAŞIM ŞABLONLARI MENÜ EKLEME

INSERT INTO menu (anamenu_alt_id, menu, rota, sira)
SELECT 
    (SELECT id FROM anamenu_alt WHERE rota = '/hizmetler/otel' LIMIT 1),
    'Paylaşım Şablonları',
    '/otel/paylasim-sablonlari',
    110
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE rota = '/otel/paylasim-sablonlari');



