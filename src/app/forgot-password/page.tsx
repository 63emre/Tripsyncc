"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoArrowBack } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa';

import Input from '@/components/Input';
import Button from '@/components/Button';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProviderClient';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const starVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Lütfen e-posta adresinizi girin');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Lütfen geçerli bir e-posta adresi girin');
      return;
    }

    setIsSubmitting(true);

    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative">
        {theme === 'dark' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                custom={i}
                variants={starVariants}
                initial="initial"
                animate="animate"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
              />
            ))}
          </div>
        )}

        <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg transition-colors duration-300">
          <div>
            <Link href="/login" className="flex items-center text-primary-light hover:text-primary mb-6">
              <IoArrowBack className="mr-1" /> Giriş Sayfasına Dön
            </Link>
            <motion.h2 
              className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Şifremi Unuttum
            </motion.h2>
            <motion.p 
              className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              E-posta adresinizi girin, şifre sıfırlama bağlantısını gönderelim
            </motion.p>
          </div>

          {!isSubmitted ? (
            <motion.form 
              className="mt-8 space-y-6" 
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="rounded-md -space-y-px">
                <Input
                  label="E-posta Adresi"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta Adresi"
                  error={error}
                  required
                />
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              className="mt-8 space-y-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
                  <FaCheck className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Bağlantı Gönderildi!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {email} adresine şifre sıfırlama bağlantısını gönderdik. Lütfen e-postanızı kontrol edin.
              </p>
              <Button
                onClick={() => router.push('/login')}
                className="mt-4 w-full"
              >
                Giriş Sayfasına Dön
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 