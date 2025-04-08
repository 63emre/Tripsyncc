"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import DestinationCard from '@/components/DestinationCard';
import Image from '@/components/Image';
import { popularDestinations, allDestinations } from '@/utils/dummyData';
import { useTheme } from '@/components/ThemeProviderClient';
import { getRandomFeaturedImage } from '@/utils/imageUtils';

const DestinationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState(allDestinations);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [heroImage, setHeroImage] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  
  useEffect(() => {
    // Set a random hero image
    setHeroImage(getRandomFeaturedImage());
    
    // Load favorites from localStorage if available
    const savedFavorites = localStorage.getItem('favoriteDestinations');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);
  
  useEffect(() => {
    let filtered = allDestinations;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(dest => 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'featured') {
        filtered = filtered.filter(dest => dest.featured);
      } else if (selectedFilter === 'budget') {
        filtered = filtered.filter(dest => dest.priceRange === '₺');
      } else if (selectedFilter === 'popular') {
        filtered = popularDestinations;
      } else if (selectedFilter === 'favorites') {
        filtered = filtered.filter(dest => favorites.includes(dest.id));
      }
    }
    
    setFilteredDestinations(filtered);
  }, [searchQuery, selectedFilter, favorites]);
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id) 
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteDestinations', JSON.stringify(newFavorites));
  };
  
  const filterOptions = [
    { id: 'all', label: 'Tümü' },
    { id: 'featured', label: 'Öne Çıkanlar' },
    { id: 'popular', label: 'En Popüler' },
    { id: 'budget', label: 'Ekonomik' },
    { id: 'favorites', label: 'Favorilerim' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Night Sky Effect for Dark Mode */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/30 to-gray-900/0"></div>
          {[...Array(50)].map((_, i) => {
            const size = Math.random() * 2 + 1;
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const animationDelay = Math.random() * 5;
            const animationDuration = Math.random() * 3 + 2;
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: size + 'px',
                  height: size + 'px',
                  top: top + '%',
                  left: left + '%',
                  opacity: Math.random() * 0.7 + 0.3,
                }}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: animationDuration,
                  delay: animationDelay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </div>
      )}
      
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={heroImage}
            alt="Türkiye'nin Güzellikleri"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Türkiye&apos;nin En Güzel Gezi Noktaları
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Yozgat, Malatya ve Sivas&apos;tan İstanbul&apos;a, Kapadokya&apos;dan Antalya&apos;ya keşfedilecek muhteşem yerler
          </motion.p>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between gap-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setSelectedFilter(option.id)}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  selectedFilter === option.id 
                    ? 'bg-primary text-white shadow-md transform scale-105' 
                    : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} hover:bg-primary/20`
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          {/* Search */}
          <div className="relative max-w-md w-full">
            <div className="relative rounded-md w-full flex items-center border border-border-color transition-colors duration-200">
              <div className="absolute left-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-text-color" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Gezi noktası ara..."
                className="pl-10 pr-10 py-2.5 w-full bg-transparent text-text-color focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-200"
              />
              {searchQuery && (
                <div className="absolute right-3 flex items-center cursor-pointer" onClick={clearSearch}>
                  <svg className="h-5 w-5 text-text-color hover:text-primary transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Featured destinations showcase */}
        {selectedFilter === 'all' && !searchQuery && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-text-color">Öne Çıkan Gezi Noktaları</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularDestinations
                .filter(dest => dest.featured)
                .map((destination, index) => (
                  <motion.div
                    key={destination.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <DestinationCard 
                      destination={destination} 
                      isFavorite={favorites.includes(destination.id)}
                      onFavoriteToggle={toggleFavorite}
                    />
                  </motion.div>
                ))}
            </div>
          </div>
        )}
        
        {/* All destinations */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-text-color">
            {searchQuery 
              ? `Arama Sonuçları: ${filteredDestinations.length} sonuç` 
              : selectedFilter !== 'all' 
                ? filterOptions.find(opt => opt.id === selectedFilter)?.label || 'Gezi Noktaları'
                : 'Tüm Gezi Noktaları'}
          </h2>
          
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-text-lighter mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-medium mb-2 text-text-color">Sonuç bulunamadı</h3>
              <p className="text-text-light">Farklı arama kriterleri deneyebilirsiniz.</p>
              <button 
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Aramayı Temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDestinations.map((destination, index) => (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 1) }}
                  className="relative"
                >
                  <DestinationCard 
                    destination={destination} 
                    isFavorite={favorites.includes(destination.id)}
                    onFavoriteToggle={toggleFavorite}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationsPage; 