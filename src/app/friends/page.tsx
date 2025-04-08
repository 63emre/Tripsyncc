"use client";

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Button from '@/components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { dummyFriends } from '@/utils/dummyData';
import { Friend } from '@/types';

const FriendsPage: React.FC = () => {
  const [friends] = useState<Friend[]>(dummyFriends);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  
  // New state variables for the form
  const [friendEmail, setFriendEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const filteredFriends = friends.filter(
    (friend) =>
      friend.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = () => {
    // Reset states when opening modal
    setFriendEmail('');
    setEmailError('');
    setSuccessMessage('');
    setShowAddFriendModal(true);
  };

  const handleCloseModal = () => {
    // Only close if not currently submitting
    if (!isSubmitting) {
      setShowAddFriendModal(false);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendInvitation = () => {
    // Validate email
    if (!friendEmail.trim()) {
      setEmailError('E-posta adresi boş olamaz.');
      return;
    }

    if (!validateEmail(friendEmail)) {
      setEmailError('Geçerli bir e-posta adresi giriniz.');
      return;
    }

    // Check if already a friend
    if (friends.some(friend => friend.email === friendEmail)) {
      setEmailError('Bu kişi zaten arkadaş listenizde bulunuyor.');
      return;
    }

    // Clear any previous errors
    setEmailError('');
    
    // Set submitting state to prevent multiple submissions
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Arkadaşlık daveti başarıyla gönderildi.');
      
      // Clear form
      setFriendEmail('');
      
      // Close modal after success (with a short delay to show the success message)
      setTimeout(() => {
        setShowAddFriendModal(false);
        setSuccessMessage('');
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div 
          className="card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-color">Arkadaşlar</h1>
              <p className="mt-1 max-w-2xl text-sm text-text-light">
                Arkadaşlarınızı yönetin ve yeni bağlantılar kurun
              </p>
            </div>
            <Button onClick={handleOpenModal}>
              Arkadaş Ekle
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-border-color">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('friends')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'friends'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-light hover:text-text-color hover:border-border-color'
                } transition-colors duration-200`}
              >
                Arkadaşlarım
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-light hover:text-text-color hover:border-border-color'
                } transition-colors duration-200`}
              >
                Arkadaşlık İstekleri
              </button>
            </nav>
          </div>

          {/* Search */}
          <div className="px-4 py-4 border-b border-border-color">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:ring-primary focus:border-primary block w-full pl-4 pr-10 py-2 sm:text-sm border-border-color rounded-md bg-input-bg text-text-color"
                placeholder="Arkadaş ara..."
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-text-lighter"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Friends List */}
          {activeTab === 'friends' && (
            <div className="px-4 py-5 sm:p-0">
              {filteredFriends.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-text-lighter" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-text-color">Arkadaş bulunamadı</h3>
                  <p className="mt-1 text-sm text-text-light">
                    Aradığınız kriterlere uygun arkadaş bulunamadı.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border-color">
                  {filteredFriends.map((friend) => (
                    <motion.li 
                      key={friend.id} 
                      className="py-4 px-6 flex items-center hover:bg-primary/5 transition-colors duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs text-primary">[Profil]</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-sm font-medium text-text-color">{friend.firstName} {friend.lastName}</h2>
                            <p className="text-sm text-text-light">{friend.email}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outlined" 
                              className="text-xs px-3 py-1"
                              onClick={() => window.location.href = `/messages/${friend.id}`}
                            >
                              Mesaj Gönder
                            </Button>
                            <button
                              type="button"
                              className="text-text-lighter hover:text-red-500 transition-colors duration-200"
                              title="Kaldır"
                            >
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Friend Requests Tab */}
          {activeTab === 'requests' && (
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-text-lighter" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-text-color">Arkadaşlık isteği yok</h3>
                <p className="mt-1 text-sm text-text-light">
                  Şu anda bekleyen arkadaşlık isteğiniz bulunmuyor.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Add Friend Modal */}
      <AnimatePresence>
        {showAddFriendModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <motion.div 
                className="fixed inset-0 transition-opacity" 
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
              >
                <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
              </motion.div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>

              <motion.div 
                className="inline-block align-bottom bg-card-bg rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-border-color"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-card-bg px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-text-color" id="modal-title">
                        Arkadaş Ekle
                      </h3>
                      <div className="mt-4">
                        <input
                          type="email"
                          className={`w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-border-color'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-input-bg text-text-color`}
                          placeholder="E-posta adresi girin"
                          value={friendEmail}
                          onChange={(e) => {
                            setFriendEmail(e.target.value);
                            if (emailError) setEmailError('');
                          }}
                          disabled={isSubmitting}
                        />
                        {emailError && (
                          <p className="mt-1 text-sm text-red-500">{emailError}</p>
                        )}
                        {successMessage && (
                          <p className="mt-1 text-sm text-green-500">{successMessage}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-background px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-border-color">
                  <Button 
                    className="w-full sm:w-auto sm:ml-3"
                    onClick={handleSendInvitation}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Gönderiliyor...' : 'Davet Gönder'}
                  </Button>
                  <Button
                    variant="outlined"
                    className="mt-3 w-full sm:mt-0 sm:w-auto"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                  >
                    İptal
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FriendsPage; 