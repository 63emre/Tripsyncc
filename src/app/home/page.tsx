"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BiSearch, BiGlobe, BiCalendar, BiStar, BiUser } from 'react-icons/bi';
import { FaUmbrellaBeach, FaCity, FaMountain, FaLeaf } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import DestinationCard from '@/components/DestinationCard';
import MapComponent from '@/components/MapComponent';
import { LatLngExpression } from 'leaflet';

// Demo data - this would come from your API in a real app
const demoDestinations = [
  {
    id: "1",
    name: 'Kapadokya',
    country: 'Türkiye',
    city: 'Nevşehir',
    rating: 4.9,
    shortDescription: 'Eşsiz peri bacaları ve sıcak hava balon turlarıyla ünlü',
    description: 'Kapadokya, milyonlarca yıl önce volkanik patlamalar sonucu oluşan doğal oluşumlarıyla ünlüdür. Peribacaları, yeraltı şehirleri ve sıcak hava balonlarıyla büyüleyici bir deneyim sunar.',
    priceRange: '500₺-1.500₺',
    accommodationType: 'Butik Otel',
    images: ['/images/destinations/cappadocia.jpg'],
  },
  {
    id: "2",
    name: 'İstanbul',
    country: 'Türkiye',
    city: 'İstanbul',
    rating: 4.8,
    shortDescription: 'İki kıtayı birleştiren tarihi ve kültürel zenginlik',
    description: 'İstanbul, Avrupa ve Asya kıtalarını birleştiren, Bizans ve Osmanlı İmparatorluklarına başkentlik yapmış eşsiz bir şehirdir. Ayasofya, Topkapı Sarayı, Kapalıçarşı gibi tarihi değerleriyle ziyaretçilerini büyüler.',
    priceRange: '750₺-2.500₺',
    accommodationType: 'Şehir Oteli',
    images: ['/images/destinations/istanbul.jpg'],
  },
  {
    id: "3",
    name: 'Antalya',
    country: 'Türkiye',
    city: 'Antalya',
    rating: 4.7,
    shortDescription: 'Turkuaz sahiller ve antik kentleriyle tatil cenneti',
    description: 'Antalya, muhteşem plajları, antik kentleri ve doğal güzellikleriyle Türkiye&apos;nin en popüler tatil destinasyonlarından biridir. Side, Aspendos, Perge gibi antik kentler ve Düden Şelalesi gibi doğal güzellikler görülmeye değerdir.',
    priceRange: '450₺-1.800₺',
    accommodationType: 'Resort',
    images: ['/images/destinations/antalya.jpg'],
  },
  {
    id: "4",
    name: 'Bodrum',
    country: 'Türkiye',
    city: 'Muğla',
    rating: 4.6,
    shortDescription: 'Masmavi koyları ve canlı gece hayatıyla ünlü cennet',
    description: 'Bodrum, beyaz badanalı evleri, muhteşem koyları, canlı gece hayatı ve tarihi kalesiyle ünlüdür. Turkuaz rengi denizi, lüks marinalar ve zengin mutfağıyla yerli ve yabancı turistlerin gözdesidir.',
    priceRange: '600₺-2.000₺',
    accommodationType: 'Apart Otel',
    images: ['/images/destinations/bodrum.jpg'],
  },
];

// Recommended experiences
const experiences = [
  {
    id: 1,
    title: 'Sahil Tatili',
    description: 'Muhteşem plajlarda dinlenin ve denizin tadını çıkarın',
    icon: <FaUmbrellaBeach size={22} className="text-primary" />,
  },
  {
    id: 2,
    title: 'Şehir Keşfi',
    description: 'Canlı şehir hayatını ve kültürel değerleri keşfedin',
    icon: <FaCity size={22} className="text-primary" />,
  },
  {
    id: 3,
    title: 'Dağ Macerası',
    description: 'Zirveleri fethedip nefes kesen manzaraların tadını çıkarın',
    icon: <FaMountain size={22} className="text-primary" />,
  },
  {
    id: 4,
    title: 'Doğa Kaçamağı',
    description: 'Huzurlu ortamlarda doğayla iç içe vakit geçirin',
    icon: <FaLeaf size={22} className="text-primary" />,
  },
];

// Create map markers for popular destinations
const mapLocations = [
  {
    position: [41.0082, 28.9784] as LatLngExpression,
    name: "İstanbul",
    description: "Turkey's cultural and historical center with stunning architecture."
  },
  {
    position: [38.6431, 34.8307] as LatLngExpression,
    name: "Kapadokya",
    description: "Famous for its unique rock formations and hot air balloon rides."
  },
  {
    position: [36.8969, 30.7133] as LatLngExpression,
    name: "Antalya",
    description: "Beautiful coastal city with beaches and ancient ruins."
  },
  {
    position: [37.8750, 27.2530] as LatLngExpression,
    name: "Ephesus",
    description: "Ancient Greek city with well-preserved ruins."
  },
  {
    position: [39.9334, 32.8597] as LatLngExpression,
    name: "Ankara",
    description: "The capital city of Turkey with modern attractions."
  }
];

const HomePage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <section className="hero-background relative py-16 md:py-24">
          <div className="hero-content container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-enhanced">
                Hayalinizdeki Tatili Keşfedin
              </h1>
              <p className="text-lg md:text-xl mb-8 text-enhanced">
                Eşsiz destinasyonları keşfedin ve dünya genelinde unutulmaz anılar biriktirin.
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow-lg max-w-2xl mx-auto">
                <div className="grid md:grid-cols-4 gap-3">
                  <div className="flex items-center border rounded-md px-3 py-2 bg-white dark:bg-gray-700">
                    <BiGlobe className="text-primary mr-2" />
                    <input
                      type="text"
                      placeholder="Nereye?"
                      className="w-full bg-transparent focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center border rounded-md px-3 py-2 bg-white dark:bg-gray-700">
                    <BiCalendar className="text-primary mr-2" />
                    <input
                      type="text"
                      placeholder="Ne zaman?"
                      className="w-full bg-transparent focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center border rounded-md px-3 py-2 bg-white dark:bg-gray-700">
                    <BiUser className="text-primary mr-2" />
                    <input
                      type="text"
                      placeholder="Kişi sayısı"
                      className="w-full bg-transparent focus:outline-none"
                    />
                  </div>
                  <button className="btn btn-primary w-full">
                    <BiSearch className="mr-2" />
                    Ara
                  </button>
                </div>
            </div>
            </motion.div>
          </div>
        </section>
        
        {/* World Map Section - Now Interactive */}
        <section className="mb-12">
          <motion.h2 
            className="text-2xl font-bold mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Dünya Haritası
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-lg overflow-hidden shadow-lg"
          >
            <MapComponent 
              height="400px" 
              width="100%" 
              zoom={5} 
              center={[39.0, 35.0]} 
              locations={mapLocations}
            />
          </motion.div>
        </section>
        
        {/* Popular Destinations */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Popüler Destinasyonlar</h2>
              <p className="text-text-light max-w-2xl mx-auto">
                Dünya çapında en çok sevilen destinasyonları keşfedin
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {demoDestinations.map((destination) => (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/destination/${destination.id}`}>
                <DestinationCard destination={destination} />
                  </Link>
                </motion.div>
              ))}
              </div>
          </div>
        </section>
        
        {/* Recommended Experiences */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Önerilen Deneyimler</h2>
              <p className="text-text-light max-w-2xl mx-auto">
                Seyahat tercihlerinize göre en uygun deneyimi bulun
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {experiences.map((experience) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="card hover:shadow-lg p-6"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                      {experience.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{experience.title}</h3>
                    <p className="text-text-light">{experience.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src="/images/travel-planning.jpg"
                    alt="Seyahat planlaması"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Neden Bizi Seçmelisiniz</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-start">
                      <div className="mr-4 mt-1 bg-primary/10 p-2 rounded-full">
                        <BiStar className="text-primary" size={22} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Özenle Seçilmiş Destinasyonlar</h3>
                        <p className="text-text-light">
                          Otantik deneyimler için en iyi destinasyonları özenle seçiyoruz.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-start">
                      <div className="mr-4 mt-1 bg-primary/10 p-2 rounded-full">
                        <BiUser className="text-primary" size={22} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Kişiselleştirilmiş Planlar</h3>
                        <p className="text-text-light">
                          Tercihlerinize ve ilgi alanlarınıza göre özelleştirilmiş seyahat planları.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-start">
                      <div className="mr-4 mt-1 bg-primary/10 p-2 rounded-full">
                        <BiGlobe className="text-primary" size={22} />
              </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Yerel Bilgi</h3>
                        <p className="text-text-light">
                          Destinasyonları en iyi bilen yerel uzmanlardan tavsiyeler alın.
                        </p>
              </div>
              </div>
              </div>
              </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary-light">TripSync</h3>
              <p className="text-gray-300">Hayalinizdeki seyahati bulmanın en kolay yolu.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Hakkımızda</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Gizlilik Politikası</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Kullanım Şartları</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">İletişim</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Bizi Takip Edin</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span>Facebook</span>
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span>Twitter</span>
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span>Instagram</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-300">&copy; {new Date().getFullYear()} TripSync. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 