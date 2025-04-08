"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useTheme } from './ThemeProviderClient';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: '/home', text: 'Ana Sayfa' },
    { href: '/search', text: 'Keşfet' },
    { href: '/listing/new', text: 'İlan Ekle' },
    { href: '/profile', text: 'Profil' },
    { href: '/friends', text: 'Arkadaşlar' },
    { href: '/messages', text: 'Mesajlar' },
    { href: '/login', text: 'Çıkış Yap' },
  ];

  return (
    <motion.nav 
      className="bg-card-bg border-b border-border-color shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/home" className="flex-shrink-0 flex items-center">
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.span
                  className="text-2xl font-bold text-primary mr-1"
                  animate={{ 
                    color: ['hsl(190, 85%, 45%)', 'hsl(220, 80%, 55%)', 'hsl(190, 85%, 45%)'],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Trip
                </motion.span>
                <motion.span
                  className="text-2xl font-bold mx-0.5"
                  initial={{ rotate: 0 }}
                  animate={{ 
                    rotate: 360,
                    color: isDarkMode ? '#fff' : 'hsl(220, 80%, 55%)'
                  }}
                  transition={{ 
                    rotate: {
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                >
                  ✦
                </motion.span>
                <motion.span
                  className="text-2xl font-bold text-secondary"
                  animate={{ 
                    color: ['hsl(220, 80%, 55%)', 'hsl(190, 85%, 45%)', 'hsl(220, 80%, 55%)'],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Sync
                </motion.span>
              </motion.div>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  href={link.href} 
                  className="px-3 py-2 text-sm font-medium text-text-color hover:text-primary transition-colors duration-200 relative group"
                >
                  {link.text}
                  <motion.span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"
                    layoutId="underline"
                  />
                </Link>
              </motion.div>
            ))}
            
            {/* Theme toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <ThemeToggle />
            
            <button
              onClick={toggleMenu}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-text-color hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
            >
              <span className="sr-only">Menüyü aç</span>
              {/* Icon for menu */}
              <motion.svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                initial={{ rotate: 0 }}
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </motion.svg>
              {/* Icon for closing menu */}
              <motion.svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                initial={{ rotate: 0 }}
                animate={{ rotate: isMenuOpen ? 0 : -90 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="sm:hidden bg-card-bg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pt-2 pb-3 space-y-1 border-t border-border-color">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    href={link.href} 
                    className="block px-3 py-2 text-base font-medium text-text-color hover:text-primary hover:bg-primary/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.text}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation; 