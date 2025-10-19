import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Hizmetler } from './hizmetler/entities/hizmetler.entity';

async function seed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'yonetim',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true, // Tabloları oluştur
  });

  try {
    await dataSource.initialize();
    console.log('Veritabanı bağlantısı başarılı!');
    console.log('-----------------------------------');

    // Varsayılan yetkiler
    const defaultYetkiler = [
      { yetki: 'Süper Admin', durum: 1 },
      { yetki: 'Admin', durum: 1 },
      { yetki: 'Editör', durum: 1 },
      { yetki: 'Görüntüleyici', durum: 1 },
    ];

    console.log('📋 Yetkiler kontrol ediliyor...');
    for (const yetki of defaultYetkiler) {
      const existingYetki = await dataSource.query(
        'SELECT * FROM yetkiler WHERE yetki = ?',
        [yetki.yetki],
      );

      if (existingYetki.length === 0) {
        await dataSource.query(
          'INSERT INTO yetkiler (yetki, durum) VALUES (?, ?)',
          [yetki.yetki, yetki.durum],
        );
        console.log(`  ✅ "${yetki.yetki}" yetkisi eklendi`);
      } else {
        console.log(`  ℹ️  "${yetki.yetki}" yetkisi zaten mevcut`);
      }
    }

    console.log('-----------------------------------');

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Süper Admin yetki ID'sini al
    const superAdminYetki = await dataSource.query(
      'SELECT id FROM yetkiler WHERE yetki = ?',
      ['Süper Admin'],
    );
    const yetkiId = superAdminYetki[0]?.id;

    // Varsayılan kullanıcı var mı kontrol et
    const existingUser = await dataSource.query(
      'SELECT * FROM kullanicilar WHERE kullanici_adi = ?',
      ['barisgul'],
    );

    if (existingUser.length > 0) {
      console.log('👤 Varsayılan kullanıcı zaten mevcut!');
      
      // Kullanıcının yetkisini güncelle
      if (yetkiId) {
        await dataSource.query(
          'UPDATE kullanicilar SET yetki_ids = ? WHERE kullanici_adi = ?',
          [yetkiId.toString(), 'barisgul'],
        );
        console.log('  ✅ Kullanıcı yetkisi güncellendi (Süper Admin)');
      }
    } else {
      // Varsayılan kullanıcıyı ekle
      await dataSource.query(
        `INSERT INTO kullanicilar (ad, soyad, email, kullanici_adi, sifre, durum, yetki_ids) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          'Barış',
          'GÜL',
          'baris@example.com',
          'barisgul',
          hashedPassword,
          1,
          yetkiId ? yetkiId.toString() : null,
        ],
      );
      console.log('✅ Varsayılan kullanıcı oluşturuldu!');
      console.log('  👤 Kullanıcı Adı: barisgul');
      console.log('  🔑 Şifre: 123456');
      console.log('  🔐 Yetki: Süper Admin');
    }

    console.log('-----------------------------------');

    // Ana Menü Oluştur
    console.log('📋 Ana menü kontrol ediliyor...');
    const existingAnamenu = await dataSource.query(
      'SELECT * FROM anamenu WHERE anamenu = ?',
      ['Genel Ayarlar'],
    );

    let anamenuId: number;

    if (existingAnamenu.length === 0) {
      const anamenuResult = await dataSource.query(
        `INSERT INTO anamenu (anamenu, rota, ikon, sira, yetki_ids) 
         VALUES (?, ?, ?, ?, ?)`,
        ['Genel Ayarlar', '/genel-ayarlar', 'PiGear', 1, '1,2'],
      );
      anamenuId = anamenuResult.insertId;
      console.log('  ✅ "Genel Ayarlar" ana menüsü eklendi');
    } else {
      anamenuId = existingAnamenu[0].id;
      console.log('  ℹ️  "Genel Ayarlar" ana menüsü zaten mevcut');
    }

    // Alt Menüler
    console.log('📋 Alt menüler kontrol ediliyor...');
    const defaultMenuler = [
      {
        menu: 'Kullanıcılar',
        anamenu_id: anamenuId,
        rota: '/genel-ayarlar/kullanicilar',
        ikon: 'PiUsers',
        sira: 1,
        yetki_ids: '1,2',
      },
      {
        menu: 'Yetkiler',
        anamenu_id: anamenuId,
        rota: '/genel-ayarlar/yetkiler',
        ikon: 'PiShieldCheck',
        sira: 2,
        yetki_ids: '1,2',
      },
    ];

    for (const menuItem of defaultMenuler) {
      const existingMenu = await dataSource.query(
        'SELECT * FROM menu WHERE menu = ? AND anamenu_id = ?',
        [menuItem.menu, menuItem.anamenu_id],
      );

      if (existingMenu.length === 0) {
        await dataSource.query(
          `INSERT INTO menu (menu, anamenu_id, rota, ikon, sira, yetki_ids) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            menuItem.menu,
            menuItem.anamenu_id,
            menuItem.rota,
            menuItem.ikon,
            menuItem.sira,
            menuItem.yetki_ids,
          ],
        );
        console.log(`  ✅ "${menuItem.menu}" menüsü eklendi`);
      } else {
        console.log(`  ℹ️  "${menuItem.menu}" menüsü zaten mevcut`);
      }
    }

    // Varsayılan hizmetler
    const defaultHizmetler = [
      {
        ad: 'Konaklama',
        slug: 'stays',
        aciklama: 'Mükemmel konaklama seçenekleri bulun',
        ikon: 'House03Icon',
        renk: '#3B82F6',
        sira: 1,
        aktif: true,
        url: '/',
        meta_title: 'Konaklama Rezervasyonu - Chisfis',
        meta_description: 'Dünyanın her yerinde konaklama seçenekleri bulun ve rezervasyon yapın'
      },
      {
        ad: 'Araç Kiralama',
        slug: 'cars',
        aciklama: 'Seyahatiniz için ideal aracı bulun',
        ikon: 'Car05Icon',
        renk: '#10B981',
        sira: 2,
        aktif: true,
        url: '/car',
        meta_title: 'Araç Kiralama - Chisfis',
        meta_description: 'Uygun fiyatlarla araç kiralama seçenekleri'
      },
      {
        ad: 'Emlak',
        slug: 'real-estate',
        aciklama: 'Satın almak veya kiralamak için mükemmel yeri bulun',
        ikon: 'RealEstate02Icon',
        renk: '#F59E0B',
        sira: 3,
        aktif: true,
        url: '/real-estate',
        meta_title: 'Emlak - Chisfis',
        meta_description: 'Emlak satış ve kiralama seçenekleri'
      },
      {
        ad: 'Deneyimler',
        slug: 'experiences',
        aciklama: 'Unutulmaz deneyimler yaşayın',
        ikon: 'HotAirBalloonFreeIcons',
        renk: '#8B5CF6',
        sira: 4,
        aktif: true,
        url: '/experiences',
        meta_title: 'Deneyimler - Chisfis',
        meta_description: 'Yerel deneyimler ve aktiviteler'
      },
      {
        ad: 'Uçuşlar',
        slug: 'flights',
        aciklama: 'En uygun uçuş fiyatlarını bulun',
        ikon: 'Airplane02Icon',
        renk: '#EF4444',
        sira: 5,
        aktif: true,
        url: '/flights',
        meta_title: 'Uçuş Rezervasyonu - Chisfis',
        meta_description: 'Ucuz uçak bileti ve uçuş seçenekleri'
      }
    ];

    console.log('🚀 Hizmetler kontrol ediliyor...');
    for (const hizmet of defaultHizmetler) {
      const existingHizmet = await dataSource.getRepository(Hizmetler).findOne({
        where: { slug: hizmet.slug }
      });

      if (!existingHizmet) {
        const newHizmet = dataSource.getRepository(Hizmetler).create(hizmet);
        await dataSource.getRepository(Hizmetler).save(newHizmet);
        console.log(`✅ Hizmet eklendi: ${hizmet.ad}`);
      } else {
        console.log(`⚠️  Hizmet zaten mevcut: ${hizmet.ad}`);
      }
    }

    console.log('-----------------------------------');
    await dataSource.destroy();
    console.log('✅ Seed işlemi tamamlandı!');
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

seed();

