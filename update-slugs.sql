-- Mevcut ürünlere slug değerleri ata
UPDATE urunler SET slug = 'deluxe-deniz-manzarali-oda' WHERE id = 6;
UPDATE urunler SET slug = 'standart-suit-oda' WHERE id = 7;
UPDATE urunler SET slug = 'bmw-320i-otomatik' WHERE id = 8;
UPDATE urunler SET slug = 'volkswagen-passat-dizel' WHERE id = 9;
UPDATE urunler SET slug = 'deniz-manzarali-31-daire' WHERE id = 10;
UPDATE urunler SET slug = 'merkezi-konumda-21-ofis' WHERE id = 11;
UPDATE urunler SET slug = 'kapadokya-balon-turu' WHERE id = 12;
UPDATE urunler SET slug = 'bogaz-tekne-turu' WHERE id = 13;
UPDATE urunler SET slug = 'istanbul-antalya-ekonomi' WHERE id = 14;
UPDATE urunler SET slug = 'izmir-istanbul-business' WHERE id = 15;

-- Slug'ları kontrol et
SELECT id, baslik, slug, hizmet_id FROM urunler ORDER BY hizmet_id, id;

