"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeProviderClient';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

interface Location {
  position: [number, number];
  name: string;
  description?: string;
}

interface MapComponentProps {
  height?: string;
  width?: string;
  zoom?: number;
  center?: [number, number];
  locations?: Location[];
}

// Dynamically import the map components with SSR disabled
const MapWithNoSSR = dynamic(
  () => import('./MapComponentClient.tsx'),
  { 
    ssr: false,
    loading: () => (
      <div 
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
        style={{ height: '400px', width: '100%' }}
      >
        <p>Loading map...</p>
      </div>
    ) 
  }
);

const MapComponent: React.FC<MapComponentProps> = (props) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className="rounded-lg overflow-hidden shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MapWithNoSSR {...props} theme={theme} />
    </motion.div>
  );
};

export default MapComponent;