"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BiSearch, BiGlobe, BiCalendar, BiStar, BiUser } from 'react-icons/bi';
import { FaUmbrellaBeach, FaCity, FaMountain, FaLeaf } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import DestinationCard from '@/components/DestinationCard';
import MapComponent from '@/components/MapComponent';
import { LatLngExpression } from 'leaflet';
import { get } from '@/lib/api';

// Listing tipi tanımlaması
type ListingImage = {
  id: string;
  url: string;
  caption: string | null;
  isPrimary: boolean;
};

type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  capacity: number;
  location: string;
  latitude: number | null;
  longitude: number | null;
  amenities: string[];
  category: string;
  images: ListingImage[];
  averageRating: number | null;
  reviewCount: number;
  createdAt: string;
};

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

const HomePage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLocations, setMapLocations] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState({
    location: '',
    date: '',
    guests: '',
  });

  // İlanları API'den çek
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const response = await get<{ listings: Listing[] }>('/listings');
        setListings(response.listings);
        
        // Harita konumlarını güncelle
        const locations = response.listings
          .filter(listing => listing.latitude && listing.longitude)
          .map(listing => ({
            position: [listing.latitude, listing.longitude] as LatLngExpression,
            name: listing.title,
            description: listing.description ? listing.description.substring(0, 80) + '...' : 'Açıklama yok',
            id: listing.id
          }));
          
        setMapLocations(locations);
      } catch (error) {
        console.error('İlanlar alınırken hata oluştu:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListings();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Arama parametreleriyle arama sayfasına yönlendirme için hazırlık
    const queryParams = new URLSearchParams();
    if (searchParams.location) queryParams.append('location', searchParams.location);
    if (searchParams.date) queryParams.append('date', searchParams.date);
    if (searchParams.guests) queryParams.append('guests', searchParams.guests);
    
    // Gerçek yönlendirme işlemi burada yapılabilir
    console.log(`/search?${queryParams.toString()}`);
  };

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
                <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-3">
                  <div className="flex items-center border rounded-md px-3 py-2 bg-white dark:bg-gray-700">
                    <BiGlobe className="text-primary mr-2" />
                    <input
                      type="text"
                      name="location"
                      placeholder="Nereye?"
                      className="w-full bg-transparent focus:outline-none"
                      value={searchParams.location}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <div className="flex items-center border rounded-md px-3 py-2 bg-white dark:bg-gray-700">
                    <BiCalendar className="text-primary mr-2" />
                    <input
                      type="text"
                      name="date"
                      placeholder="Ne zaman?"
                      className="w-full bg-transparent focus:outline-none"
                      value={searchParams.date}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <div className="flex items-center border rounded-md px-3 py-2 bg-white dark:bg-gray-700">
                    <BiUser className="text-primary mr-2" />
                    <input
                      type="text"
                      name="guests"
                      placeholder="Kişi sayısı"
                      className="w-full bg-transparent focus:outline-none"
                      value={searchParams.guests}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    <BiSearch className="mr-2" />
                    Ara
                  </button>
                </form>
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
                En çok tercih edilen konaklama seçeneklerini keşfedin
              </p>
            </motion.div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-gray-100 dark:bg-gray-800 rounded-lg h-72 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {listings.slice(0, 4).map((listing) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/destination/${listing.id}`}>
                      <DestinationCard 
                        destination={{
                          id: listing.id,
                          name: listing.title,
                          location: listing.location,
                          rating: listing.averageRating || 0,
                          shortDescription: listing.description ? listing.description.substring(0, 100) + '...' : 'Açıklama yok',
                          priceRange: `${listing.price}₺`,
                          images: listing.images && Array.isArray(listing.images) ? listing.images.map(img => img.url) : [],
                        }} 
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
            
            {listings.length > 0 && (
              <div className="text-center mt-10">
                <Link href="/search" className="btn btn-outline">
                  Tümünü Gör
                </Link>
              </div>
            )}
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
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Neden TripSync?</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <BiStar className="text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold mb-1">Güvenilir İncelemeler</h3>
                      <p className="text-text-light">Gerçek kullanıcılardan gelen dürüst değerlendirmelerle en iyi deneyimi yaşayın.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <BiStar className="text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold mb-1">Benzersiz Deneyimler</h3>
                      <p className="text-text-light">Sıradan turizm deneyimlerinin ötesinde, yerel kültürle iç içe seyahat fırsatları.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <BiStar className="text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold mb-1">7/24 Destek</h3>
                      <p className="text-text-light">Seyahatinizin her anında size destek olmaya hazır müşteri hizmetleri.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-lg"
              >
                <Image
                  src="/globe.svg"
                  alt="Neden Bizi Seçmelisiniz"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg bg-gray-100"
                  unoptimized
                  onError={(e) => {
                    // Fallback to a default image if the target image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.src = "/globe.svg";
                  }}
                />
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Hemen Maceraya Başlayın</h2>
            <p className="text-text-light max-w-2xl mx-auto mb-8">
              Hayalinizdeki tatil sizi bekliyor. İster kısa bir kaçamak, ister uzun bir seyahat planlıyor olun, size uygun seçenekleri keşfedin.
            </p>
            <Link href="/search" className="btn btn-primary">
              Şimdi Keşfet
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;