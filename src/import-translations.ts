import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CevirilerService } from './ceviriler/ceviriler.service';
import { DillerService } from './diller/diller.service';

// TR çevirileri
const trTranslations = {
  common: {
    submit: 'Gönder',
    Congratulation: 'Tebrikler',
    'Your booking': 'Rezervasyonunuz',
    Continue: 'Devam Et',
    'Start your search': 'Aramaya başla',
    'Show me more': 'Daha fazla göster',
    'View all': 'Tümünü gör',
    night: 'gece',
    'Enter your email': 'E-posta adresinizi girin',
    'Become a host': 'Ev sahibi ol',
    'Become an author': 'Yazar ol',
    Clear: 'Temizle',
    'Clear All': 'Tümünü temizle',
    Apply: 'Uygula',
    'Min price': 'Min fiyat',
    'Max price': 'Max fiyat',
    Filters: 'Filtreler',
    'All filters': 'Tüm filtreler',
    'Apply filters': 'Filtreleri uygula',
    'Show map': 'Haritayı göster',
    'Hide map': 'Haritayı gizle',
    'On sale': 'İndirimde',
    'Hosted by': 'Ev sahibi',
    person: 'kişi',
    day: 'gün',
    'Car owner': 'Araç sahibi',
    'Show all photos': 'Tüm fotoğrafları göster',
    'See host profile': 'Ev sahibi profilini gör',
    Reserve: 'Rezerve Et',
    'Clear dates': 'Tarihleri temizle',
    Save: 'Kaydet',
    'Select Date': 'Tarih Seç',
    Date: 'Tarih',
    Reviews: 'Yorumlar',
  },
  Header: {
    'List your property': 'Mülkünüzü listele',
    'Sign up': 'Kayıt ol',
  },
  'Header.AvatarDropDown': {
    'My Account': 'Hesabım',
    'My bookings': 'Rezervasyonlarım',
    Wishlist: 'Favorilerim',
    Help: 'Yardım',
    'Dark theme': 'Karanlık tema',
    Logout: 'Çıkış yap',
  },
  'Header.Notifications': {
    Notifications: 'Bildirimler',
  },
  'Header.DropdownTravelers': {
    Travelers: 'Hizmetler',
    Stays: 'Konaklama',
    'Real Estate': 'Emlak',
    Cars: 'Araçlar',
    Experiences: 'Deneyimler',
    stayDescription: 'Mükemmel konaklama yerini bulun',
    estateDescription: 'Satın almak veya kiralamak için mükemmel yeri bulun',
    carDescription: 'Kiralayacak mükemmel aracı bulun',
    experienceDescription: 'Mükemmel deneyimi bulun',
    footerDoc: 'Yolculuğunuza başlayın',
    footerDescription: 'Konaklama, araç kiralama veya keyif alacağınız deneyim için mükemmel yeri bulun',
    Flights: 'Uçuşlar',
    'Flight description': 'Mükemmel uçuşu bulun',
  },
  HeroSearchForm: {
    'Flying dates': 'Uçuş tarihleri',
    'Flying date': 'Uçuş tarihi',
    Buy: 'Satın Al',
    Rent: 'Kirala',
    Sell: 'Sat',
    Location: 'Konum',
    Locations: 'Konumlar',
    CheckIn: 'Giriş',
    CheckOut: 'Çıkış',
    'Add guests': 'Misafir ekle',
    'Ages 13 or above': '13 yaş ve üzeri',
    Adults: 'Yetişkinler',
    Children: 'Çocuklar',
    Infants: 'Bebekler',
    'Ages 2–12': '2-12 yaş',
    'Ages 0–2': '0-2 yaş',
    'Same drop off': 'Aynı teslim yeri',
    'Different drop off': 'Farklı teslim yeri',
    'City or Airport': 'Şehir veya Havalimanı',
    'Pick up location': 'Alış konumu',
    'Drop off location': 'Teslim konumu',
    'Pick up - Drop off': 'Alış - Teslim',
    Guests: 'Misafirler',
    'Round-trip': 'Gidiş-dönüş',
    'One-way': 'Tek yön',
    'Flying from': 'Nereden uçuyorsunuz',
    'Where are you flying from?': 'Nereden uçuyorsunuz?',
    'Where are you flying to?': 'Nereye uçuyorsunuz?',
    'Where do you want to fly from?': 'Nereden uçmak istiyorsunuz?',
    'Flying to': 'Nereye uçuyorsunuz',
    'Where you want to fly to?': 'Nereye uçmak istiyorsunuz?',
    'Pick up date': 'Alış tarihi',
    'Recent searches': 'Son aramalar',
    'Suggested locations': 'Önerilen konumlar',
    'Where are you going?': 'Nereye gidiyorsunuz?',
    'Add dates': 'Tarih ekle',
    Date: 'Tarih',
    'Date range': 'Tarih aralığı',
    search: 'Ara',
    'Property type': 'Mülk türü',
    Type: 'Tür',
    'Choose price range': 'Fiyat aralığı seç',
    'Price range': 'Fiyat aralığı',
    'Min price': 'Min fiyat',
    'Max price': 'Max fiyat',
    'Where to?': 'Nereye?',
    'Start your search': 'Aramaya başla',
    'Anywhere • Any week • Add guests': 'Herhangi bir yer • Herhangi bir hafta • Misafir ekle',
    'Clear all': 'Tümünü temizle',
    Where: 'Nerede',
    When: 'Ne zaman',
    "When's your trip?": 'Seyahatiniz ne zaman?',
    Destinations: 'Destinasyonlar',
    'Search destinations': 'Destinasyon ara',
    'Popular destinations': 'Popüler destinasyonlar',
    Who: 'Kim',
    "Who's coming?": 'Kim geliyor?',
    'Pick up': 'Alış',
    'Drop off': 'Teslim',
    'Flight type?': 'Uçuş türü?',
    'Ticket Class': 'Bilet Sınıfı',
    'Where to find?': 'Nerede bulacaksınız?',
    Property: 'Mülk',
    'Add property': 'Mülk ekle',
    Price: 'Fiyat',
  },
  login: {
    Login: 'Giriş',
    'Email address': 'E-posta adresi',
    Password: 'Şifre',
    'Forgot password?': 'Şifrenizi mi unuttunuz?',
    'New user?': 'Yeni kullanıcı?',
    'Create an account': 'Hesap oluştur',
    Signup: 'Kayıt ol',
    'Already have an account?': 'Zaten hesabınız var mı?',
    'Sign in': 'Giriş yap',
  },
  accountPage: {
    'Account information': 'Hesap bilgileri',
    'Edit profile': 'Profili düzenle',
    'Change password': 'Şifre değiştir',
    'Log out': 'Çıkış yap',
    'Name on account': 'Hesaptaki ad',
    'Change Image': 'Resmi değiştir',
    Name: 'Ad',
    Gender: 'Cinsiyet',
    Male: 'Erkek',
    Female: 'Kadın',
    Other: 'Diğer',
    Username: 'Kullanıcı adı',
    Email: 'E-posta',
    'Date of birth': 'Doğum tarihi',
    Addess: 'Adres',
    'Phone number': 'Telefon numarası',
    'About you': 'Hakkınızda',
    'Update information': 'Bilgileri güncelle',
    'Save lists': 'Listeleri kaydet',
    'Saved listings': 'Kayıtlı ilanlar',
    'Payments & payouts': 'Ödemeler ve çekimler',
    'Payout methods': 'Ödeme yöntemleri',
    'Add payout method': 'Ödeme yöntemi ekle',
    'Update your password': 'Şifrenizi güncelleyin',
    'Current password': 'Mevcut şifre',
    'New password': 'Yeni şifre',
    'Confirm password': 'Şifreyi onayla',
    'Update password': 'Şifreyi güncelle',
    Account: 'Hesabım',
    Password: 'Şifre',
  },
  pageTitles: {
    Home: 'Ana Sayfa',
    Stays: 'Konaklama',
    Cars: 'Araçlar',
    Experiences: 'Deneyimler',
    'Real Estate': 'Emlak',
    Flights: 'Uçuşlar',
    Account: 'Hesabım',
    Password: 'Şifre',
    'Saved Listings': 'Kayıtlı İlanlar',
    'Payments & Payouts': 'Ödemeler',
    Login: 'Giriş Yap',
    'Sign Up': 'Kayıt Ol',
    About: 'Hakkımızda',
    Contact: 'İletişim',
  },
};

// EN çevirileri
const enTranslations = {
  common: {
    submit: 'Submit',
    Congratulation: 'Congratulation',
    'Your booking': 'Your booking',
    Continue: 'Continue',
    'Start your search': 'Start your search',
    'Show me more': 'Show me more',
    'View all': 'View all',
    night: 'night',
    'Enter your email': 'Enter your email',
    'Become a host': 'Become a host',
    'Become an author': 'Become an author',
    Clear: 'Clear',
    'Clear All': 'Clear all',
    Apply: 'Apply',
    'Min price': 'Min price',
    'Max price': 'Max price',
    Filters: 'Filters',
    'All filters': 'All filters',
    'Apply filters': 'Apply filters',
    'Show map': 'Show map',
    'Hide map': 'Hide map',
    'On sale': 'On sale',
    'Hosted by': 'Hosted by',
    person: 'person',
    day: 'day',
    'Car owner': 'Car owner',
    'Show all photos': 'Show all photos',
    'See host profile': 'See host profile',
    Reserve: 'Reserve',
    'Clear dates': 'Clear dates',
    Save: 'Save',
    'Select Date': 'Select Date',
    Date: 'Date',
    Reviews: 'Reviews',
  },
  Header: {
    'List your property': 'List your property',
    'Sign up': 'Sign up',
  },
  'Header.AvatarDropDown': {
    'My Account': 'My Account',
    'My bookings': 'My bookings',
    Wishlist: 'Wishlist',
    Help: 'Helps',
    'Dark theme': 'Dark theme',
    Logout: 'Logout',
  },
  'Header.Notifications': {
    Notifications: 'Notifications',
  },
  'Header.DropdownTravelers': {
    Travelers: 'Categories',
    Stays: 'Stays',
    'Real Estate': 'Real Estate',
    Cars: 'Cars',
    Experiences: 'Experiences',
    stayDescription: 'Find the perfect place to stay',
    estateDescription: 'Find the perfect place to buy or rent',
    carDescription: 'Find the perfect car to rent',
    experienceDescription: 'Find the perfect experience',
    footerDoc: 'Start your journey',
    footerDescription: 'Find the perfect place to stay, car to rent, or experience to enjoy',
    Flights: 'Flights',
    'Flight description': 'Find the perfect flight',
  },
  HeroSearchForm: {
    'Flying dates': 'Flying dates',
    'Flying date': 'Flying date',
    Buy: 'Buy',
    Rent: 'Rent',
    Sell: 'Sell',
    Location: 'Location',
    Locations: 'Locations',
    CheckIn: 'Check in',
    CheckOut: 'Check out',
    'Add guests': 'Add guests',
    'Ages 13 or above': 'Ages 13 or above',
    Adults: 'Adults',
    Children: 'Children',
    Infants: 'Infants',
    'Ages 2–12': 'Ages 2–12',
    'Ages 0–2': 'Ages 0–2',
    'Same drop off': 'Same drop off',
    'Different drop off': 'Different drop off',
    'City or Airport': 'City or Airport',
    'Pick up location': 'Pick up location',
    'Drop off location': 'Drop off location',
    'Pick up - Drop off': 'Pick up - Drop off',
    Guests: 'Guests',
    'Round-trip': 'Round-trip',
    'One-way': 'One-way',
    'Flying from': 'Flying from',
    'Where are you flying from?': 'Where are you flying from?',
    'Where are you flying to?': 'Where are you flying to?',
    'Where do you want to fly from?': 'Where do you want to fly from?',
    'Flying to': 'Flying to',
    'Where you want to fly to?': 'Where you want to fly to?',
    'Pick up date': 'Pick up date',
    'Recent searches': 'Recent searches',
    'Suggested locations': 'Suggested locations',
    'Where are you going?': 'Where are you going?',
    'Add dates': 'Add dates',
    Date: 'Date',
    'Date range': 'Date range',
    search: 'Search',
    'Property type': 'Property type',
    Type: 'Type',
    'Choose price range': 'Choose price range',
    'Price range': 'Price range',
    'Min price': 'Min price',
    'Max price': 'Max price',
    'Where to?': 'Where to?',
    'Start your search': 'Start your search',
    'Anywhere • Any week • Add guests': 'Anywhere • Any week • Add guests',
    'Clear all': 'Clear all',
    Where: 'Where',
    When: 'When',
    "When's your trip?": "When's your trip?",
    Destinations: 'Destinations',
    'Search destinations': 'Search destinations',
    'Popular destinations': 'Popular destinations',
    Who: 'Who',
    "Who's coming?": "Who's coming?",
    'Pick up': 'Pick up',
    'Drop off': 'Drop off',
    'Flight type?': 'Flight type?',
    'Ticket Class': 'Ticket Class',
    'Where to find?': 'Where to find?',
    Property: 'Property',
    'Add property': 'Add property',
    Price: 'Price',
  },
  login: {
    Login: 'Login',
    'Email address': 'Email address',
    Password: 'Password',
    'Forgot password?': 'Forgot password?',
    'New user?': 'New user?',
    'Create an account': 'Create an account',
    Signup: 'Signup',
    'Already have an account?': 'Already have an account?',
    'Sign in': 'Sign in',
  },
  accountPage: {
    'Account information': 'Account information',
    'Edit profile': 'Edit profile',
    'Change password': 'Change password',
    'Log out': 'Log out',
    'Name on account': 'Name on account',
    'Change Image': 'Change Image',
    Name: 'Name',
    Gender: 'Gender',
    Male: 'Male',
    Female: 'Female',
    Other: 'Other',
    Username: 'Username',
    Email: 'Email',
    'Date of birth': 'Date of birth',
    Addess: 'Addess',
    'Phone number': 'Phone number',
    'About you': 'About you',
    'Update information': 'Update information',
    'Save lists': 'Save lists',
    'Saved listings': 'Saved listings',
    'Payments & payouts': 'Payments & payouts',
    'Payout methods': 'Payout methods',
    'Add payout method': 'Add payout method',
    'Update your password': 'Update your password',
    'Current password': 'Current password',
    'New password': 'New password',
    'Confirm password': 'Confirm password',
    'Update password': 'Update password',
    Account: 'Account',
    Password: 'Password',
  },
  pageTitles: {
    Home: 'Home',
    Stays: 'Stays',
    Cars: 'Cars',
    Experiences: 'Experiences',
    'Real Estate': 'Real Estate',
    Flights: 'Flights',
    Account: 'Account',
    Password: 'Password',
    'Saved Listings': 'Saved Listings',
    'Payments & Payouts': 'Payments & Payouts',
    Login: 'Login',
    'Sign Up': 'Sign Up',
    About: 'About',
    Contact: 'Contact',
  },
};

async function bootstrap() {
  console.log('🚀 Çeviri import işlemi başlıyor...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const cevirilerService = app.get(CevirilerService);
  const dillerService = app.get(DillerService);

  try {
    // Dilleri getir
    const diller = await dillerService.findAll();
    const trDil = diller.find((d) => d.kod === 'tr');
    const enDil = diller.find((d) => d.kod === 'en');

    if (!trDil || !enDil) {
      console.error('❌ TR veya EN dili bulunamadı!');
      console.log('Mevcut diller:', diller.map((d) => d.kod));
      await app.close();
      return;
    }

    console.log(`✅ Diller bulundu: TR (${trDil.id}), EN (${enDil.id})\n`);

    // Çevirileri import et
    let totalImported = 0;
    let totalUpdated = 0;
    let totalErrors = 0;

    // Her kategori için çevirileri işle
    for (const [kategori, ceviriler] of Object.entries(trTranslations)) {
      console.log(`📂 Kategori: ${kategori}`);

      for (const [anahtar, trDeger] of Object.entries(ceviriler as Record<string, string>)) {
        const enDeger = (enTranslations as any)[kategori]?.[anahtar];

        if (!enDeger) {
          console.log(`  ⚠️  ${anahtar}: EN çevirisi bulunamadı`);
          totalErrors++;
          continue;
        }

        try {
          await cevirilerService.updateCeviriGroup(anahtar, {
            kategori,
            durum: 1,
            ceviriler: [
              { dil_id: trDil.id, deger: trDeger },
              { dil_id: enDil.id, deger: enDeger },
            ],
          });
          console.log(`  ✓ ${anahtar}`);
          totalImported++;
        } catch (error) {
          console.log(`  ✗ ${anahtar}: ${error.message}`);
          totalErrors++;
        }
      }
      console.log('');
    }

    console.log('\n📊 İmport İstatistikleri:');
    console.log(`  ✅ Başarılı: ${totalImported}`);
    console.log(`  ❌ Hata: ${totalErrors}`);
    console.log('\n✨ İmport işlemi tamamlandı!\n');
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await app.close();
  }
}

bootstrap();

