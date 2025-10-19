-- ÜRÜNLER SEEDER - 10 Örnek Ürün
-- Her hizmet tipinden 2'şer ürün

-- 1-2: KONAKLAMA (Otel Odaları)
INSERT INTO urunler (hizmet_id, baslik, aciklama, ana_resim, resimler, fiyat, fiyat_birimi, fiyat_tipi, stok_durumu, ozellikler, durum) VALUES
(1, 'Deluxe Deniz Manzaralı Oda', 'Muhteşem deniz manzaralı geniş ve konforlu oda. Balkon, minibar ve ücretsiz WiFi dahil.', 
'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=800', 
'["https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg", "https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg"]'::jsonb,
1850.00, 'TRY', 'gece', 'mevcut', 
'{"konum": "İstanbul Beşiktaş", "kapasite": "2 kişi", "yatak": "King size", "metrekare": "35m²", "manzara": "Deniz"}'::jsonb, 
1),

(1, 'Standart Suit Oda', 'Şehir merkezinde rahat bir konaklama için ideal. Klima, TV ve oda servisi mevcuttur.', 
'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800', 
'["https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg", "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg"]'::jsonb,
950.00, 'TRY', 'gece', 'mevcut', 
'{"konum": "Ankara Çankaya", "kapasite": "2 kişi", "yatak": "Çift kişilik", "metrekare": "25m²", "manzara": "Şehir"}'::jsonb, 
1),

-- 3-4: ARAÇ KİRALAMA
(2, 'BMW 320i - Otomatik', 'Konforlu ve güçlü sedan. Tam sigorta ve sınırsız kilometre dahil.', 
'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=800', 
'["https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg", "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg"]'::jsonb,
850.00, 'TRY', 'gunluk', 'mevcut', 
'{"marka": "BMW", "model": "320i", "yil": "2023", "yakit": "Dizel", "vites": "Otomatik", "koltuk": "5", "bagaj": "480L"}'::jsonb, 
1),

(2, 'Volkswagen Passat - Dizel', 'Aileniz için geniş ve ekonomik araç. GPS navigasyon dahil.', 
'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800', 
'["https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg", "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg"]'::jsonb,
650.00, 'TRY', 'gunluk', 'mevcut', 
'{"marka": "Volkswagen", "model": "Passat", "yil": "2022", "yakit": "Dizel", "vites": "Otomatik", "koltuk": "5", "bagaj": "586L"}'::jsonb, 
1),

-- 5-6: EMLAK
(3, 'Deniz Manzaralı 3+1 Daire', 'Modern mobilyalı, tam eşyalı lüks daire. Yüzme havuzu ve otopark dahil.', 
'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 
'["https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg", "https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg"]'::jsonb,
25000.00, 'TRY', 'gunluk', 'mevcut', 
'{"konum": "İzmir Karşıyaka", "oda_sayisi": "3+1", "metrekare": "150m²", "kat": "8", "esyali": "Evet", "isitma": "Kombi", "site_icerisinde": "Evet"}'::jsonb, 
1),

(3, 'Merkezi Konumda 2+1 Ofis', 'İş merkezi yakını, asansörlü binada modern ofis. Fiber internet altyapısı mevcut.', 
'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=800', 
'["https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg", "https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg"]'::jsonb,
18000.00, 'TRY', 'gunluk', 'mevcut', 
'{"konum": "İstanbul Şişli", "oda_sayisi": "2+1", "metrekare": "95m²", "kat": "5", "esyali": "Hayır", "otopark": "Evet", "guvenlik": "24 saat"}'::jsonb, 
1),

-- 7-8: DENEYİMLER (Turlar/Aktiviteler)
(4, 'Kapadokya Balon Turu', 'Muhteşem Kapadokya manzarasında unutulmaz sıcak hava balonu deneyimi. Kahvaltı dahil.', 
'https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg?auto=compress&cs=tinysrgb&w=800', 
'["https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg", "https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg"]'::jsonb,
2500.00, 'TRY', 'kisi', 'mevcut', 
'{"konum": "Kapadokya", "sure": "1 saat", "kapasite": "16 kişi", "dil": "Türkçe, İngilizce", "dahil": "Kahvaltı, Ulaşım, Sigorta"}'::jsonb, 
1),

(4, 'Boğaz Tekne Turu', 'İstanbul Boğazı''nda 2 saatlik özel tekne turu. Içecek ve atıştırmalıklar dahil.', 
'https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg?auto=compress&cs=tinysrgb&w=800', 
'["https://images.pexels.com/photos/1374295/pexels-photo-1374295.jpeg", "https://images.pexels.com/photos/2166927/pexels-photo-2166927.jpeg"]'::jsonb,
1200.00, 'TRY', 'kisi', 'mevcut', 
'{"konum": "İstanbul Boğazı", "sure": "2 saat", "kapasite": "20 kişi", "dil": "Türkçe", "dahil": "İçecek, Atıştırmalık, Rehber"}'::jsonb, 
1),

-- 9-10: UÇUŞLAR
(5, 'İstanbul - Antalya Ekonomi', 'Tek yön ekonomi sınıfı bilet. 15kg bagaj hakkı dahil.', 
'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=800', 
'["https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg", "https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg"]'::jsonb,
750.00, 'TRY', 'kisi', 'mevcut', 
'{"kalkis": "İstanbul (IST)", "varis": "Antalya (AYT)", "sure": "1s 15dk", "sinif": "Ekonomi", "bagaj": "15kg", "ogun": "İkram", "airline": "Turkish Airlines"}'::jsonb, 
1),

(5, 'İzmir - İstanbul Business', 'Tek yön business sınıfı bilet. 30kg bagaj, lounge kullanımı ve yemek dahil.', 
'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800', 
'["https://images.pexels.com/photos/2026328/pexels-photo-2026328.jpeg", "https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg"]'::jsonb,
1850.00, 'TRY', 'kisi', 'mevcut', 
'{"kalkis": "İzmir (ADB)", "varis": "İstanbul (IST)", "sure": "1s 5dk", "sinif": "Business", "bagaj": "30kg", "ogun": "Full Meal", "airline": "Pegasus Airlines", "lounge": "Evet"}'::jsonb, 
1);

SELECT 'Başarıyla ' || COUNT(*) || ' ürün eklendi!' as sonuc FROM urunler;

