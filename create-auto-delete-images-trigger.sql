-- OTOMATİK GÖRSEL SİLME TRİGGER'I
-- İçerik silindiğinde ilişkili görseller de otomatik silinir

-- Otel silindiğinde görsellerini sil
CREATE OR REPLACE FUNCTION delete_otel_gorselleri()
RETURNS TRIGGER AS $$
BEGIN
    -- Otel görsellerini sil
    DELETE FROM gorsel_meta WHERE iliskili_tablo = 'otel' AND iliskili_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_delete_otel_gorselleri ON otel;
CREATE TRIGGER trigger_delete_otel_gorselleri
    BEFORE DELETE ON otel
    FOR EACH ROW
    EXECUTE FUNCTION delete_otel_gorselleri();

-- Ürün silindiğinde görsellerini sil
CREATE OR REPLACE FUNCTION delete_urun_gorselleri()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM gorsel_meta WHERE iliskili_tablo = 'urunler' AND iliskili_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_delete_urun_gorselleri ON urunler;
CREATE TRIGGER trigger_delete_urun_gorselleri
    BEFORE DELETE ON urunler
    FOR EACH ROW
    EXECUTE FUNCTION delete_urun_gorselleri();

COMMENT ON FUNCTION delete_otel_gorselleri IS 'Otel silindiğinde ilişkili görselleri otomatik siler';
COMMENT ON FUNCTION delete_urun_gorselleri IS 'Ürün silindiğinde ilişkili görselleri otomatik siler';



