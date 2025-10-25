-- Önce hizmetleri ekleyelim (eğer yoksa)

INSERT INTO hizmetler (id, ad, slug, aciklama, ikon, sira, aktif, url) VALUES
  (1, 'Konaklama', 'stays', 'Otel ve konaklama seçenekleri', 'House03Icon', 1, true, '/'),
  (2, 'Araç Kiralama', 'cars', 'Araç kiralama hizmetleri', 'Car05Icon', 2, true, '/car'),
  (3, 'Deneyimler', 'experiences', 'Unutulmaz deneyimler', 'HotAirBalloonFreeIcons', 3, true, '/experience'),
  (4, 'Emlak', 'real-estates', 'Gayrimenkul alım satım', 'RealEstate02Icon', 4, true, '/real-estate'),
  (5, 'Uçuşlar', 'flights', 'Uçuş rezervasyonları', 'Airplane02Icon', 5, true, '/flight-categories/all')
ON CONFLICT (id) DO UPDATE 
  SET ad = EXCLUDED.ad,
      slug = EXCLUDED.slug,
      aciklama = EXCLUDED.aciklama,
      ikon = EXCLUDED.ikon,
      sira = EXCLUDED.sira,
      aktif = EXCLUDED.aktif,
      url = EXCLUDED.url;

-- Sequence'i güncelle
SELECT setval('hizmetler_id_seq', (SELECT MAX(id) FROM hizmetler));

-- Şimdi kategorileri ekleyelim

-- Konaklama kategorileri (hizmet_id = 1)
INSERT INTO kategoriler (hizmet_id, ad, slug, bolge, adet, aciklama, thumbnail, sira, durum) VALUES
(1, 'New York, USA', 'new-york-usa', 'United States', 5000, 'Explore the Big Apple', 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg', 1, 1),
(1, 'Singapore', 'singapore', 'Singapore', 2500, 'Garden city of Asia', 'https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg', 2, 1),
(1, 'Paris, France', 'paris-france', 'France', 3000, 'City of lights', 'https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg', 3, 1),
(1, 'London, UK', 'london-uk', 'United Kingdom', 116288, 'Historic and modern blend', 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg', 4, 1),
(1, 'Tokyo, Japan', 'tokyo-japan', 'Japan', 5000, 'Where tradition meets future', 'https://images.pexels.com/photos/4151484/pexels-photo-4151484.jpeg', 5, 1),
(1, 'Maldives', 'maldives', 'Indian Ocean', 7500, 'The Maldives, officially the Republic of Maldives', 'https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg', 6, 1),
(1, 'Roma, Italy', 'roma-italy', 'Italy', 8100, 'Italy, a European country with a long Mediterranean', 'https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg', 7, 1),
(1, 'Enjoy the great cold', 'enjoy-the-great-cold', 'Arctic', 15600, 'The Arctic is the northernmost region of Earth', 'https://images.pexels.com/photos/5764100/pexels-photo-5764100.jpeg', 8, 1),
(1, 'Sleep in a floating way', 'sleep-in-a-floating-way', 'Worldwide', 1000, 'A floating hotel is a type of hotel', 'https://images.pexels.com/photos/2869499/pexels-photo-2869499.jpeg', 9, 1),
(1, 'In the billionaire''s house', 'in-the-billionaires-house', 'Worldwide', 3000, 'A billionaire''s house', 'https://images.pexels.com/photos/7031413/pexels-photo-7031413.jpeg', 10, 1),
(1, 'Cool in the deep forest', 'cool-in-the-deep-forest', 'Worldwide', 6000, 'Cool in the deep forest', 'https://images.pexels.com/photos/247532/pexels-photo-247532.jpeg', 11, 1),
(1, 'Sunset in the desert', 'sunset-in-the-desert', 'Worldwide', 1000, 'Sunset in the desert', 'https://images.pexels.com/photos/32223288/pexels-photo-32223288/free-photo-of-ngoi-nha-da-d-a-trung-h-i-quy-n-ru-v-i-di-m-nh-n-mau-vang.jpeg', 12, 1)
ON CONFLICT (hizmet_id, slug) DO UPDATE
  SET ad = EXCLUDED.ad,
      bolge = EXCLUDED.bolge,
      adet = EXCLUDED.adet,
      aciklama = EXCLUDED.aciklama,
      thumbnail = EXCLUDED.thumbnail,
      sira = EXCLUDED.sira,
      durum = EXCLUDED.durum;

-- Deneyim kategorileri (hizmet_id = 3)
INSERT INTO kategoriler (hizmet_id, ad, slug, bolge, adet, aciklama, thumbnail, sira, durum) VALUES
(3, 'Tokyo, Japan', 'tokyo', 'Japan', 500, 'Discover Tokyo experiences', 'https://images.pexels.com/photos/547116/pexels-photo-547116.jpeg', 1, 1),
(3, 'Denmark', 'denmark', 'Europe', 750, 'Experience Denmark', 'https://images.pexels.com/photos/7243314/pexels-photo-7243314.jpeg', 2, 1),
(3, 'Baceno, Italy', 'baceno-italy', 'Italy', 8100, 'Baceno, a small town in the Piedmont region of Italy', 'https://images.pexels.com/photos/12256847/pexels-photo-12256847.jpeg', 3, 1),
(3, 'New York, USA', 'new-york', 'United States', 1000, 'NYC experiences', 'https://images.pexels.com/photos/4587344/pexels-photo-4587344.jpeg', 4, 1),
(3, 'Singapore', 'south-east-asia', 'South East Asia', 2500, 'Southeast Asian experiences', 'https://images.pexels.com/photos/24702952/pexels-photo-24702952/free-photo-of-nui-dan-ba-ng-i-du-l-ch.jpeg', 5, 1),
(3, 'Paris, France', 'paris', 'France', 2000, 'Parisian experiences', 'https://images.pexels.com/photos/12256878/pexels-photo-12256878.jpeg', 6, 1),
(3, 'London, UK', 'london', 'United Kingdom', 1500, 'London experiences', 'https://images.pexels.com/photos/5036873/pexels-photo-5036873.jpeg', 7, 1),
(3, 'Roma, Italy', 'roma-italy', 'Italy', 8100, 'Italy, a European country with a long Mediterranean', 'https://images.pexels.com/photos/12256858/pexels-photo-12256858.jpeg', 8, 1)
ON CONFLICT (hizmet_id, slug) DO UPDATE
  SET ad = EXCLUDED.ad,
      bolge = EXCLUDED.bolge,
      adet = EXCLUDED.adet,
      aciklama = EXCLUDED.aciklama,
      thumbnail = EXCLUDED.thumbnail,
      sira = EXCLUDED.sira,
      durum = EXCLUDED.durum;

-- Emlak kategorileri (hizmet_id = 4)
INSERT INTO kategoriler (hizmet_id, ad, slug, bolge, adet, aciklama, thumbnail, sira, durum) VALUES
(4, 'New York, USA', 'new-york', 'United States', 144000, 'NYC real estate', 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg', 1, 1),
(4, 'Singapore', 'singapore', 'Singapore', 188288, 'Singapore properties', 'https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg', 2, 1),
(4, 'Paris, France', 'paris', 'France', 218288, 'Parisian properties', 'https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg', 3, 1),
(4, 'London, UK', 'london', 'United Kingdom', 116288, 'London properties', 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg', 4, 1),
(4, 'Tokyo, Japan', 'tokyo', 'Japan', 232288, 'Tokyo properties', 'https://images.pexels.com/photos/4151484/pexels-photo-4151484.jpeg', 5, 1),
(4, 'Maldives', 'maldives', 'Indian Ocean', 77566, 'Maldives properties', 'https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg', 6, 1)
ON CONFLICT (hizmet_id, slug) DO UPDATE
  SET ad = EXCLUDED.ad,
      bolge = EXCLUDED.bolge,
      adet = EXCLUDED.adet,
      aciklama = EXCLUDED.aciklama,
      thumbnail = EXCLUDED.thumbnail,
      sira = EXCLUDED.sira,
      durum = EXCLUDED.durum;

-- Araç kategorileri (hizmet_id = 2)
INSERT INTO kategoriler (hizmet_id, ad, slug, bolge, adet, aciklama, thumbnail, sira, durum) VALUES
(2, 'London, UK', 'london', 'United Kingdom', 1000, 'Rent a car in London', 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg', 1, 1),
(2, 'Tokyo, Japan', 'tokyo', 'Japan', 5000, 'Rent a car in Tokyo', 'https://images.pexels.com/photos/4151484/pexels-photo-4151484.jpeg', 2, 1),
(2, 'Maldives', 'maldives', 'Indian Ocean', 750, 'Rent a car in Maldives', 'https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg', 3, 1),
(2, 'New York, USA', 'new-york', 'United States', 1500, 'Rent a car in NYC', 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg', 4, 1),
(2, 'Singapore', 'singapore', 'Singapore', 2500, 'Rent a car in Singapore', 'https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg', 5, 1),
(2, 'Paris, France', 'paris', 'France', 3000, 'Rent a car in Paris', 'https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg', 6, 1)
ON CONFLICT (hizmet_id, slug) DO UPDATE
  SET ad = EXCLUDED.ad,
      bolge = EXCLUDED.bolge,
      adet = EXCLUDED.adet,
      aciklama = EXCLUDED.aciklama,
      thumbnail = EXCLUDED.thumbnail,
      sira = EXCLUDED.sira,
      durum = EXCLUDED.durum;

-- Uçuş kategorileri (hizmet_id = 5)
INSERT INTO kategoriler (hizmet_id, ad, slug, bolge, adet, aciklama, thumbnail, sira, durum) VALUES
(5, 'New York', 'new-york', 'United States', 1500, 'Flights to New York', 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg', 1, 1),
(5, 'Singapore', 'singapore', 'Singapore', 2500, 'Flights to Singapore', 'https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg', 2, 1)
ON CONFLICT (hizmet_id, slug) DO UPDATE
  SET ad = EXCLUDED.ad,
      bolge = EXCLUDED.bolge,
      adet = EXCLUDED.adet,
      aciklama = EXCLUDED.aciklama,
      thumbnail = EXCLUDED.thumbnail,
      sira = EXCLUDED.sira,
      durum = EXCLUDED.durum;

