-- Mevcut anamenu'leri listele
SELECT id, anamenu FROM anamenu;

-- Seçenekler ana menüsü varsa ID'sini bulun, yoksa oluşturun
-- Eğer Seçenekler menüsü yoksa ekleyin:
-- INSERT INTO anamenu (anamenu, ikon, sira, yetki_ids, durum) VALUES ('Seçenekler', 'settings', 10, '1,2', 1);

-- Seçenekler ana menüsünün ID'sini alın (örneğin: 3 olduğunu varsayalım)
-- Aşağıdaki INSERT sorgularında anamenu_id değerini kendi ID'nizle değiştirin

-- Dil ve Çeviri Yönetimi Alt Menüleri Ekle
INSERT INTO anamenu_alt (baslik, anamenu_id, rota, ikon, sira, yetki_ids, durum) VALUES
('Dil Yönetimi', 3, '/secenekler/dil-yonetimi', 'language', 1, '1,2', 1),
('Çeviri Yönetimi', 3, '/secenekler/ceviri-yonetimi', 'translate', 2, '1,2', 1);

-- Not: anamenu_id değerini (yukarıdaki örnekte 3) kendi sisteminizde Seçenekler menüsünün ID'si ile değiştirin.
-- Eğer yoksa önce Seçenekler ana menüsünü oluşturun:

/*
INSERT INTO anamenu (anamenu, ikon, sira, yetki_ids, durum) 
VALUES ('Seçenekler', 'settings', 10, '1,2', 1)
RETURNING id;

-- Dönen ID'yi kullanarak alt menüleri ekleyin
*/









