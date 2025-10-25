-- Nasıl Çalışır alt menü öğesini ekle (Otel ana menüsü altına)

DO $$
DECLARE
  otel_anamenu_id INTEGER;
BEGIN
  -- Otel ana menü ID'sini bul
  SELECT id INTO otel_anamenu_id FROM anamenu WHERE anamenu = 'Otel' LIMIT 1;
  
  IF otel_anamenu_id IS NULL THEN
    RAISE EXCEPTION 'Otel ana menüsü bulunamadı!';
  END IF;

  -- Nasıl Çalışır alt menü öğesini ekle
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
    'Nasıl Çalışır',
    '/otel/nasil-calisir',
    'ClipboardCheckIcon',
    7,
    NULL,
    1
  )
  ON CONFLICT (anamenu_id, url) DO UPDATE
    SET baslik = EXCLUDED.baslik,
        ikon = EXCLUDED.ikon,
        sira = EXCLUDED.sira,
        durum = EXCLUDED.durum;

  RAISE NOTICE 'Nasıl Çalışır menüsü başarıyla eklendi!';
END $$;

