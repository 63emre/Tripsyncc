"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Button from '@/components/Button';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProviderClient';
import { dummyFriends, dummyMessages } from '@/utils/dummyData';
import { Friend, Message } from '@/types';

const MessagesPage: React.FC = () => {
  const params = useParams();
  const friendId = params.id as string;
  
  const [friend, setFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [orientation, setOrientation] = useState<'bubbles' | 'modern'>('bubbles');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  useEffect(() => {
    // Find friend from dummy data
    const foundFriend = dummyFriends.find(f => f.id === friendId);
    setFriend(foundFriend || null);
    
    // Load messages for this friend
    const friendMessages = dummyMessages[friendId as keyof typeof dummyMessages] || [];
    setMessages(friendMessages);
    
    // Scroll to bottom of messages
    scrollToBottom();
  }, [friendId]);
  
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !friend) return;
    
    // Create new message
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: "1", // Current user id
      receiverId: friend.id,
      content: newMessage,
      timestamp: new Date(),
      isRead: false,
    };
    
    // Add message to the list
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Scroll to new message
    scrollToBottom();
  };
  
  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    };
    return new Date(date).toLocaleDateString('tr-TR', options);
  };
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const dateKey = formatDate(message.timestamp);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  // Generate avatar images based on names
  const getAvatarUrl = (firstName: string, lastName: string) => {
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=${isDarkMode ? '7F5AF0' : '6366F1'}&color=fff&size=128`;
  };
  
  if (!friend) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div 
            className="card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold mb-4 text-text-color">Mesajlar</h1>
            <p className="text-lg text-text-light">Konuşma bulunamadı veya yüklenemedi.</p>
          </motion.div>
        </div>
      </div>
    );
  }
  
  const messageGroups = groupMessagesByDate();
  
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
          {/* Header */}
          <div className={`px-6 py-4 border-b border-border-color flex items-center justify-between ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
            <div className="flex items-center">
              <img 
                src={getAvatarUrl(friend.firstName, friend.lastName)} 
                alt={`${friend.firstName} ${friend.lastName}`}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="ml-4">
                <h1 className="text-xl font-bold text-text-color">{friend.firstName} {friend.lastName}</h1>
                <p className="text-sm text-text-light">{friend.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View orientation toggle */}
              <div className="flex items-center space-x-2 p-1 rounded-lg border border-border-color">
                <button 
                  onClick={() => setOrientation('bubbles')}
                  className={`p-2 rounded ${orientation === 'bubbles' ? 'bg-primary text-white' : 'text-text-light hover:text-primary'} transition-colors duration-200`}
                  title="Baloncuk görünümü"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setOrientation('modern')}
                  className={`p-2 rounded ${orientation === 'modern' ? 'bg-primary text-white' : 'text-text-light hover:text-primary'} transition-colors duration-200`}
                  title="Modern görünüm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
              </div>
              
              {/* Theme toggle on mobile when not in header */}
              <div className="block sm:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>
          
          {/* Messages container */}
          <div className={`p-6 h-[500px] overflow-y-auto ${isDarkMode ? 'bg-card-bg' : 'bg-gray-50'}`}>
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <motion.div 
                    className={`h-16 w-16 rounded-full mx-auto flex items-center justify-center mb-4 ${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </motion.div>
                  <motion.p 
                    className="text-lg font-medium mb-2 text-text-color"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Henüz mesaj yok
                  </motion.p>
                  <motion.p 
                    className="text-sm max-w-xs mx-auto text-text-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Konuşmaya şimdi başlayın!
                  </motion.p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(messageGroups).map(([date, msgs]) => (
                  <div key={date} className="space-y-4">
                    <div className="flex justify-center">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium shadow-sm ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'}`}>
                        {date}
                      </div>
                    </div>
                    
                    {msgs.map((message) => {
                      const isSentByMe = message.senderId === "1";
                      
                      if (orientation === 'bubbles') {
                        return (
                          <motion.div 
                            key={message.id} 
                            className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {!isSentByMe && (
                              <div className="mr-2">
                                <img 
                                  src={getAvatarUrl(friend.firstName, friend.lastName)} 
                                  alt={`${friend.firstName} ${friend.lastName}`}
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              </div>
                            )}
                            <div 
                              className={`max-w-xs md:max-w-md rounded-2xl px-4 py-3 shadow-sm ${
                                isSentByMe 
                                  ? 'bg-primary text-white rounded-br-none' 
                                  : `${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white'} rounded-bl-none border border-border-color`
                              }`}
                            >
                              <p className="text-enhanced text-base leading-relaxed break-words">{message.content}</p>
                              <p className={`text-xs mt-1 text-right ${isSentByMe ? 'text-white/70' : 'text-text-lighter'}`}>
                                {formatTime(message.timestamp)}
                                {isSentByMe && (message.isRead ? 
                                  <span className="ml-1">✓✓</span> : 
                                  <span className="ml-1">✓</span>
                                )}
                              </p>
                            </div>
                          </motion.div>
                        );
                      } else {
                        // Modern view
                        return (
                          <motion.div 
                            key={message.id} 
                            className={`flex items-start mb-4 ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {!isSentByMe && (
                              <div className="mr-3 flex-shrink-0">
                                <img 
                                  src={getAvatarUrl(friend.firstName, friend.lastName)} 
                                  alt={`${friend.firstName} ${friend.lastName}`}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              </div>
                            )}
                            
                            <div className={`max-w-xs md:max-w-md ${isSentByMe ? 'order-1' : 'order-2'}`}>
                              <div className={`px-4 py-3 rounded-lg shadow-sm ${
                                isSentByMe 
                                  ? `${isDarkMode ? 'bg-primary/90' : 'bg-primary'} text-white` 
                                  : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`
                              }`}>
                                <p className="text-base">{message.content}</p>
                              </div>
                              <div className={`flex items-center mt-1 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {formatTime(message.timestamp)}
                                </p>
                                {isSentByMe && (
                                  <span className={`ml-2 ${message.isRead ? 'text-primary' : 'text-text-lighter'}`}>
                                    {message.isRead ? '✓✓' : '✓'}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {isSentByMe && (
                              <div className="ml-3 flex-shrink-0 order-3">
                                <img 
                                  src={getAvatarUrl('Ahmet', 'Yılmaz')} 
                                  alt="Ben"
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              </div>
                            )}
                          </motion.div>
                        );
                      }
                    })}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Message input */}
          <div className={`px-6 py-4 border-t border-border-color ${isDarkMode ? 'bg-card-bg' : 'bg-white'}`}>
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 block w-full py-3 px-4 sm:text-base border border-border-color rounded-full shadow-sm focus:ring-primary focus:border-primary bg-input-bg text-text-color"
                />
                <button 
                  type="button" 
                  className="absolute right-14 top-1/2 transform -translate-y-1/2 text-text-lighter hover:text-primary transition-colors"
                  title="Emoji ekle"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <Button type="submit" className="px-6 rounded-full">
                <span className="mr-1">Gönder</span>
                <svg className="w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default MessagesPage; 