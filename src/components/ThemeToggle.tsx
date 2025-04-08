"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProviderClient';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.button
      className="theme-toggle"
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Sun for light mode */}
      {theme === 'light' && (
        <motion.svg
          className="sun-animate light-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="12" cy="12" r="5" fill="#FFB347" stroke="#FF8C00" strokeWidth="1.5" />
          <motion.g
            animate={{
              opacity: [1, 0.8, 1],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <line x1="12" y1="3" x2="12" y2="1" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="23" x2="12" y2="21" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="12" x2="1" y2="12" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" />
            <line x1="23" y1="12" x2="21" y2="12" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" />
            <line x1="5.6" y1="5.6" x2="4.2" y2="4.2" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" />
            <line x1="19.8" y1="19.8" x2="18.4" y2="18.4" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" />
            <line x1="5.6" y1="18.4" x2="4.2" y2="19.8" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" />
            <line x1="19.8" y1="4.2" x2="18.4" y2="5.6" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" />
          </motion.g>
        </motion.svg>
      )}
      
      {/* Stars for dark mode */}
      {theme === 'dark' && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="dark-icon"
        >
          <motion.path
            d="M12 3C10.8954 3 10 3.89543 10 5V7C10 8.10457 10.8954 9 12 9C13.1046 9 14 8.10457 14 7V5C14 3.89543 13.1046 3 12 3Z"
            fill="#6B8CFF"
            className="stars-animate"
          />
          <motion.path
            d="M18 19C16.8954 19 16 19.8954 16 21C16 22.1046 16.8954 23 18 23C19.1046 23 20 22.1046 20 21C20 19.8954 19.1046 19 18 19Z"
            fill="#6B8CFF"
            className="stars-animate-delayed"
          />
          <motion.path
            d="M6 15C4.89543 15 4 15.8954 4 17C4 18.1046 4.89543 19 6 19C7.10457 19 8 18.1046 8 17C8 15.8954 7.10457 15 6 15Z"
            fill="#6B8CFF"
            className="stars-animate"
          />
          <motion.path
            d="M16 1C14.8954 1 14 1.89543 14 3C14 4.10457 14.8954 5 16 5C17.1046 5 18 4.10457 18 3C18 1.89543 17.1046 1 16 1Z"
            fill="#6B8CFF"
            className="stars-animate-delayed"
          />
          <motion.path
            d="M4 5C2.89543 5 2 5.89543 2 7C2 8.10457 2.89543 9 4 9C5.10457 9 6 8.10457 6 7C6 5.89543 5.10457 5 4 5Z"
            fill="#6B8CFF"
            className="stars-animate"
          />
          <motion.path
            d="M21 10C20.4477 10 20 10.4477 20 11C20 11.5523 20.4477 12 21 12C21.5523 12 22 11.5523 22 11C22 10.4477 21.5523 10 21 10Z"
            fill="#6B8CFF"
            className="stars-animate-delayed"
          />
          <motion.path
            d="M3 15C2.44772 15 2 15.4477 2 16C2 16.5523 2.44772 17 3 17C3.55228 17 4 16.5523 4 16C4 15.4477 3.55228 15 3 15Z"
            fill="#6B8CFF"
            className="stars-animate"
          />
          <motion.path 
            d="M10 20C9.44772 20 9 20.4477 9 21C9 21.5523 9.44772 22 10 22C10.5523 22 11 21.5523 11 21C11 20.4477 10.5523 20 10 20Z"
            fill="#6B8CFF"
            className="stars-animate-delayed"
          />
          <motion.path
            d="M12 11C9.79086 11 8 12.7909 8 15C8 17.2091 9.79086 19 12 19C14.2091 19 16 17.2091 16 15C16 12.7909 14.2091 11 12 11Z"
            fill="#C0CEFF"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      )}
    </motion.button>
  );
};

export default ThemeToggle; 