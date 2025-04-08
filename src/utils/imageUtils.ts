import { useState, useEffect } from 'react';

// Mapping between image types and placeholder URLs
const placeholderMap: Record<string, string> = {
  'destination': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop',
  'accommodation': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600&auto=format&fit=crop',
  'attraction': 'https://images.unsplash.com/photo-1558383817-b015a37325fc?q=80&w=600&auto=format&fit=crop',
  'profile': 'https://ui-avatars.com/api/?background=6366F1&color=fff&size=128',
  'city': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=600&auto=format&fit=crop',
  'food': 'https://images.unsplash.com/photo-1571805529673-cf0039b0a610?q=80&w=600&auto=format&fit=crop',
  'nature': 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=600&auto=format&fit=crop',
  'event': 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop',
  'landmark': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=600&auto=format&fit=crop',
  'default': 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?q=80&w=600&auto=format&fit=crop'
};

// Placeholder city images for Turkish destinations
export const cityImageMap: Record<string, string> = {
  'Yozgat': 'https://live.staticflickr.com/4136/4931344567_6a894ebac0_b.jpg',
  'Malatya': 'https://upload.wikimedia.org/wikipedia/commons/0/01/Malatya_view.jpg',
  'Sivas': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Sivas_Turkey.jpg',
  'İstanbul': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop',
  'Ankara': 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Ankara_Castle_-_Ankara%2C_Turkey.jpg',
  'İzmir': 'https://upload.wikimedia.org/wikipedia/commons/1/13/Konak_Square_-_Izmir%2C_Turkey.jpg',
  'Antalya': 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Antalya_Harbour.jpg',
  'Nevşehir': 'https://upload.wikimedia.org/wikipedia/commons/7/76/Hot_air_balloons_over_Cappadocia_2.jpg',
  'Trabzon': 'https://upload.wikimedia.org/wikipedia/commons/3/36/Trabzon_Turkey.jpg',
  'default': 'https://images.unsplash.com/photo-1529335764857-3f1164d1cb24?q=80&w=800&auto=format&fit=crop'
};

// Attraction images
export const attractionImageMap: Record<string, string> = {
  'Çamlık Milli Parkı': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Caml%C4%B1k_National_Park_in_Yozgat.jpg/1280px-Caml%C4%B1k_National_Park_in_Yozgat.jpg',
  'Sarıkaya Roma Hamamı': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Basilica_Therma_Roman_Bath_Sarıkaya_Yozgat.jpg/1280px-Basilica_Therma_Roman_Bath_Sarıkaya_Yozgat.jpg',
  'Aslantepe Höyüğü': 'https://upload.wikimedia.org/wikipedia/commons/8/89/Arslantepe_01.jpg',
  'Battalgazi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Battalgazi_Ulu_Cami.jpg/1280px-Battalgazi_Ulu_Cami.jpg',
  'Divriği Ulu Camii': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Divri%C4%9Fi_Ulu_Camii_ve_Dar%C3%BC%C5%9F%C5%9Fifas%C4%B1_%286%29.jpg/1280px-Divri%C4%9Fi_Ulu_Camii_ve_Dar%C3%BC%C5%9F%C5%9Fifas%C4%B1_%286%29.jpg',
  'Gök Medrese': 'https://upload.wikimedia.org/wikipedia/commons/4/48/G%C3%B6k_Medresesi-Portal.jpg',
  'default': 'https://images.unsplash.com/photo-1499359875449-10bbeb21501e?q=80&w=600&auto=format&fit=crop'
};

// Get a placeholder image URL based on type
export const getPlaceholderImage = (type: string = 'default'): string => {
  return placeholderMap[type] || placeholderMap.default;
};

// Get a city image or fallback to default
export const getCityImage = (cityName: string): string => {
  return cityImageMap[cityName] || cityImageMap.default;
};

// Get attraction image
export const getAttractionImage = (attractionName: string): string => {
  return attractionImageMap[attractionName] || attractionImageMap.default;
};

// Hook to use images with fallbacks
export const useImage = (imageUrl: string | undefined, type: string = 'default') => {
  const [src, setSrc] = useState<string>(imageUrl || getPlaceholderImage(type));
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!imageUrl) {
      setSrc(getPlaceholderImage(type));
      setLoading(false);
      return;
    }

    if (imageUrl.startsWith('http')) {
      setSrc(imageUrl);
    } else {
      // Handle relative URLs, assuming they're in public/images directory
      setSrc(`/images/${imageUrl}`);
    }

    const img = new Image();
    
    img.onload = () => {
      setLoading(false);
      setError(false);
    };
    
    img.onerror = () => {
      setSrc(getPlaceholderImage(type));
      setLoading(false);
      setError(true);
    };

    img.src = src;
  }, [imageUrl, type]);

  return { src, error, loading };
};

// Generate avatar image based on name
export const getAvatarUrl = (firstName: string, lastName: string, isDarkMode: boolean = false): string => {
  return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=${isDarkMode ? '7F5AF0' : '6366F1'}&color=fff&size=128`;
};

// Get random featured image
export const getRandomFeaturedImage = (): string => {
  const featuredImages = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Anit_Kabir_Ankara_Turkey.jpg/1280px-Anit_Kabir_Ankara_Turkey.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Hot_air_balloons_over_Cappadocia_2.jpg/1280px-Hot_air_balloons_over_Cappadocia_2.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Istanbul_Levent_skyline-croped.jpg/1280px-Istanbul_Levent_skyline-croped.jpg',
    'https://live.staticflickr.com/4136/4931344567_6a894ebac0_b.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/e/ef/Sivas_Turkey.jpg'
  ];
  
  const randomIndex = Math.floor(Math.random() * featuredImages.length);
  return featuredImages[randomIndex];
}; 