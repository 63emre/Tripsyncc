"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Input from '@/components/Input';
import Button from '@/components/Button';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProviderClient';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let valid = true;
    const newErrors = { ...errors };
    
    // Basic validation
    if (!formData.email) {
      newErrors.email = 'E-posta adresi gereklidir';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
      valid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
      valid = false;
    }
    
    if (!valid) {
      setErrors(newErrors);
      return;
    }
    
    // If valid, redirect to home page (normally would authenticate)
    router.push('/home');
  };

  // Her harf için animasyon varyantları
  const letterVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    }),
  };

  // Dalgalanma animasyonu
  const waveVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "mirror" as const,
      },
    },
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} px-4 transition-colors duration-300`}>
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      <div className={`absolute inset-0 overflow-hidden z-0 ${!isDarkMode && 'hidden'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        {/* Yıldızlar efekti */}
        <div className="stars-animate absolute h-2 w-2 bg-white rounded-full" style={{ top: '20%', left: '20%', opacity: 0.5 }}></div>
        <div className="stars-animate absolute h-2 w-2 bg-white rounded-full" style={{ top: '30%', left: '70%', opacity: 0.7 }}></div>
        <div className="stars-animate-delayed absolute h-1 w-1 bg-white rounded-full" style={{ top: '65%', left: '40%', opacity: 0.6 }}></div>
        <div className="stars-animate-delayed absolute h-3 w-3 bg-white rounded-full" style={{ top: '15%', left: '60%', opacity: 0.3 }}></div>
        <div className="stars-animate absolute h-2 w-2 bg-white rounded-full" style={{ top: '75%', left: '85%', opacity: 0.5 }}></div>
        <div className="stars-animate-delayed absolute h-1 w-1 bg-white rounded-full" style={{ top: '45%', left: '15%', opacity: 0.4 }}></div>
      </div>
      
      <motion.div 
        className={`w-full max-w-md p-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-2xl border relative z-10 transition-colors duration-300`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6 relative">
            {/* Animasyonlu TripSync logosu */}
            <div className="flex items-center justify-center">
              {Array.from("Trip").map((letter, i) => (
                <motion.span
                  key={`title-1-${i}`}
                  custom={i}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                  className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-primary-dark'} inline-block`}
                >
                  {letter}
                </motion.span>
              ))}
              <motion.div
                variants={waveVariants}
                animate="animate"
                className="mx-1"
              >
                <motion.span
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-secondary-dark'} inline-block`}
                >
                  ✦
                </motion.span>
              </motion.div>
              {Array.from("Sync").map((letter, i) => (
                <motion.span
                  key={`title-2-${i}`}
                  custom={i + Array.from("Trip").length + 1}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                  className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-secondary-dark'} inline-block`}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>
          
          <motion.h2 
            className={`text-xl font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Seyahat Maceranıza Hoş Geldiniz
          </motion.h2>
        </div>
        
        <motion.form 
          className="space-y-6" 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Input
            label="E-posta Adresi"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-posta adresiniz"
            required
            error={errors.email}
          />
          
          <Input
            label="Şifre"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Şifreniz"
            required
            error={errors.password}
          />

          <div className="flex justify-between items-center mt-4">
            <Link href="/signup" className="text-sm font-medium text-primary-light hover:text-primary">
              Hesabınız yok mu? Kayıt olun
            </Link>
            <Link href="/forgot-password" className="text-sm font-medium text-primary-light hover:text-primary">
              Şifremi Unuttum
            </Link>
          </div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button type="submit" className="w-full">
              Giriş Yap
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default LoginPage; 