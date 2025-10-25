-- Ana sayfa, ortak ve HeroSearch çevirileri

-- Türkçe çeviriler - HeroSearch (dil_id = 1)
INSERT INTO ceviriler (dil_id, anahtar, deger, kategori, aciklama, durum)
VALUES
  (1, 'where', 'Nerede', 'herosearch', 'Konum başlığı', 1),
  (1, 'location', 'Konum', 'herosearch', 'Konum placeholder', 1),
  (1, 'when', 'Ne zaman', 'herosearch', 'Tarih başlığı', 1),
  (1, 'add_dates', 'Tarih ekle', 'herosearch', 'Tarih ekle placeholder', 1),
  (1, 'who', 'Kimler', 'herosearch', 'Misafir başlığı', 1),
  (1, 'guests', 'Misafirler', 'herosearch', 'Misafirler metni', 1),
  (1, 'add_guests', 'Misafir ekle', 'herosearch', 'Misafir ekle placeholder', 1),
  (1, 'buy', 'Satın Al', 'herosearch', 'Emlak - Satın al', 1),
  (1, 'rent', 'Kirala', 'herosearch', 'Emlak - Kirala', 1),
  (1, 'sell', 'Sat', 'herosearch', 'Emlak - Sat', 1),
  (1, 'where_to_find', 'Nerede bulmak istersiniz?', 'herosearch', 'Emlak konum sorusu', 1),
  (1, 'property', 'Mülk', 'herosearch', 'Mülk başlığı', 1),
  (1, 'add_property', 'Mülk ekle', 'herosearch', 'Mülk ekle placeholder', 1),
  (1, 'price', 'Fiyat', 'herosearch', 'Fiyat başlığı', 1),
  (1, 'pickup', 'Kalkış', 'herosearch', 'Uçuş - Kalkış', 1),
  (1, 'dropoff', 'Varış', 'herosearch', 'Uçuş - Varış', 1),
  (1, 'flight_type', 'Uçuş tipi?', 'herosearch', 'Uçuş tipi başlığı', 1),
  (1, 'round_trip', 'Gidiş-Dönüş', 'herosearch', 'Gidiş-Dönüş seçeneği', 1),
  (1, 'one_way', 'Tek Yön', 'herosearch', 'Tek Yön seçeneği', 1),
  (1, 'ticket_class', 'Bilet Sınıfı', 'herosearch', 'Bilet sınıfı başlığı', 1),
  (1, 'economy', 'Ekonomi', 'herosearch', 'Ekonomi sınıfı', 1),
  (1, 'business', 'Business', 'herosearch', 'Business sınıfı', 1),
  (1, 'multiple', 'Çoklu', 'herosearch', 'Çoklu seçeneği', 1),
  (1, 'where_going', 'Nereye gidiyorsunuz?', 'herosearch', 'Konum sorusu', 1),
  (1, 'suggested_locations', 'Önerilen konumlar', 'herosearch', 'Önerilen konumlar başlığı', 1),
  (1, 'adults', 'Yetişkinler', 'herosearch', 'Yetişkinler', 1),
  (1, 'ages_13_above', '13 yaş ve üzeri', 'herosearch', 'Yaş açıklaması - Yetişkin', 1),
  (1, 'children', 'Çocuklar', 'herosearch', 'Çocuklar', 1),
  (1, 'ages_2_12', '2-12 yaş', 'herosearch', 'Yaş açıklaması - Çocuk', 1),
  (1, 'infants', 'Bebekler', 'herosearch', 'Bebekler', 1),
  (1, 'ages_0_2', '0-2 yaş', 'herosearch', 'Yaş açıklaması - Bebek', 1)
ON CONFLICT (dil_id, anahtar) DO UPDATE
  SET deger = EXCLUDED.deger,
      kategori = EXCLUDED.kategori,
      aciklama = EXCLUDED.aciklama,
      durum = EXCLUDED.durum;

-- Türkçe çeviriler - Tabs (dil_id = 1)
INSERT INTO ceviriler (dil_id, anahtar, deger, kategori, aciklama, durum)
VALUES
  (1, 'stays', 'Konaklama', 'tabs', 'Tab - Konaklama', 1),
  (1, 'cars', 'Araçlar', 'tabs', 'Tab - Araçlar', 1),
  (1, 'experiences', 'Deneyimler', 'tabs', 'Tab - Deneyimler', 1),
  (1, 'real_estates', 'Emlak', 'tabs', 'Tab - Emlak', 1),
  (1, 'flights', 'Uçuşlar', 'tabs', 'Tab - Uçuşlar', 1)
ON CONFLICT (dil_id, anahtar) DO UPDATE
  SET deger = EXCLUDED.deger,
      kategori = EXCLUDED.kategori,
      aciklama = EXCLUDED.aciklama,
      durum = EXCLUDED.durum;

-- İngilizce çeviriler - HeroSearch (dil_id = 2)
INSERT INTO ceviriler (dil_id, anahtar, deger, kategori, aciklama, durum)
VALUES
  (2, 'where', 'Where', 'herosearch', 'Location heading', 1),
  (2, 'location', 'Location', 'herosearch', 'Location placeholder', 1),
  (2, 'when', 'When', 'herosearch', 'Date heading', 1),
  (2, 'add_dates', 'Add dates', 'herosearch', 'Add dates placeholder', 1),
  (2, 'who', 'Who', 'herosearch', 'Guests heading', 1),
  (2, 'guests', 'Guests', 'herosearch', 'Guests text', 1),
  (2, 'add_guests', 'Add guests', 'herosearch', 'Add guests placeholder', 1),
  (2, 'buy', 'Buy', 'herosearch', 'Real Estate - Buy', 1),
  (2, 'rent', 'Rent', 'herosearch', 'Real Estate - Rent', 1),
  (2, 'sell', 'Sell', 'herosearch', 'Real Estate - Sell', 1),
  (2, 'where_to_find', 'Where to find?', 'herosearch', 'Real estate location question', 1),
  (2, 'property', 'Property', 'herosearch', 'Property heading', 1),
  (2, 'add_property', 'Add property', 'herosearch', 'Add property placeholder', 1),
  (2, 'price', 'Price', 'herosearch', 'Price heading', 1),
  (2, 'pickup', 'Pick up', 'herosearch', 'Flight - Pick up', 1),
  (2, 'dropoff', 'Drop off', 'herosearch', 'Flight - Drop off', 1),
  (2, 'flight_type', 'Flight type?', 'herosearch', 'Flight type heading', 1),
  (2, 'round_trip', 'Round-trip', 'herosearch', 'Round-trip option', 1),
  (2, 'one_way', 'One-way', 'herosearch', 'One-way option', 1),
  (2, 'ticket_class', 'Ticket Class', 'herosearch', 'Ticket class heading', 1),
  (2, 'economy', 'Economy', 'herosearch', 'Economy class', 1),
  (2, 'business', 'Business', 'herosearch', 'Business class', 1),
  (2, 'multiple', 'Multiple', 'herosearch', 'Multiple option', 1),
  (2, 'where_going', 'Where are you going?', 'herosearch', 'Location question', 1),
  (2, 'suggested_locations', 'Suggested locations', 'herosearch', 'Suggested locations heading', 1),
  (2, 'adults', 'Adults', 'herosearch', 'Adults', 1),
  (2, 'ages_13_above', 'Ages 13 or above', 'herosearch', 'Age description - Adult', 1),
  (2, 'children', 'Children', 'herosearch', 'Children', 1),
  (2, 'ages_2_12', 'Ages 2–12', 'herosearch', 'Age description - Child', 1),
  (2, 'infants', 'Infants', 'herosearch', 'Infants', 1),
  (2, 'ages_0_2', 'Ages 0–2', 'herosearch', 'Age description - Infant', 1)
ON CONFLICT (dil_id, anahtar) DO UPDATE
  SET deger = EXCLUDED.deger,
      kategori = EXCLUDED.kategori,
      aciklama = EXCLUDED.aciklama,
      durum = EXCLUDED.durum;

-- İngilizce çeviriler - Tabs (dil_id = 2)
INSERT INTO ceviriler (dil_id, anahtar, deger, kategori, aciklama, durum)
VALUES
  (2, 'stays', 'Stays', 'tabs', 'Tab - Stays', 1),
  (2, 'cars', 'Cars', 'tabs', 'Tab - Cars', 1),
  (2, 'experiences', 'Experiences', 'tabs', 'Tab - Experiences', 1),
  (2, 'real_estates', 'Real Estates', 'tabs', 'Tab - Real Estates', 1),
  (2, 'flights', 'Flights', 'tabs', 'Tab - Flights', 1)
ON CONFLICT (dil_id, anahtar) DO UPDATE
  SET deger = EXCLUDED.deger,
      kategori = EXCLUDED.kategori,
      aciklama = EXCLUDED.aciklama,
      durum = EXCLUDED.durum;

-- Türkçe çeviriler - Ortak metinler (dil_id = 1)
INSERT INTO ceviriler (dil_id, anahtar, deger, kategori, aciklama, durum)
VALUES
  (1, 'loading', 'Yükleniyor...', 'common', 'Yükleniyor metni', 1),
  (1, 'no_image', 'Resim yok', 'common', 'Resim yok metni', 1),
  (1, 'inactive', 'Pasif', 'common', 'Pasif durumu', 1),
  (1, 'no_hotels', 'Henüz otel bulunmamaktadır.', 'products', 'Otel bulunamadı mesajı', 1),
  (1, 'no_products', 'Henüz ürün bulunmamaktadır.', 'products', 'Ürün bulunamadı mesajı', 1),
  (1, 'per_night', 'gece', 'products', 'Gece başına fiyat birimi', 1),
  (1, 'out_of_stock', 'Stokta Yok', 'products', 'Stokta yok durumu', 1)
ON CONFLICT (dil_id, anahtar) DO UPDATE
  SET deger = EXCLUDED.deger,
      kategori = EXCLUDED.kategori,
      aciklama = EXCLUDED.aciklama,
      durum = EXCLUDED.durum;

-- İngilizce çeviriler - Ortak metinler (dil_id = 2)
INSERT INTO ceviriler (dil_id, anahtar, deger, kategori, aciklama, durum)
VALUES
  (2, 'loading', 'Loading...', 'common', 'Loading text', 1),
  (2, 'no_image', 'No image', 'common', 'No image text', 1),
  (2, 'inactive', 'Inactive', 'common', 'Inactive status', 1),
  (2, 'no_hotels', 'No hotels available yet.', 'products', 'No hotels found message', 1),
  (2, 'no_products', 'No products available yet.', 'products', 'No products found message', 1),
  (2, 'per_night', 'night', 'products', 'Per night price unit', 1),
  (2, 'out_of_stock', 'Out of Stock', 'products', 'Out of stock status', 1)
ON CONFLICT (dil_id, anahtar) DO UPDATE
  SET deger = EXCLUDED.deger,
      kategori = EXCLUDED.kategori,
      aciklama = EXCLUDED.aciklama,
      durum = EXCLUDED.durum;

-- Türkçe çeviriler - Ana Sayfa (dil_id = 1)
INSERT INTO ceviriler (dil_id, anahtar, deger, kategori, aciklama, durum)
VALUES
  (1, 'hero_heading', 'Otel, araç, deneyimler', 'homepage', 'Ana sayfa hero başlığı', 1),
  (1, 'hero_description', 'Bizimle, seyahatiniz harika deneyimlerle dolu.', 'homepage', 'Ana sayfa hero açıklaması', 1),
  (1, 'start_search', 'Aramaya başla', 'homepage', 'Ana sayfa arama butonu', 1),
  (1, 'explore_best_places', 'Dünyanın en iyi konaklama yerlerini keşfedin.', 'homepage', 'Ana sayfa keşfet alt başlığı', 1),
  (1, 'lets_adventure', 'Hadi maceraya çıkalım', 'homepage', 'Ana sayfa macera başlığı', 1),
  (1, 'best_accommodation_options', 'En iyi konaklama seçenekleri', 'homepage', 'Konaklama ürünleri alt başlığı', 1),
  (1, 'accommodation', 'Konaklama', 'homepage', 'Konaklama başlığı', 1),
  (1, 'keep_calm_travel', 'Sakin ol ve seyahat et', 'homepage', 'Ev sahibi ol alt başlığı', 1),
  (1, 'become_host', 'Ev sahibi ol', 'homepage', 'Ev sahibi ol başlığı', 1),
  (1, 'great_places_near', 'Yakınınızdaki harika yerler', 'homepage', 'Yakındaki yerler alt başlığı', 1),
  (1, 'explore_nearby', 'Yakınları keşfet', 'homepage', 'Yakınları keşfet başlığı', 1),
  (1, 'explore_by_types_sub', '10 konaklama türüne göre evleri keşfedin', 'homepage', 'Türlere göre keşfet alt başlığı', 1),
  (1, 'explore_by_types', 'Konaklama türlerine göre keşfet.', 'homepage', 'Türlere göre keşfet başlığı', 1)
ON CONFLICT (dil_id, anahtar) DO UPDATE
  SET deger = EXCLUDED.deger,
      kategori = EXCLUDED.kategori,
      aciklama = EXCLUDED.aciklama,
      durum = EXCLUDED.durum;

-- İngilizce çeviriler - Ana Sayfa (dil_id = 2)
INSERT INTO ceviriler (dil_id, anahtar, deger, kategori, aciklama, durum)
VALUES
  (2, 'hero_heading', 'Hotel, car, experiences', 'homepage', 'Homepage hero heading', 1),
  (2, 'hero_description', 'With us, your trip is filled with amazing experiences.', 'homepage', 'Homepage hero description', 1),
  (2, 'start_search', 'Start your search', 'homepage', 'Homepage search button', 1),
  (2, 'explore_best_places', 'Explore the best places to stay in the world.', 'homepage', 'Homepage explore subheading', 1),
  (2, 'lets_adventure', 'Let''s go on an adventure', 'homepage', 'Homepage adventure heading', 1),
  (2, 'best_accommodation_options', 'Best accommodation options', 'homepage', 'Accommodation products subheading', 1),
  (2, 'accommodation', 'Accommodation', 'homepage', 'Accommodation heading', 1),
  (2, 'keep_calm_travel', 'Keep calm & travel on', 'homepage', 'Become a host subheading', 1),
  (2, 'become_host', 'Become a host', 'homepage', 'Become a host heading', 1),
  (2, 'great_places_near', 'Great places near where you live', 'homepage', 'Nearby places subheading', 1),
  (2, 'explore_nearby', 'Explore nearby', 'homepage', 'Explore nearby heading', 1),
  (2, 'explore_by_types_sub', 'Explore houses based on 10 types of stays', 'homepage', 'Explore by types subheading', 1),
  (2, 'explore_by_types', 'Explore by types of stays.', 'homepage', 'Explore by types heading', 1)
ON CONFLICT (dil_id, anahtar) DO UPDATE
  SET deger = EXCLUDED.deger,
      kategori = EXCLUDED.kategori,
      aciklama = EXCLUDED.aciklama,
      durum = EXCLUDED.durum;

