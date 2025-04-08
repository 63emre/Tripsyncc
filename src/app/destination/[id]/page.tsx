"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Button from '@/components/Button';
import MapComponent from '@/components/MapComponent';
import { popularDestinations } from '@/utils/dummyData';
import { Destination } from '@/types';

const DestinationDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    // API çağrısını simüle etme
    setLoading(true);
    
    const fetchTimer = setTimeout(() => {
      const foundDestination = popularDestinations.find(d => d.id === id);
      setDestination(foundDestination || null);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(fetchTimer);
  }, [id]);

  const handleReservation = () => {
    router.push('/payment');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="text-gray-600">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Destinasyon bulunamadı</h2>
            <p className="text-gray-600 mb-6">Aradığınız destinasyon mevcut değil veya kaldırılmış olabilir.</p>
            <Button onClick={() => window.history.back()}>Geri Dön</Button>
          </div>
        </div>
      </div>
    );
  }

  // Destinasyon koordinatlarını al
  const coordinates = getDestinationCoordinates(destination.name);
  
  // Harita için konum oluştur
  const mapLocation = {
    position: coordinates,
    name: destination.name,
    description: `${destination.city}, ${destination.country}`
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">{destination.name}</h1>
          <p className="text-lg text-gray-600">{destination.city}, {destination.country}</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Ana Görsel Galerisi */}
          <motion.div 
            className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-200 h-96 rounded-lg relative">
              {/* Ana görsel alanı - gerçek görsel ile değiştirin */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-gray-500">[Destinasyon Görseli {selectedImageIndex + 1}]</span>
              </motion.div>
            </div>
            
            {/* Küçük resim galerisi */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {destination.images.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`h-20 w-20 flex-shrink-0 rounded-md ${
                    selectedImageIndex === index ? 'ring-2 ring-primary' : ''
                  }`}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="bg-gray-300 h-full w-full rounded-md flex items-center justify-center">
                    <span className="text-xs text-gray-500">[Küçük Resim {index + 1}]</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
          
          {/* Rezervasyon paneli */}
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6 card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{destination.priceRange}</h2>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{destination.rating} (42 değerlendirme)</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Konaklama Türleri</h3>
              <p className="text-gray-600">{destination.accommodationType}</p>
            </div>
            
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giriş Tarihi
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Çıkış Tarihi
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kişi Sayısı
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>
                      {num} Kişi
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <Button className="w-full mb-4" onClick={handleReservation}>Rezervasyon Yap</Button>
            <Button variant="outlined" className="w-full">Favorilere Ekle</Button>
          </motion.div>
        </div>
        
        {/* Destinasyon detayları */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 mb-8 card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Hakkında</h2>
          <p className="text-gray-700 mb-6">{destination.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Öne Çıkan Özellikler</h3>
              <ul className="space-y-2">
                <motion.li
                  className="flex items-center text-gray-700"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <span className="mr-2 text-primary">✓</span> Doğal güzellikler
                </motion.li>
                <motion.li
                  className="flex items-center text-gray-700"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <span className="mr-2 text-primary">✓</span> Tarihi yerler
                </motion.li>
                <motion.li
                  className="flex items-center text-gray-700"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <span className="mr-2 text-primary">✓</span> Yerel lezzetler
                </motion.li>
                <motion.li
                  className="flex items-center text-gray-700"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <span className="mr-2 text-primary">✓</span> Kültürel etkinlikler
                </motion.li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">En İyi Ziyaret Zamanı</h3>
              <p className="text-gray-700">
                {destination.name} için en iyi ziyaret zamanı Nisan - Ekim ayları arasıdır.
                Bu dönemde iklim genellikle ılıman ve turistik etkinlikler en yoğun haldedir.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Harita bölümü - interaktif */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 mb-8 card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Konum</h2>
          <MapComponent 
            height="300px"
            zoom={13}
            center={coordinates}
            locations={[mapLocation]}
          />
        </motion.div>
      </main>
    </div>
  );
};

// Destinasyon için koordinat alma yardımcı fonksiyonu
function getDestinationCoordinates(destinationName: string): [number, number] {
  // Normalde bir veritabanı veya API'den gelecek
  const coordinates: {[key: string]: [number, number]} = {
    'İstanbul': [41.0082, 28.9784],
    'Kapadokya': [38.6431, 34.8307],
    'Antalya': [36.8969, 30.7133],
    'Bodrum': [37.0340, 27.4305],
    // Gerektiğince daha fazla ekleyin
  };
  
  return coordinates[destinationName] || [39.0, 35.0]; // Varsayılan olarak Türkiye merkezi
}

export default DestinationDetailPage; 