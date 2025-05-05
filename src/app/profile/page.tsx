"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BiEdit, BiUser, BiEnvelope, BiPhone, BiMapPin, BiCalendar } from 'react-icons/bi';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { get, put, uploadFile } from '@/lib/api';
import Input from '@/components/Input';

type ProfileFormData = {
  name: string;
  email: string;
  bio: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  dateOfBirth: string;
};

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    bio: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: '',
    dateOfBirth: '',
  });

  const [notifications] = useState([
    {
      id: 1,
      title: 'Rezervasyon Onayı',
      message: 'İstanbul seyahatiniz için rezervasyonunuz onaylandı!',
      date: '1 saat önce',
      isRead: false,
    },
    {
      id: 2,
      title: 'İndirim Fırsatı',
      message: 'Size özel %15 indirim fırsatını kaçırmayın!',
      date: '3 saat önce',
      isRead: true,
    },
    {
      id: 3,
      title: 'Ödeme Hatırlatması',
      message: 'Yaklaşan seyahatinizin ödemesi 3 gün içinde bekleniyor.',
      date: '1 gün önce',
      isRead: true,
    },
  ]);

  // Kullanıcı oturum açmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Kullanıcı verilerini form state'ine aktarma
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.profile?.bio || '',
        phoneNumber: user.profile?.phoneNumber || '',
        address: user.profile?.address || '',
        city: user.profile?.city || '',
        country: user.profile?.country || '',
        dateOfBirth: user.profile?.dateOfBirth 
          ? new Date(user.profile.dateOfBirth).toISOString().split('T')[0]
          : '',
      });
    }
  }, [user]);

  // Form input değişikliklerini işleme
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Profil resmini yükleme
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Dosya boyutu kontrolü (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'tan küçük olmalıdır.');
        return;
      }
      
      const formData = new FormData();
      formData.append('avatar', file);
      
      try {
        setIsImageUploading(true);
        const response = await uploadFile<{profile: { avatar: string }}>(
          '/uploads/profile', 
          formData
        );
        
        // Kullanıcı profilini güncelle
        if (user && response.profile.avatar) {
          updateUser({
            profile: {
              ...user.profile,
              avatar: response.profile.avatar,
            }
          });
        }
      } catch (error) {
        console.error('Profil resmi yükleme hatası:', error);
        alert('Profil resmi yüklenirken bir hata oluştu.');
      } finally {
        setIsImageUploading(false);
      }
    }
  };

  // Profili güncelleme
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      const response = await put('/users/profile', {
        name: formData.name,
        bio: formData.bio,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        dateOfBirth: formData.dateOfBirth || null,
      });
      
      // Kullanıcı bilgilerini güncelle
      if (response.user) {
        updateUser(response.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      alert('Profil güncellenirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profil Kartı */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-card-bg rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                    {user.profile?.avatar ? (
                      <img 
                        src={user.profile.avatar} 
                        alt={user.name || 'Profil'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <BiUser size={64} />
                      </div>
                    )}
                  </div>
                  
                  {/* Resim yükleme butonu */}
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-4 right-0 bg-primary hover:bg-primary-dark text-white rounded-full p-2 shadow-lg transition-colors"
                    disabled={isImageUploading}
                  >
                    <BiEdit size={18} />
                  </button>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                <h1 className="text-2xl font-bold">{user.name || 'Kullanıcı'}</h1>
                <p className="text-muted mt-1">{user.email}</p>
                
                {user.profile?.bio && (
                  <p className="mt-4 text-text-color">
                    {user.profile.bio}
                  </p>
                )}
              </div>
              
              <div className="border-t border-border-color pt-4">
                <h3 className="font-semibold mb-2">Bildirimler</h3>
                <div className="space-y-3">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`p-3 rounded-md ${notification.isRead ? 'bg-card-bg' : 'bg-primary/5'}`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-muted">{notification.date}</span>
                      </div>
                      <p className="text-sm text-muted mt-1">{notification.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-card-bg rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-4">Hızlı Bağlantılar</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/messages" className="text-primary hover:underline">Mesajlar</a>
                </li>
                <li>
                  <a href="/listing/new" className="text-primary hover:underline">İlan Ekle</a>
                </li>
                <li>
                  <a href="/friends" className="text-primary hover:underline">Arkadaşlar</a>
                </li>
              </ul>
            </div>
          </motion.div>
          
          {/* Profil Detayları */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-card-bg rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Profil Bilgileri</h2>
                <button 
                  className="text-primary hover:text-primary-dark"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'İptal' : 'Düzenle'} <BiEdit className="inline ml-1" />
                </button>
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <Input
                      label="Ad Soyad"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      icon={<BiUser className="text-gray-400" />}
                    />
                    
                    <Input
                      label="E-posta"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      readOnly
                      icon={<BiEnvelope className="text-gray-400" />}
                    />
                    
                    <div className="form-group">
                      <label className="block text-text-color mb-2">Hakkımda</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-3 border border-border-color rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-background"
                      ></textarea>
                    </div>
                    
                    <Input
                      label="Telefon"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      icon={<BiPhone className="text-gray-400" />}
                    />
                    
                    <Input
                      label="Adres"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      icon={<BiMapPin className="text-gray-400" />}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Şehir"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        icon={<BiMapPin className="text-gray-400" />}
                      />
                      
                      <Input
                        label="Ülke"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        icon={<BiMapPin className="text-gray-400" />}
                      />
                    </div>
                    
                    <Input
                      label="Doğum Tarihi"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      icon={<BiCalendar className="text-gray-400" />}
                    />
                    
                    <div className="flex justify-end mt-6">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="text-muted">Ad Soyad</div>
                    <div className="col-span-2">{user.name || '-'}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="text-muted">E-posta</div>
                    <div className="col-span-2">{user.email}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="text-muted">Hakkımda</div>
                    <div className="col-span-2">{user.profile?.bio || '-'}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="text-muted">Telefon</div>
                    <div className="col-span-2">{user.profile?.phoneNumber || '-'}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="text-muted">Adres</div>
                    <div className="col-span-2">{user.profile?.address || '-'}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="text-muted">Şehir</div>
                    <div className="col-span-2">{user.profile?.city || '-'}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="text-muted">Ülke</div>
                    <div className="col-span-2">{user.profile?.country || '-'}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="text-muted">Doğum Tarihi</div>
                    <div className="col-span-2">
                      {user.profile?.dateOfBirth 
                        ? new Date(user.profile.dateOfBirth).toLocaleDateString() 
                        : '-'}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-card-bg rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">İlanlarım</h2>
              <p className="text-center py-6 text-muted">
                Henüz hiç ilanınız yok. Yeni bir ilan oluşturmak için <a href="/listing/new" className="text-primary hover:underline">tıklayın</a>.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;