"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { dummyUser } from '@/utils/dummyData';
import Image from '@/components/Image';
import { useTheme } from '@/components/ThemeProviderClient';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'favorites'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: dummyUser.firstName,
    lastName: dummyUser.lastName,
    email: dummyUser.email,
    phone: dummyUser.phone,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Save profile logic would go here
    setIsEditing(false);
  };

  const handleReservation = () => {
    router.push('/payment');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 relative">
      {/* Dark mode background stars effect */}
      {isDarkMode && (
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
          <div className="stars-animate absolute h-2 w-2 bg-white rounded-full" style={{ top: '20%', left: '20%', opacity: 0.5 }}></div>
          <div className="stars-animate absolute h-2 w-2 bg-white rounded-full" style={{ top: '30%', left: '70%', opacity: 0.7 }}></div>
          <div className="stars-animate-delayed absolute h-1 w-1 bg-white rounded-full" style={{ top: '65%', left: '40%', opacity: 0.6 }}></div>
          <div className="stars-animate-delayed absolute h-3 w-3 bg-white rounded-full" style={{ top: '15%', left: '60%', opacity: 0.3 }}></div>
          <div className="stars-animate absolute h-2 w-2 bg-white rounded-full" style={{ top: '75%', left: '85%', opacity: 0.5 }}></div>
          <div className="stars-animate-delayed absolute h-1 w-1 bg-white rounded-full" style={{ top: '45%', left: '15%', opacity: 0.4 }}></div>
        </div>
      )}
      
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div 
          className="card overflow-hidden dark:bg-gray-800/80 dark:backdrop-blur-sm dark:border dark:border-gray-700 transition-colors duration-200 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`px-4 py-5 sm:px-6 flex items-center justify-between ${
            isDarkMode 
              ? 'bg-gradient-to-r from-violet-900/30 to-gray-800/50 backdrop-blur-sm' 
              : 'bg-gradient-to-r from-[#f5f0ff] to-white'
          } transition-colors duration-200`}>
            <div>
              <h1 className="text-2xl font-bold dark:text-white transition-colors duration-200">Profil</h1>
              <p className="mt-1 max-w-2xl text-sm dark:text-gray-300 transition-colors duration-200">
                Kişisel bilgilerinizi görüntüleyin ve düzenleyin
              </p>
            </div>
            
            {activeTab === 'profile' && !isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outlined"
              >
                Düzenle
              </Button>
            )}
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <motion.button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'profile'
                    ? 'border-[#9370DB] text-[#9370DB] dark:border-violet-500 dark:text-violet-400'
                    : 'border-transparent text-gray-600 hover:text-[#9370DB] dark:text-gray-300 dark:hover:text-violet-400 hover:border-[#9370DB] dark:hover:border-violet-500 transition-colors'
                }`}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Profil Bilgileri
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'bookings'
                    ? 'border-[#9370DB] text-[#9370DB] dark:border-violet-500 dark:text-violet-400'
                    : 'border-transparent text-gray-600 hover:text-[#9370DB] dark:text-gray-300 dark:hover:text-violet-400 hover:border-[#9370DB] dark:hover:border-violet-500 transition-colors'
                }`}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Rezervasyonlarım
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('favorites')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'favorites'
                    ? 'border-[#9370DB] text-[#9370DB] dark:border-violet-500 dark:text-violet-400'
                    : 'border-transparent text-gray-600 hover:text-[#9370DB] dark:text-gray-300 dark:hover:text-violet-400 hover:border-[#9370DB] dark:hover:border-violet-500 transition-colors'
                }`}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Favorilerim
              </motion.button>
            </nav>
          </div>
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="px-6 py-6">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <Input
                      label="Ad"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Soyad"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="E-posta"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Telefon"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                    >
                      İptal
                    </Button>
                    <Button type="submit">Kaydet</Button>
                  </div>
                </form>
              ) : (
                <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm rounded-lg transition-colors duration-200 shadow">
                  <div className="flex flex-col md:flex-row">
                    <motion.div 
                      className="md:w-1/3 p-4 md:p-6 flex justify-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        <Image
                          src={dummyUser.profileImage}
                          alt={`${dummyUser.firstName} ${dummyUser.lastName}`}
                          type="profile"
                          containerClassName="h-48 w-48"
                          className="rounded-full shadow-lg border-4 border-white dark:border-gray-700"
                        />
                      </motion.div>
                    </motion.div>
                    <div className="md:w-2/3 p-4 md:p-6">
                      <dl className="divide-y divide-gray-100 dark:divide-gray-700 transition-colors duration-200">
                        <div className="py-4 flex flex-col sm:flex-row">
                          <dt className="text-sm font-medium w-full sm:w-1/3 text-gray-700 dark:text-gray-300 transition-colors duration-200">Ad Soyad</dt>
                          <dd className="text-sm sm:w-2/3 font-medium text-gray-900 dark:text-white transition-colors duration-200">
                            {dummyUser.firstName} {dummyUser.lastName}
                          </dd>
                        </div>
                        <div className="py-4 flex flex-col sm:flex-row">
                          <dt className="text-sm font-medium w-full sm:w-1/3 text-gray-700 dark:text-gray-300 transition-colors duration-200">E-posta adresi</dt>
                          <dd className="text-sm sm:w-2/3 font-medium text-gray-900 dark:text-white transition-colors duration-200">
                            {dummyUser.email}
                          </dd>
                        </div>
                        <div className="py-4 flex flex-col sm:flex-row">
                          <dt className="text-sm font-medium w-full sm:w-1/3 text-gray-700 dark:text-gray-300 transition-colors duration-200">Telefon</dt>
                          <dd className="text-sm sm:w-2/3 font-medium text-gray-900 dark:text-white transition-colors duration-200">
                            {dummyUser.phone}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="px-6 py-6">
              <div className="text-center py-12 bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm rounded-lg transition-colors duration-200 shadow">
                <div className={`${
                  isDarkMode ? 'bg-violet-900/30' : 'bg-[#f5f0ff]'
                } h-20 w-20 rounded-full mx-auto flex items-center justify-center mb-4 transition-colors duration-200`}>
                  <svg className="h-10 w-10 text-[#9370DB] dark:text-violet-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2 dark:text-white transition-colors duration-200">Henüz bir rezervasyon yapmadınız</h3>
                <p className="max-w-md mx-auto mb-6 dark:text-gray-300 transition-colors duration-200">
                  Hemen yeni bir tatil planlamak için rezervasyon yapabilirsiniz.
                </p>
                <Button onClick={handleReservation}>
                  Rezervasyon Yap
                </Button>
              </div>
            </div>
          )}
          
          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="px-6 py-6">
              <div className="text-center py-12 bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm rounded-lg transition-colors duration-200 shadow">
                <div className={`${
                  isDarkMode ? 'bg-violet-900/30' : 'bg-[#f5f0ff]'
                } h-20 w-20 rounded-full mx-auto flex items-center justify-center mb-4 transition-colors duration-200`}>
                  <svg className="h-10 w-10 text-[#9370DB] dark:text-violet-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2 dark:text-white transition-colors duration-200">Henüz favorileriniz yok</h3>
                <p className="max-w-md mx-auto mb-6 dark:text-gray-300 transition-colors duration-200">
                  Hemen yeni bir seyahat planı oluşturun ve ödeme yapın.
                </p>
                <Button onClick={handleReservation}>
                  Rezervasyon Yap
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ProfilePage; 