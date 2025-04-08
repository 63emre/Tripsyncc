"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import Button from '@/components/Button';

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
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
    if (!formData.firstName) {
      newErrors.firstName = 'Ad gereklidir';
      valid = false;
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Soyad gereklidir';
      valid = false;
    }
    
    if (!formData.email) {
      newErrors.email = 'E-posta adresi gereklidir';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
      valid = false;
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Telefon numarası gereklidir';
      valid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
      valid = false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
      valid = false;
    }
    
    if (!valid) {
      setErrors(newErrors);
      return;
    }
    
    // If valid, redirect to login page (normally would register)
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex hero-background">
      <div className="w-full max-w-md mx-auto my-auto p-8 bg-white rounded-lg shadow-lg hero-content">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#9370DB] mb-2">TripSync</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Yeni hesap oluşturun</h2>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ad"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Adınız"
              required
              error={errors.firstName}
            />
            <Input
              label="Soyad"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Soyadınız"
              required
              error={errors.lastName}
            />
          </div>
          
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
            label="Telefon"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Telefon numaranız"
            required
            error={errors.phone}
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
          
          <Input
            label="Şifre Tekrar"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Şifrenizi tekrar giriniz"
            required
            error={errors.confirmPassword}
          />

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/login" className="font-medium text-[#9370DB] hover:text-[#7851B8]">
                Zaten hesabınız var mı? Giriş yapın
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Kayıt Ol
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage; 