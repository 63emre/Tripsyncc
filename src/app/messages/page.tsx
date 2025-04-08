"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProviderClient';
import { dummyFriends, dummyMessages } from '@/utils/dummyData';
import { Friend } from '@/types';

interface Conversation {
  friend: Friend;
  lastMessage: {
    content: string;
    timestamp: Date;
    isUnread: boolean;
  };
}

const MessagesIndexPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [orientation, setOrientation] = useState<'grid' | 'list'>('list');
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  useEffect(() => {
    // Build conversations from dummy data
    const convoList: Conversation[] = [];
    
    // For each friend with messages
    Object.keys(dummyMessages).forEach((friendId) => {
      const friend = dummyFriends.find(f => f.id === friendId);
      
      if (friend) {
        const messages = dummyMessages[friendId as keyof typeof dummyMessages];
        
        if (messages.length > 0) {
          // Sort messages by date (newest first)
          const sortedMessages = [...messages].sort((a, b) => 
            b.timestamp.getTime() - a.timestamp.getTime()
          );
          
          const lastMessage = sortedMessages[0];
          
          convoList.push({
            friend,
            lastMessage: {
              content: lastMessage.content,
              timestamp: lastMessage.timestamp,
              isUnread: !lastMessage.isRead && lastMessage.senderId !== "1",
            }
          });
        }
      }
    });
    
    // Sort conversations by date (newest first)
    convoList.sort((a, b) => 
      b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()
    );
    
    setConversations(convoList);
  }, []);
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      // Today - show time
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (today.getTime() - messageDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
      // This week - show day name
      const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
      return days[date.getDay()];
    } else {
      // Older - show date
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    }
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(convo => {
    const fullName = `${convo.friend.firstName} ${convo.friend.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           convo.friend.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Generate avatar images based on names
  const getAvatarUrl = (firstName: string, lastName: string) => {
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=${isDarkMode ? '7F5AF0' : '6366F1'}&color=fff&size=128`;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header with search and orientation toggles */}
          <div className={`px-6 py-5 border-b border-border-color flex flex-col md:flex-row md:items-center justify-between gap-4 ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
            <div className="flex items-center">
              <motion.h1 
                className="text-2xl font-bold text-text-color"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Mesajlar
              </motion.h1>
              
              {/* Message notification icon */}
              <motion.div 
                className="ml-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <span className="relative inline-block">
                  <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-card-bg animate-pulse"></span>
                </span>
              </motion.div>
            </div>
            
            <div className="flex items-center justify-between space-x-4">
              {/* Orientation toggle */}
              <div className="flex items-center space-x-2 p-1 rounded-lg border border-border-color">
                <button 
                  onClick={() => setOrientation('list')}
                  className={`p-2 rounded ${orientation === 'list' ? 'bg-primary text-white' : 'text-text-light hover:text-primary'} transition-colors duration-200`}
                  title="Liste görünümü"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={() => setOrientation('grid')}
                  className={`p-2 rounded ${orientation === 'grid' ? 'bg-primary text-white' : 'text-text-light hover:text-primary'} transition-colors duration-200`}
                  title="Izgara görünümü"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
              
              <div className="relative rounded-md w-full max-w-md flex items-center border border-border-color transition-colors duration-200">
                <div className="absolute left-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-text-color" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Arkadaş ara..."
                  className="pl-10 pr-10 py-2.5 w-full bg-transparent text-text-color focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-200"
                />
                {searchQuery && (
                  <div className="absolute right-3 flex items-center cursor-pointer" onClick={() => setSearchQuery('')}>
                    <svg className="h-5 w-5 text-text-color hover:text-primary transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Theme toggle on mobile when not in header */}
              <div className="block sm:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>
          
          {filteredConversations.length === 0 ? (
            <div className="text-center py-16 px-4">
              <motion.div 
                className={`h-20 w-20 rounded-full mx-auto flex items-center justify-center mb-4 ${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <svg 
                  className="h-10 w-10 text-primary" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                  />
                </svg>
              </motion.div>
              <motion.h3 
                className="text-lg font-medium mb-3 text-text-color"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {searchQuery ? 'Arama sonucu bulunamadı' : 'Hiç mesajınız yok'}
              </motion.h3>
              <motion.p 
                className="text-base max-w-md mx-auto mb-8 text-text-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {searchQuery 
                  ? 'Arama kriterlerinize uygun bir konuşma bulunamadı. Lütfen arama terimlerinizi değiştirin.'
                  : 'Arkadaşlarla sohbet etmek için arkadaşlar sayfasını ziyaret edin.'
                }
              </motion.p>
              {!searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link 
                    href="/friends" 
                    className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  >
                    Arkadaşlara Git
                  </Link>
                </motion.div>
              )}
            </div>
          ) : (
            <>
              {orientation === 'list' ? (
                <ul className="divide-y divide-border-color">
                  {filteredConversations.map((convo, index) => (
                    <motion.li 
                      key={convo.friend.id} 
                      className="hover:bg-primary/5 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link 
                        href={`/messages/${convo.friend.id}`}
                        className="block relative"
                      >
                        <div className="px-6 py-4 flex items-center space-x-4">
                          <div className="relative">
                            <img 
                              src={getAvatarUrl(convo.friend.firstName, convo.friend.lastName)} 
                              alt={`${convo.friend.firstName} ${convo.friend.lastName}`}
                              className="h-14 w-14 rounded-full object-cover"
                            />
                            {convo.lastMessage.isUnread && (
                              <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-primary ring-2 ring-card-bg animate-pulse" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h2 className={`text-base truncate ${convo.lastMessage.isUnread ? 'font-bold' : 'font-medium'} text-text-color`}>
                                {convo.friend.firstName} {convo.friend.lastName}
                              </h2>
                              <p className={`text-sm ${convo.lastMessage.isUnread ? 'text-primary font-medium' : 'text-text-light'}`}>
                                {formatDate(convo.lastMessage.timestamp)}
                              </p>
                            </div>
                            <p className={`text-sm truncate ${convo.lastMessage.isUnread ? 'font-semibold text-text-color' : 'text-text-light'}`} style={{ maxWidth: '90%' }}>
                              {convo.lastMessage.content}
                            </p>
                          </div>
                          
                          <div className="text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {filteredConversations.map((convo, index) => (
                    <motion.div
                      key={convo.friend.id}
                      className="card hover:bg-primary/5 transition-colors overflow-hidden"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link href={`/messages/${convo.friend.id}`} className="block h-full">
                        <div className="p-4 flex flex-col items-center text-center">
                          <div className="relative mb-3">
                            <img 
                              src={getAvatarUrl(convo.friend.firstName, convo.friend.lastName)} 
                              alt={`${convo.friend.firstName} ${convo.friend.lastName}`}
                              className="h-20 w-20 rounded-full object-cover"
                            />
                            {convo.lastMessage.isUnread && (
                              <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-primary ring-2 ring-card-bg animate-pulse" />
                            )}
                          </div>
                          
                          <h2 className={`text-lg ${convo.lastMessage.isUnread ? 'font-bold' : 'font-medium'} text-text-color`}>
                            {convo.friend.firstName} {convo.friend.lastName}
                          </h2>
                          
                          <p className={`text-sm mt-1 ${convo.lastMessage.isUnread ? 'text-primary' : 'text-text-light'}`}>
                            {formatDate(convo.lastMessage.timestamp)}
                          </p>
                          
                          <p className={`text-sm mt-3 line-clamp-2 ${convo.lastMessage.isUnread ? 'font-semibold text-text-color' : 'text-text-light'}`}>
                            {convo.lastMessage.content}
                          </p>
                          
                          <div className="mt-4 w-full">
                            <span className={`inline-flex items-center justify-center w-full px-3 py-1 text-xs rounded-full ${
                              convo.lastMessage.isUnread 
                                ? 'bg-primary/20 text-primary font-medium' 
                                : 'bg-border-color text-text-light'
                            }`}>
                              {convo.lastMessage.isUnread ? 'Okunmamış mesaj' : 'Son mesaj'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default MessagesIndexPage; 