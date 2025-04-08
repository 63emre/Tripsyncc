"use client";

import React, { useState, useEffect } from 'react';
import { Destination } from '../types';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from '@/components/Image';
import { getCityImage } from '@/utils/imageUtils';

interface DestinationCardProps {
  destination: Destination;
  className?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  className = '',
  isFavorite = false,
  onFavoriteToggle
}) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(isFavorite);
  
  // Update local favorite state when prop changes
  useEffect(() => {
    setLocalFavorite(isFavorite);
  }, [isFavorite]);
  
  const handleNavigate = () => {
    router.push(`/destination/${destination.id}`);
  };

  // Use the first image from the destination images, or get a city image as fallback
  const imageToUse = destination.images && destination.images.length > 0 
    ? destination.images[0] 
    : getCityImage(destination.city);
    
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(destination.id);
    } else {
      setLocalFavorite(!localFavorite);
    }
  };

  return (
    <motion.div 
      className={`rounded-lg overflow-hidden transition-all duration-300 bg-white dark:bg-gray-800 dark:text-gray-100 h-full flex flex-col card cursor-pointer ${className}`}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={handleNavigate}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="h-48 relative overflow-hidden">
        {/* Image with fallback */}
        <motion.div 
          className="absolute inset-0 z-0"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <Image 
            src={imageToUse}
            alt={destination.name}
            type="destination"
            className="w-full h-full object-cover"
            containerClassName="absolute inset-0"
          />
        </motion.div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.3)] z-10"></div>
        
        {/* Featured badge */}
        {destination.featured && (
          <motion.div 
            className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full z-20 flex items-center space-x-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.2 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
            </svg>
            <span>Öne Çıkan</span>
          </motion.div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold">{destination.name}</h3>
          <motion.div 
            className="flex items-center px-2 py-1 rounded-full"
            style={{ backgroundColor: 'var(--primary-light)', opacity: 0.2 }}
            whileHover={{ scale: 1.1 }}
          >
            <span className="text-primary">★</span>
            <span className="ml-1 text-sm font-medium text-primary">{destination.rating}</span>
          </motion.div>
        </div>
        
        <p className="text-sm mt-1 mb-2 text-gray-600 dark:text-gray-300">{destination.city}, {destination.country}</p>
        <p className="text-sm mb-4 flex-grow text-gray-600 dark:text-gray-300">{destination.shortDescription}</p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <span className="text-sm px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--primary-light)', opacity: 0.1 }}>
            {destination.accommodationType}
          </span>
          <span className="font-semibold text-primary">{destination.priceRange}</span>
        </div>
      </div>
      
      {/* Favorite button (only visible when component is in control of favorites) */}
      {!onFavoriteToggle && (
        <motion.button
          className="absolute top-3 right-3 z-30 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavoriteToggle}
        >
          <AnimatePresence mode="wait">
            {localFavorite ? (
              <motion.svg
                key="filled"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-amber-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </motion.svg>
            ) : (
              <motion.svg
                key="outline"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </motion.div>
  );
};

export default DestinationCard; 