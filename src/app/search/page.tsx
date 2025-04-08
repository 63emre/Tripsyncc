"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import DestinationCard from '@/components/DestinationCard';
import { popularDestinations } from '@/utils/dummyData';
import { Destination } from '@/types';

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate search with delay
    setLoading(true);
    
    const searchTimer = setTimeout(() => {
      if (query) {
        // Filter destinations based on query
        const filteredResults = popularDestinations.filter(
          (destination) =>
            destination.name.toLowerCase().includes(query.toLowerCase()) ||
            destination.country.toLowerCase().includes(query.toLowerCase()) ||
            destination.city.toLowerCase().includes(query.toLowerCase()) ||
            destination.description.toLowerCase().includes(query.toLowerCase())
        );
        
        setResults(filteredResults);
      } else {
        setResults(popularDestinations);
      }
      
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(searchTimer);
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Arama Sonuçları</h1>
          <SearchBar />
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="text-gray-600">Aranıyor...</div>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              "{query}" için sonuç bulunamadı
            </h2>
            <p className="text-gray-600">
              Farklı anahtar kelimelerle tekrar aramayı deneyin veya filtreleri değiştirin.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-700">
                {query ? `"${query}" için ${results.length} sonuç bulundu` : 'Tüm destinasyonlar'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          </>
        )}
        
        {/* Filters on desktop */}
        <div className="hidden lg:block fixed right-8 top-32 w-64 bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filtreler</h3>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Fiyat Aralığı</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                <span className="ml-2 text-gray-700">₺ (Ekonomik)</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                <span className="ml-2 text-gray-700">₺₺ (Orta)</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                <span className="ml-2 text-gray-700">₺₺₺ (Lüks)</span>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Konaklama Türü</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                <span className="ml-2 text-gray-700">Otel</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                <span className="ml-2 text-gray-700">Apart</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                <span className="ml-2 text-gray-700">Pansiyon</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                <span className="ml-2 text-gray-700">Butik Otel</span>
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage; 