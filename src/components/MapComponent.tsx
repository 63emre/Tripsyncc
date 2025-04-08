"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from './ThemeProviderClient';
import { motion } from 'framer-motion';

interface Location {
  position: LatLngExpression;
  name: string;
  description?: string;
}

interface MapComponentProps {
  height?: string;
  width?: string;
  zoom?: number;
  center?: LatLngExpression;
  locations?: Location[];
}

// Recenter map on center prop change
const RecenterAutomatically = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  height = '400px',
  width = '100%',
  zoom = 3,
  center = [20, 0],
  locations = []
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Create themed custom marker icon
  const createCustomMarker = (isDark = false) => {
    return new DivIcon({
      className: '', 
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -42],
      html: `
        <div class="map-marker ${isDark ? 'map-marker-dark' : ''}">
          <div class="map-marker-pin"></div>
          <div class="map-marker-pulse"></div>
        </div>
      `
    });
  };
  
  const [customIcon, setCustomIcon] = useState(createCustomMarker(isDarkMode));
  
  // Update marker when theme changes
  useEffect(() => {
    setCustomIcon(createCustomMarker(isDarkMode));
  }, [isDarkMode]);

  return (
    <motion.div
      className={`rounded-lg overflow-hidden shadow-md`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height, width }}
        className={isDarkMode ? 'dark-map' : ''}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={isDarkMode 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />
        <RecenterAutomatically center={center} />
        
        {locations.map((location, index) => (
          <Marker 
            key={`${location.name}-${index}`} 
            position={location.position}
            icon={customIcon}
          >
            <Popup>
              <div>
                <h3 className="text-base font-semibold mb-1">{location.name}</h3>
                {location.description && (
                  <p className="text-sm">{location.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  );
};

export default MapComponent; 