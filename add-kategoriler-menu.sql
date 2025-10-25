-- Kategoriler alt menü öğesini ekle (Otel ana menüsü altına)

-- Önce Otel ana menü ID'sini bulalım (genelde anamenu = 'Otel' olan)
DO $$
DECLARE
  otel_anamenu_id INTEGER;
  kategoriler_alt_menu_id INTEGER;
BEGIN
  -- Otel ana menü ID'sini bul
  SELECT id INTO otel_anamenu_id FROM anamenu WHERE anamenu = 'Otel' LIMIT 1;
  
  IF otel_anamenu_id IS NULL THEN
    RAISE EXCEPTION 'Otel ana menüsü bulunamadı! Önce Otel ana menüsünü oluşturun.';
  END IF;

  -- Kategoriler alt menü öğesini ekle
  INSERT INTO anamenu_alt (
    anamenu_id, 
    baslik, 
    url, 
    ikon, 
    sira, 
    yetki_ids, 
    durum
  ) VALUES (
    otel_anamenu_id,
    'Kategoriler',
    '/otel/kategoriler',
    'FolderOpenIcon',
    5, -- Sıra numarası (diğer otel menü öğelerinden sonra)
    NULL, -- Yetki ID'leri (opsiyonel)
    1 -- Aktif
  )
  ON CONFLICT (anamenu_id, url) DO UPDATE
    SET baslik = EXCLUDED.baslik,
        ikon = EXCLUDED.ikon,
        sira = EXCLUDED.sira,
        durum = EXCLUDED.durum;

  RAISE NOTICE 'Kategoriler menüsü başarıyla eklendi!';
END $$;

-- Kontrol için kategoriler menüsünü göster
SELECT 
  am.anamenu as "Ana Menü",
  aa.baslik as "Alt Menü",
  aa.url as "URL",
  aa.sira as "Sıra",
  aa.durum as "Durum"
FROM anamenu_alt aa
JOIN anamenu am ON aa.anamenu_id = am.id
WHERE am.anamenu = 'Otel'
ORDER BY aa.sira;

