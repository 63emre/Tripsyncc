import { Attraction, Destination, Friend, Holiday, Listing, User } from "../types";

export const dummyUser: User = {
  id: "1",
  firstName: "Ahmet",
  lastName: "Yılmaz",
  email: "ahmet@example.com",
  phone: "+90 555 123 4567",
  profileImage: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  password: "123",
};

export const dummyUsers: User[] = [
  dummyUser,
  {
    id: "5",
    firstName: "Emre",
    lastName: "Atilla",
    email: "emre@example.com",
    phone: "+90 555 987 6543",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    password: "123",
  },
  {
    id: "6",
    firstName: "Onur",
    lastName: "Taş",
    email: "onur@example.com",
    phone: "+90 555 876 5432",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    password: "123",
  },
];

export const dummyFriends: Friend[] = [
  {
    id: "2",
    firstName: "Mehmet",
    lastName: "Kaya",
    email: "mehmet@example.com",
    profileImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: "3",
    firstName: "Ayşe",
    lastName: "Demir",
    email: "ayse@example.com",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: "4",
    firstName: "Fatma",
    lastName: "Yıldız",
    email: "fatma@example.com",
    profileImage: "https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: "5",
    firstName: "Emre",
    lastName: "Atilla",
    email: "emre@example.com",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: "6",
    firstName: "Onur",
    lastName: "Taş",
    email: "onur@example.com",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
];

// Get current date
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

export const dummyMessages = {
  "2": [
    {
      id: "1",
      senderId: "1", // current user
      receiverId: "2",
      content: "Merhaba, nasılsın? İstanbul'daki konaklama hakkında bilgi almak istiyordum.",
      timestamp: threeDaysAgo,
      isRead: true,
    },
    {
      id: "2",
      senderId: "2",
      receiverId: "1",
      content: "Merhaba! Tabii, yardımcı olabilirim. İstanbul'da hangi semtte kalmak istiyorsun?",
      timestamp: threeDaysAgo,
      isRead: true,
    },
    {
      id: "3",
      senderId: "1",
      receiverId: "2",
      content: "Kadıköy veya Beşiktaş düşünüyorum. Hangisi daha uygun olur sence?",
      timestamp: twoDaysAgo,
      isRead: true,
    },
    {
      id: "4",
      senderId: "2",
      receiverId: "1",
      content: "İkisi de güzel bölgeler. Beşiktaş daha merkezi ve hareketli, Kadıköy ise biraz daha sakin ve yerel hayatı deneyimleyebileceğin bir yer.",
      timestamp: yesterday,
      isRead: true,
    },
  ],
  "3": [
    {
      id: "5",
      senderId: "1", // current user
      receiverId: "3",
      content: "Merhaba Ayşe, Ankara'daki etkinlik hakkında detayları gönderebilir misin?",
      timestamp: yesterday,
      isRead: true,
    },
    {
      id: "6",
      senderId: "3",
      receiverId: "1",
      content: "Merhaba! Tabii, etkinlik 25 Haziran'da Kızılay'da olacak. Detayları e-posta ile gönderdim, kontrol edebilir misin?",
      timestamp: today,
      isRead: true,
    },
  ],
  "4": [
    {
      id: "7",
      senderId: "4",
      receiverId: "1",
      content: "Selam! Geçen sefer konuştuğumuz Antalya turu hakkında bilgi geldi. İlgilenir misin?",
      timestamp: today,
      isRead: false,
    },
  ],
  "5": [
    {
      id: "8",
      senderId: "5",
      receiverId: "1",
      content: "Merhaba Ahmet, Malatya gezisine katılmak ister misin? Harika bir tur programı hazırladım.",
      timestamp: yesterday,
      isRead: true,
    },
    {
      id: "9",
      senderId: "1",
      receiverId: "5",
      content: "Selam Emre, çok ilginç görünüyor! Ne zaman planladın?",
      timestamp: yesterday,
      isRead: true,
    },
    {
      id: "10",
      senderId: "5",
      receiverId: "1",
      content: "Önümüzdeki ay. Detaylı programı gönderiyorum. Aslantepe Höyüğü ve Battalgazi'yi kesinlikle görmeliyiz!",
      timestamp: today,
      isRead: false,
    },
  ],
  "6": [
    {
      id: "11",
      senderId: "6",
      receiverId: "1",
      content: "Ahmet merhaba, Sivas'taki konaklama için rezervasyon yaptım. Sence uygun mu?",
      timestamp: twoDaysAgo,
      isRead: true,
    },
    {
      id: "12",
      senderId: "1",
      receiverId: "6",
      content: "Onur, harika görünüyor! Divriği Ulu Camii'ne yakın mı?",
      timestamp: yesterday,
      isRead: true,
    },
    {
      id: "13",
      senderId: "6",
      receiverId: "1",
      content: "Evet, tam istediğin gibi. 15 dakikalık yürüme mesafesinde. Ayrıca şehir merkezine ulaşım da çok kolay.",
      timestamp: today,
      isRead: false,
    },
  ],
};

export const popularDestinations: Destination[] = [
  {
    id: "1",
    name: "Yozgat",
    country: "Türkiye",
    city: "Yozgat",
    description: "Yozgat, İç Anadolu'nun şirin bir şehridir. Çamlık Milli Parkı, Sarıkaya Roma Hamamı ve zengin mutfak kültürüyle ziyaretçilerine benzersiz deneyimler sunar. Yozgat'ın doğal güzellikleri ve tarihi dokusu, keşfedilmeyi bekleyen hazinelerle doludur.",
    shortDescription: "İç Anadolu'nun tarihi ve doğal güzellikleriyle dolu şehri",
    priceRange: "₺",
    accommodationType: "Otel, Konukevi",
    images: ["yozgat1.jpg", "yozgat2.jpg"],
    rating: 4.8,
    featured: true,
  },
  {
    id: "2",
    name: "Malatya",
    country: "Türkiye",
    city: "Malatya",
    description: "Malatya, Doğu Anadolu'nun incisi olarak bilinir. Dünyaca ünlü kayısılarıyla meşhur olan Malatya, aynı zamanda zengin tarihi ve kültürel mirası ile de öne çıkar. Aslantepe Höyüğü, Şire Pazarı ve Battalgazi gibi tarihi mekanlarıyla turistlerin ilgisini çeken Malatya, konukseverliği ile de tanınır.",
    shortDescription: "Kayısıların başkenti, tarihin beşiği",
    priceRange: "₺₺",
    accommodationType: "Otel, Apart, Pansiyon",
    images: ["malatya1.jpg", "malatya2.jpg"],
    rating: 4.7,
    featured: true,
  },
  {
    id: "3",
    name: "Sivas",
    country: "Türkiye",
    city: "Sivas",
    description: "Sivas, Anadolu'nun köklü şehirlerinden biridir. Selçuklu ve Osmanlı mimarisinin izlerini taşıyan yapıları, doğal güzellikleri ve zengin mutfağıyla misafirlerini ağırlar. Divriği Ulu Camii ve Darüşşifası UNESCO Dünya Mirası Listesi'nde yer alan Sivas, kültür turizmi açısından önemli bir destinasyondur.",
    shortDescription: "Anadolu'nun kadim şehri, kültür ve tarih merkezi",
    priceRange: "₺",
    accommodationType: "Otel, Butik Otel, Pansiyon",
    images: ["sivas1.jpg", "sivas2.jpg"],
    rating: 4.6,
    featured: true,
  },
  {
    id: "4",
    name: "İstanbul",
    country: "Türkiye",
    city: "İstanbul",
    description: "İstanbul, Avrupa ve Asya kıtalarını birbirine bağlayan, tarihi ve kültürel zenginlikleriyle dünyaca ünlü bir şehirdir. Ayasofya, Topkapı Sarayı ve Kapalı Çarşı gibi tarihi mekanlarıyla turistlerin ilgisini çeken İstanbul, aynı zamanda modern yaşamın dinamik yönlerini de içinde barındırır.",
    shortDescription: "Avrupa ve Asya'yı birleştiren tarihi şehir",
    priceRange: "₺₺₺",
    accommodationType: "Otel, Pansiyon, Apart",
    images: ["istanbul1.jpg", "istanbul2.jpg", "istanbul3.jpg"],
    rating: 4.9,
    featured: false,
  },
  {
    id: "5",
    name: "Kapadokya",
    country: "Türkiye",
    city: "Nevşehir",
    description: "Kapadokya, doğa ve tarihin dünyada en güzel bütünleştiği yerdir. Peribacaları olarak adlandırılan ilginç kaya oluşumları, sıcak hava balonları ve yeraltı şehirleriyle ünlüdür.",
    shortDescription: "Eşsiz doğa harikası, sıcak hava balonlarıyla meşhur",
    priceRange: "₺₺",
    accommodationType: "Mağara Otel, Butik Otel",
    images: ["kapadokya1.jpg", "kapadokya2.jpg"],
    rating: 4.9,
    featured: false,
  },
];

export const allDestinations: Destination[] = [
  ...popularDestinations,
  {
    id: "6",
    name: "Antalya",
    country: "Türkiye",
    city: "Antalya",
    description: "Antalya, Türkiye'nin güneyinde, Akdeniz kıyısında yer alan güzel bir tatil şehridir. Muhteşem plajları, tarihi kalıntıları ve lüks otelleriyle her yıl milyonlarca turisti ağırlar.",
    shortDescription: "Türkiye'nin turizm cenneti, masmavi kıyılarıyla ünlü",
    priceRange: "₺₺₺",
    accommodationType: "Otel, Resort, Apart",
    images: ["antalya1.jpg", "antalya2.jpg"],
    rating: 4.8,
    featured: false,
  },
  {
    id: "7",
    name: "Trabzon",
    country: "Türkiye",
    city: "Trabzon",
    description: "Trabzon, Karadeniz'in incisi olarak bilinen, yeşilin her tonunu barındıran doğal güzelliklere sahip bir şehirdir. Sümela Manastırı, Uzungöl gibi doğal ve tarihi mekanları ile ünlüdür.",
    shortDescription: "Karadeniz'in yeşil cenneti",
    priceRange: "₺₺",
    accommodationType: "Otel, Dağ Evi, Pansiyon",
    images: ["trabzon1.jpg", "trabzon2.jpg"],
    rating: 4.6,
    featured: false,
  },
  {
    id: "8",
    name: "İzmir",
    country: "Türkiye",
    city: "İzmir",
    description: "İzmir, Ege Denizi kıyısında, modern ve kozmopolit bir şehirdir. Tarih boyunca pek çok medeniyete ev sahipliği yapmış olan İzmir, tarihi yapıları, nefis mutfağı ve canlı gece hayatıyla bilinir.",
    shortDescription: "Ege'nin incisi, modern ve dinamik şehir",
    priceRange: "₺₺",
    accommodationType: "Otel, Apart, Villa",
    images: ["izmir1.jpg", "izmir2.jpg"],
    rating: 4.7,
    featured: false,
  },
  {
    id: "9",
    name: "Mardin",
    country: "Türkiye",
    city: "Mardin",
    description: "Mardin, Güneydoğu Anadolu Bölgesi'nde, Mezopotamya Ovası'na bakan yamaçta kurulu tarihi bir şehirdir. Taş işçiliğinin hakim olduğu mimarisi, dar sokakları ve zengin kültürüyle büyüleyici bir atmosfere sahiptir.",
    shortDescription: "Taş evleri ve çok kültürlü yapısıyla meşhur tarihi şehir",
    priceRange: "₺₺",
    accommodationType: "Butik Otel, Konak, Pansiyon",
    images: ["mardin1.jpg", "mardin2.jpg"],
    rating: 4.8,
    featured: false,
  },
  {
    id: "10",
    name: "Çanakkale",
    country: "Türkiye",
    city: "Çanakkale",
    description: "Çanakkale, Türkiye'nin kuzeybatısında, Çanakkale Boğazı'nın iki yakasında yer alan tarihi bir şehirdir. Truva antik kenti ve Gelibolu Yarımadası'ndaki savaş alanları ile önemli bir tarih turizmi merkezidir.",
    shortDescription: "Tarihi yarımada ve boğazların şehri",
    priceRange: "₺₺",
    accommodationType: "Otel, Pansiyon, Kamp",
    images: ["canakkale1.jpg", "canakkale2.jpg"],
    rating: 4.5,
    featured: false,
  }
];

export const yozgatAttractions: Attraction[] = [
  {
    id: "1",
    name: "Çamlık Milli Parkı",
    location: "Yozgat Merkez",
    description: "Türkiye'nin ilk milli parkı olan Çamlık, zengin bitki örtüsü ve temiz havasıyla doğa tutkunlarını cezbeder.",
  },
  {
    id: "2",
    name: "Sarıkaya Roma Hamamı (Basilica Therma)",
    location: "Sarıkaya",
    description: "UNESCO Dünya Mirası Geçici Listesi'nde yer alan antik termal hamam, Roma döneminden kalma önemli bir eserdir.",
  },
  {
    id: "3",
    name: "Yozgat Saat Kulesi",
    location: "Yozgat Merkez",
    description: "1908 yılında yapılan Yozgat'ın simgelerinden biri olan tarihi saat kulesi.",
  },
  {
    id: "4",
    name: "Kazankaya Kanyonu",
    location: "Aydıncık",
    description: "Doğal güzellikleriyle ünlü kanyon, rafting ve doğa yürüyüşleri için ideal bir mekan.",
  },
];

export const malatyaAttractions: Attraction[] = [
  {
    id: "5",
    name: "Aslantepe Höyüğü",
    location: "Battalgazi",
    description: "UNESCO Dünya Mirası Listesi'nde yer alan, 5500 yıllık tarihe sahip arkeolojik sit alanı.",
    imageUrl: "aslantepe.jpg"
  },
  {
    id: "6",
    name: "Battalgazi (Eski Malatya)",
    location: "Battalgazi",
    description: "Tarihi camiler, hanlar ve geleneksel evlerle dolu eski Malatya şehri.",
    imageUrl: "battalgazi.jpg"
  },
  {
    id: "7",
    name: "Levent Vadisi",
    location: "Akçadağ",
    description: "Muhteşem doğal güzelliklere sahip, trekking ve doğa fotoğrafçılığı için ideal bir vadi.",
    imageUrl: "levent_vadisi.jpg"
  },
  {
    id: "8",
    name: "Malatya Kayısı Pazarı",
    location: "Malatya Merkez",
    description: "Dünyaca ünlü Malatya kayısılarının satıldığı geleneksel pazar.",
    imageUrl: "kayisi_pazari.jpg"
  },
];

export const sivasAttractions: Attraction[] = [
  {
    id: "9",
    name: "Divriği Ulu Camii ve Darüşşifası",
    location: "Divriği",
    description: "UNESCO Dünya Mirası Listesi'nde yer alan, 13. yüzyıldan kalma muhteşem taş işçiliğine sahip cami ve hastane kompleksi.",
    imageUrl: "divrigi.jpg"
  },
  {
    id: "10",
    name: "Gök Medrese",
    location: "Sivas Merkez",
    description: "1271 yılında yapılan Selçuklu dönemi medresesi, çini süslemeleriyle ünlüdür.",
    imageUrl: "gok_medrese.jpg"
  },
  {
    id: "11",
    name: "Sivas Kongre ve Etnografya Müzesi",
    location: "Sivas Merkez",
    description: "1919'da Atatürk'ün başkanlığında Sivas Kongresi'nin düzenlendiği tarihi bina.",
    imageUrl: "sivas_kongre.jpg"
  },
  {
    id: "12",
    name: "Balıklı Kaplıca",
    location: "Kangal",
    description: "Sedef hastalığı tedavisinde kullanılan, içinde küçük balıkların yaşadığı şifalı kaplıca.",
    imageUrl: "balikli_kaplica.jpg"
  },
];

export const turkishHolidays: Holiday[] = [
  {
    id: "1",
    name: "Ramazan Bayramı",
    date: "2024-04-10",
    description: "Ramazan ayının sonunda kutlanan dini bayram. Üç gün sürer ve aileler bir araya gelerek kutlarlar.",
  },
  {
    id: "2",
    name: "Kurban Bayramı",
    date: "2024-06-17",
    description: "İslam'ın en önemli bayramlarından biri. Dört gün sürer ve kurban kesme geleneği vardır.",
  },
  {
    id: "3",
    name: "Cumhuriyet Bayramı",
    date: "2024-10-29",
    description: "Türkiye Cumhuriyeti'nin kuruluşunun kutlandığı milli bayram.",
  },
  {
    id: "4",
    name: "Yozgat Sürmeli Festivali",
    date: "2024-07-15",
    description: "Yozgat'ın kültürel zenginliklerini yansıtan geleneksel festival. Müzik, dans ve yöresel lezzetler sunulur.",
  },
];

export const dummyListings: Listing[] = [
  {
    id: "1",
    userId: "1",
    title: "Deniz Manzaralı Daire",
    country: "Türkiye",
    city: "İzmir",
    address: "Karşıyaka Mah. Deniz Cad. No:15",
    postalCode: "35000",
    price: 750,
    capacity: 4,
    roomCount: 2,
    description: "Denize sıfır, tamamen yenilenmiş, modern dekorasyonlu daire.",
    images: ["izmir_listing1.jpg", "izmir_listing2.jpg"],
    amenities: ["Wi-Fi", "Klima", "Mutfak", "Çamaşır Makinesi"],
  },
  {
    id: "2",
    userId: "1",
    title: "Tarihi Konak",
    country: "Türkiye",
    city: "Yozgat",
    address: "Merkez Mah. Konak Sk. No:7",
    postalCode: "66000",
    price: 450,
    capacity: 6,
    roomCount: 3,
    description: "Yozgat'ın merkezinde restore edilmiş tarihi konak, geleneksel mimariyi modern konforla buluşturuyor.",
    images: ["yozgat_listing1.jpg", "yozgat_listing2.jpg"],
    amenities: ["Wi-Fi", "Şömine", "Bahçe", "Otopark"],
  },
]; 