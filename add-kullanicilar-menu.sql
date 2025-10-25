-- Kullanıcılar menüsünü ekle

-- 1. Ana menü bul ya da oluştur (Yönetim ana menüsü varsa kullan)
DO $$
DECLARE
    v_anamenu_id INTEGER;
    v_anamenu_alt_id INTEGER;
BEGIN
    -- "Yönetim" ana menüsünü bul veya oluştur
    SELECT id INTO v_anamenu_id FROM anamenu WHERE anamenu = 'Yönetim' LIMIT 1;
    
    IF v_anamenu_id IS NULL THEN
        INSERT INTO anamenu (anamenu, sira, durum) 
        VALUES ('Yönetim', 100, 1)
        RETURNING id INTO v_anamenu_id;
    END IF;

    -- "Kullanıcı Yönetimi" ana menü alt öğesi oluştur
    INSERT INTO anamenu_alt (
        anamenu_id,
        baslik,
        rota,
        ikon,
        sira,
        durum
    ) VALUES (
        v_anamenu_id,
        'Kullanıcı Yönetimi',
        '#',
        'PiUsersBold',
        10,
        1
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_anamenu_alt_id;

    -- Eğer zaten varsa, ID'yi al
    IF v_anamenu_alt_id IS NULL THEN
        SELECT id INTO v_anamenu_alt_id 
        FROM anamenu_alt 
        WHERE anamenu_id = v_anamenu_id 
        AND baslik = 'Kullanıcı Yönetimi' 
        LIMIT 1;
    END IF;

    -- Alt menü öğelerini ekle
    INSERT INTO menu (
        anamenu_alt_id,
        menu,
        rota,
        sira,
        durum
    ) VALUES 
    (v_anamenu_alt_id, 'Kullanıcı Listesi', '/kullanicilar', 1, 1)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Kullanıcılar menüsü başarıyla eklendi!';
END $$;

