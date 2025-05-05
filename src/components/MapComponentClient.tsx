"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  position: [number, number];
  name: string;
  description?: string;
}

interface MapComponentClientProps {
  height?: string;
  width?: string;
  zoom?: number;
  center?: [number, number];
  locations?: Location[];
  theme?: string;
}

// Recenter map on center prop change
const RecenterAutomatically = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const MapComponentClient: React.FC<MapComponentClientProps> = ({
  height = '400px',
  width = '100%',
  zoom = 3,
  center = [20, 0],
  locations = [],
  theme = 'light'
}) => {
  const isDarkMode = theme === 'dark';
  
  // Fix Leaflet default icon issue in Next.js
  useEffect(() => {
    // This is needed to properly display the default marker icon
    const L = require('leaflet');
    
    delete L.Icon.Default.prototype._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: ''
    });
  }, []);
  
  // Create themed custom marker icon
  const createCustomMarker = (isDark = false) => {
    // Only create custom icons when running in browser
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      return new L.DivIcon({
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
    }
    return null;
  };
  
  const [customIcon, setCustomIcon] = useState<any>(null);
  
  // Update marker when theme changes, but only on client
  useEffect(() => {
    setCustomIcon(createCustomMarker(isDarkMode));
  }, [isDarkMode]);

  return (
    <div>
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
            icon={customIcon || undefined}
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
    </div>
  );
};

export default MapComponentClient;