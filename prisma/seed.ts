import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth/password';

const prisma = new PrismaClient();

async function main() {
  // Demo kullanıcısı oluştur
  const hashedPassword = await hashPassword('1234');
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@demo.com' },
    update: {},
    create: {
      email: 'demo@demo.com',
      password: hashedPassword,
      name: 'Demo Kullanıcı',
      profile: {
        create: {
          bio: 'Merhaba! Ben TripSync demo kullanıcısıyım. Seyahat etmeyi ve yeni yerler keşfetmeyi seviyorum.',
          city: 'İstanbul',
          country: 'Türkiye',
        }
      }
    },
  });

  console.log('Demo kullanıcı oluşturuldu:', user.email);

  // İstanbul'da Daire ilanı
  const listing1 = await prisma.listing.create({
    data: {
      title: 'İstanbul\'da Tarihi Yarımadada Daire',
      description: 'Sultanahmet\'e sadece 5 dakika yürüme mesafesinde bulunan bu daire, tüm tarihi mekanlara kolay erişim sağlıyor. Tamamen yenilenmiş, modern mobilyalı ve muhteşem boğaz manzaralı.',
      price: 1500,
      capacity: 4,
      location: 'İstanbul, Türkiye',
      latitude: 41.008240,
      longitude: 28.978359,
      amenities: ['Wifi', 'Klima', 'Mutfak', 'Çamaşır Makinesi', 'TV', 'Balkon'],
      category: 'daire',
      ownerId: user.id,
      images: {
        createMany: {
          data: [
            {
              url: '/images/listings/istanbul1.jpg',
              caption: 'Oturma Odası',
              isPrimary: true,
            },
            {
              url: '/images/listings/istanbul2.jpg',
              caption: 'Yatak Odası',
              isPrimary: false,
            },
            {
              url: '/images/listings/istanbul3.jpg',
              caption: 'Mutfak',
              isPrimary: false,
            }
          ]
        }
      }
    }
  });

  console.log('İlan oluşturuldu:', listing1.title);

  // Fethiye'de Villa
  const listing2 = await prisma.listing.create({
    data: {
      title: 'Fethiye\'de Denize Sıfır Villa',
      description: 'Öludeniz\'de muhteşem manzaralı, özel havuzlu lüks villa. Denize sadece 100m mesafede, tamamen özel bahçe içinde. Modern ve lüks tasarım, 3 yatak odası, jakuzili banyo.',
      price: 3500,
      capacity: 6,
      location: 'Fethiye, Muğla, Türkiye',
      latitude: 36.574392,
      longitude: 29.127862,
      amenities: ['Wifi', 'Özel Havuz', 'Barbekü', 'Klima', 'Deniz Manzarası', 'Otopark', 'Jakuzi'],
      category: 'villa',
      ownerId: user.id,
      images: {
        createMany: {
          data: [
            {
              url: '/images/listings/fethiye1.jpg',
              caption: 'Villa Dıştan Görünüm',
              isPrimary: true,
            },
            {
              url: '/images/listings/fethiye2.jpg',
              caption: 'Havuz',
              isPrimary: false,
            },
            {
              url: '/images/listings/fethiye3.jpg',
              caption: 'Deniz Manzarası',
              isPrimary: false,
            }
          ]
        }
      }
    }
  });

  console.log('İlan oluşturuldu:', listing2.title);

  // Kapadokya'da Balon Turu
  const listing3 = await prisma.listing.create({
    data: {
      title: 'Kapadokya\'da Balon Turu',
      description: 'Güneşin ilk ışıklarıyla Kapadokya\'nın eşsiz manzarasını havadan izleme fırsatı. 1 saat sürecek bu unutulmaz deneyimde peribacalarının üzerinde süzülecek, vadilerin muhteşem görüntüsünü kuşbakışı izleyeceksiniz.',
      price: 2000,
      capacity: 16,
      location: 'Göreme, Nevşehir, Türkiye',
      latitude: 38.643056,
      longitude: 34.828889,
      amenities: ['Kahvaltı', 'Transfer', 'Sertifika', 'Sigorta', 'Şampanya Seremonisi'],
      category: 'aktivite',
      ownerId: user.id,
      images: {
        createMany: {
          data: [
            {
              url: '/images/listings/kapadokya1.jpg',
              caption: 'Balon Turu',
              isPrimary: true,
            },
            {
              url: '/images/listings/kapadokya2.jpg',
              caption: 'Gün Doğumu Manzarası',
              isPrimary: false,
            },
            {
              url: '/images/listings/kapadokya3.jpg',
              caption: 'Peribacaları',
              isPrimary: false,
            }
          ]
        }
      }
    }
  });

  console.log('İlan oluşturuldu:', listing3.title);

  // Bazı değerlendirmeler ekleyin
  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        comment: 'Harika bir konaklama deneyimiydi. Konumu mükemmel ve ev çok temizdi.',
        authorId: user.id,
        listingId: listing1.id,
      },
      {
        rating: 4,
        comment: 'Villa gerçekten güzeldi ama bazı küçük eksikleri vardı.',
        authorId: user.id,
        listingId: listing2.id,
      },
      {
        rating: 5,
        comment: 'Unutulmaz bir deneyim! Kesinlikle herkese tavsiye ederim.',
        authorId: user.id,
        listingId: listing3.id,
      }
    ]
  });

  // İkinci bir kullanıcı oluşturalım (opsiyonel)
  const user2Password = await hashPassword('123456');
  const user2 = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: user2Password,
      name: 'Test Kullanıcı',
      profile: {
        create: {
          bio: 'TripSync test kullanıcısıyım.',
          city: 'Ankara',
          country: 'Türkiye',
        }
      }
    },
  });

  // İki kullanıcı arasında örnek mesajlar oluşturalım
  await prisma.message.createMany({
    data: [
      {
        senderId: user.id,
        receiverId: user2.id,
        content: 'Merhaba, Fethiye\'deki villanız hakkında bilgi almak istiyorum.',
        isRead: true,
      },
      {
        senderId: user2.id,
        receiverId: user.id,
        content: 'Merhaba! Tabii ki, villamız hakkında hangi detayları öğrenmek istersiniz?',
        isRead: false,
      },
      {
        senderId: user.id,
        receiverId: user2.id,
        content: '15-20 Ağustos tarihleri arasında müsait mi acaba?',
        isRead: false,
      }
    ]
  });

  // Arkadaşlık isteği
  await prisma.friendship.create({
    data: {
      requesterId: user.id,
      addresseeId: user2.id,
      status: 'accepted'
    }
  });

  console.log('Seed işlemi tamamlandı!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });