"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Input from '@/components/Input';
import Button from '@/components/Button';

const NewListingPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    country: '',
    city: '',
    address: '',
    postalCode: '',
    price: '',
    capacity: '',
    roomCount: '',
    description: '',
    category: 'apartment', // Default category
    amenities: {
      wifi: false,
      kitchen: false,
      ac: false,
      tv: false,
      parking: false,
      washingMachine: false,
    },
  });
  
  const [errors, setErrors] = useState({
    title: '',
    country: '',
    city: '',
    address: '',
    postalCode: '',
    price: '',
    capacity: '',
    roomCount: '',
    description: '',
    photos: '',
  });

  // Add state for photos
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [name]: checked,
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validate file types and sizes
      const validFiles = files.filter(file => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const validSize = 10 * 1024 * 1024; // 10MB
        
        return validTypes.includes(file.type) && file.size <= validSize;
      });
      
      if (validFiles.length !== files.length) {
        setErrors({
          ...errors,
          photos: 'Bazı dosyalar geçersiz. Lütfen dosya türü ve boyutunu kontrol edin.'
        });
      } else {
        setErrors({
          ...errors,
          photos: ''
        });
      }
      
      // Create preview URLs and update state
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      
      // Update state
      setPhotos(prevPhotos => [...prevPhotos, ...validFiles]);
      setPhotosPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(photosPreviews[index]);
    setPhotosPreviews(photosPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let valid = true;
    const newErrors = { ...errors };
    
    // Basic validation
    if (!formData.title) {
      newErrors.title = 'Başlık gereklidir';
      valid = false;
    }
    
    if (!formData.country) {
      newErrors.country = 'Ülke gereklidir';
      valid = false;
    }
    
    if (!formData.city) {
      newErrors.city = 'Şehir gereklidir';
      valid = false;
    }
    
    if (!formData.address) {
      newErrors.address = 'Adres gereklidir';
      valid = false;
    }
    
    if (!formData.postalCode) {
      newErrors.postalCode = 'Posta kodu gereklidir';
      valid = false;
    }
    
    if (!formData.price) {
      newErrors.price = 'Fiyat gereklidir';
      valid = false;
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Geçerli bir fiyat giriniz';
      valid = false;
    }
    
    if (!formData.capacity) {
      newErrors.capacity = 'Kişi sayısı gereklidir';
      valid = false;
    } else if (isNaN(Number(formData.capacity)) || Number(formData.capacity) <= 0) {
      newErrors.capacity = 'Geçerli bir kişi sayısı giriniz';
      valid = false;
    }
    
    if (!formData.roomCount) {
      newErrors.roomCount = 'Oda sayısı gereklidir';
      valid = false;
    } else if (isNaN(Number(formData.roomCount)) || Number(formData.roomCount) <= 0) {
      newErrors.roomCount = 'Geçerli bir oda sayısı giriniz';
      valid = false;
    }
    
    if (!formData.description) {
      newErrors.description = 'Açıklama gereklidir';
      valid = false;
    }
    
    if (photos.length === 0) {
      newErrors.photos = 'En az bir fotoğraf yüklemelisiniz';
      valid = false;
    }
    
    if (!valid) {
      setErrors(newErrors);
      return;
    }
    
    // Form is valid, submit to API
    setIsSubmitting(true);
    
    try {
      // Step 1: Create the listing
      const location = `${formData.address}, ${formData.city}, ${formData.country}, ${formData.postalCode}`;
      
      // Convert amenities object to array format expected by API
      const amenitiesArray = Object.entries(formData.amenities)
        .filter(([_, value]) => value)
        .map(([key]) => key);
      
      const listingResponse = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          capacity: Number(formData.capacity),
          roomCount: Number(formData.roomCount),
          location: location,
          category: formData.category,
          amenities: amenitiesArray
        })
      });
      
      if (!listingResponse.ok) {
        throw new Error('İlan oluşturma başarısız oldu');
      }
      
      const listingData = await listingResponse.json();
      const listingId = listingData.listing.id;
      
      // Step 2: Upload photos for the listing
      const uploadPromises = photos.map(async (photo, index) => {
        const formData = new FormData();
        formData.append('file', photo);
        formData.append('listingId', listingId);
        formData.append('isPrimary', index === 0 ? 'true' : 'false'); // First photo is primary
        
        const photoResponse = await fetch('/api/uploads/listing', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        if (!photoResponse.ok) {
          throw new Error(`Fotoğraf ${index + 1} yüklenemedi`);
        }
        
        return photoResponse.json();
      });
      
      await Promise.all(uploadPromises);
      
      // Success! Redirect to new listing
      router.push(`/destination/${listingId}`);
    } catch (error) {
      console.error('Submission error:', error);
      alert('İlan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      category: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">Yeni İlan Ekle</h1>
            <p className="mt-1 text-sm text-gray-600">
              Konaklamanız hakkında detaylı bilgi verin
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-900">Temel Bilgiler</h2>
                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input
                    label="İlan Başlığı"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="ör. Deniz Manzaralı Daire"
                    required
                    error={errors.title}
                    className="sm:col-span-2"
                  />
                  
                  <Input
                    label="Ülke"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="ör. Türkiye"
                    required
                    error={errors.country}
                  />
                  
                  <Input
                    label="Şehir"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="ör. İstanbul"
                    required
                    error={errors.city}
                  />
                  
                  <Input
                    label="Adres"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="ör. Atatürk Mah. Deniz Cad. No:15"
                    required
                    error={errors.address}
                    className="sm:col-span-2"
                  />
                  
                  <Input
                    label="Posta Kodu"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="ör. 34000"
                    required
                    error={errors.postalCode}
                  />
                </div>
              </div>
              
              {/* Capacity & Pricing */}
              <div className="pt-4 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Kapasite ve Fiyatlandırma</h2>
                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                  <Input
                    label="Fiyat (₺ / Gece)"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="ör. 350"
                    required
                    error={errors.price}
                  />
                  
                  <Input
                    label="Kişi Kapasitesi"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="ör. 4"
                    required
                    error={errors.capacity}
                  />
                  
                  <Input
                    label="Oda Sayısı"
                    name="roomCount"
                    type="number"
                    value={formData.roomCount}
                    onChange={handleChange}
                    placeholder="ör. 2"
                    required
                    error={errors.roomCount}
                  />
                </div>
              </div>
              
              {/* Description */}
              <div className="pt-4 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Açıklama</h2>
                <div className="mt-4">
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Detaylı Açıklama <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={5}
                      value={formData.description}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Konaklamanız hakkında detaylı bilgi verin..."
                      required
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                  </div>
                </div>
              </div>
              
              {/* Amenities */}
              <div className="pt-4 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Olanaklar</h2>
                <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center">
                    <input
                      id="wifi"
                      name="wifi"
                      type="checkbox"
                      checked={formData.amenities.wifi}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="wifi" className="ml-2 text-sm text-gray-700">
                      Wi-Fi
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="kitchen"
                      name="kitchen"
                      type="checkbox"
                      checked={formData.amenities.kitchen}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="kitchen" className="ml-2 text-sm text-gray-700">
                      Mutfak
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="ac"
                      name="ac"
                      type="checkbox"
                      checked={formData.amenities.ac}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="ac" className="ml-2 text-sm text-gray-700">
                      Klima
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="tv"
                      name="tv"
                      type="checkbox"
                      checked={formData.amenities.tv}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="tv" className="ml-2 text-sm text-gray-700">
                      TV
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="parking"
                      name="parking"
                      type="checkbox"
                      checked={formData.amenities.parking}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="parking" className="ml-2 text-sm text-gray-700">
                      Otopark
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="washingMachine"
                      name="washingMachine"
                      type="checkbox"
                      checked={formData.amenities.washingMachine}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="washingMachine" className="ml-2 text-sm text-gray-700">
                      Çamaşır Makinesi
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Photos Upload */}
              <div className="pt-4 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Fotoğraflar</h2>
                <div className="mt-4">
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Fotoğraf Yükle</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">veya sürükleyip bırakın</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF en fazla 10 MB
                      </p>
                    </div>
                  </div>
                  {photosPreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {photosPreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img src={preview} alt={`Photo ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            onClick={() => removePhoto(index)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.photos && <p className="mt-2 text-sm text-red-500">{errors.photos}</p>}
                </div>
              </div>
              
              {/* Submit */}
              <div className="pt-5 border-t border-gray-200">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => router.push('/home')}
                    className="mr-3"
                  >
                    İptal
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Yükleniyor...' : 'İlanı Yayınla'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewListingPage;