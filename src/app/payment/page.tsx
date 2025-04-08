"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { IoArrowBack, IoCheckmarkCircle } from 'react-icons/io5';
import { FaCreditCard, FaLock } from 'react-icons/fa';
import Input from '@/components/Input';
import Button from '@/components/Button';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProviderClient';
import Link from 'next/link';

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Türkiye'
  });
  
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19);
    }
    
    // Format expiry date with slash
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\//g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
      }
    }
    
    // Limit CVV to 3 digits
    if (name === 'cvv') {
      formattedValue = value.substring(0, 3);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue,
    });
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Validate card number (16 digits)
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Geçerli bir kart numarası giriniz (16 haneli)';
      valid = false;
    }
    
    // Validate card holder name
    if (!formData.cardHolder) {
      newErrors.cardHolder = 'Kart üzerindeki ismi giriniz';
      valid = false;
    }
    
    // Validate expiry date (MM/YY format)
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expiryDate = 'Geçerli bir son kullanma tarihi giriniz (AA/YY)';
      valid = false;
    } else {
      // Check if card is expired
      const [month, year] = formData.expiryDate.split('/');
      const expiry = new Date();
      expiry.setFullYear(2000 + parseInt(year), parseInt(month) - 1, 1);
      const today = new Date();
      
      if (expiry < today) {
        newErrors.expiryDate = 'Kartınızın süresi dolmuş';
        valid = false;
      }
    }
    
    // Validate CVV (3 digits)
    if (!formData.cvv.match(/^\d{3}$/)) {
      newErrors.cvv = 'Geçerli bir CVV giriniz (3 haneli)';
      valid = false;
    }
    
    // Validate address
    if (!formData.address) {
      newErrors.address = 'Adres giriniz';
      valid = false;
    }
    
    // Validate city
    if (!formData.city) {
      newErrors.city = 'Şehir giriniz';
      valid = false;
    }
    
    // Validate postal code
    if (!formData.postalCode) {
      newErrors.postalCode = 'Posta kodu giriniz';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Process payment (simulate API call)
    setIsProcessing(true);
    
    // Simulate delay for payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const goToHome = () => {
    router.push('/home');
  };

  const renderCreditCardSection = () => (
    <motion.div 
      className={`bg-card-bg border border-border-color rounded-lg p-6 mb-6 shadow-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-text-color">Ödeme Bilgileri</h3>
        <div className="flex space-x-2">
          <div className="h-8 w-12 bg-white rounded shadow-sm flex items-center justify-center">
            <img src="https://www.mastercard.com/content/dam/public/mastercardcom/na/global-site/images/logos/mc-logo-52.svg" alt="Mastercard" className="h-6" />
          </div>
          <div className="h-8 w-12 bg-white rounded shadow-sm flex items-center justify-center">
            <img src="https://cdn.visa.com/v2/assets/images/logos/visa/blue/logo.png" alt="Visa" className="h-5" />
          </div>
        </div>
      </div>
      
      <Input
        label="Kart Numarası"
        type="text"
        name="cardNumber"
        value={formData.cardNumber}
        onChange={handleChange}
        placeholder="1234 5678 9012 3456"
        required
        error={errors.cardNumber}
      />
      
      <Input
        label="Kart Üzerindeki İsim"
        type="text"
        name="cardHolder"
        value={formData.cardHolder}
        onChange={handleChange}
        placeholder="AHMET YILMAZ"
        required
        error={errors.cardHolder}
      />
      
      <div className="flex space-x-4">
        <Input
          label="Son Kullanma Tarihi"
          type="text"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          placeholder="AA/YY"
          required
          error={errors.expiryDate}
          className="w-1/2"
        />
        
        <Input
          label="CVV"
          type="text"
          name="cvv"
          value={formData.cvv}
          onChange={handleChange}
          placeholder="123"
          required
          error={errors.cvv}
          className="w-1/2"
        />
      </div>
    </motion.div>
  );

  const renderBillingSection = () => (
    <motion.div 
      className={`bg-card-bg border border-border-color rounded-lg p-6 mb-6 shadow-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <h3 className="text-lg font-medium text-text-color mb-4">Fatura Bilgileri</h3>
      
      <Input
        label="Adres"
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Cadde, Mahalle, Bina No"
        required
        error={errors.address}
      />
      
      <div className="flex space-x-4">
        <Input
          label="Şehir"
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Şehir"
          required
          error={errors.city}
          className="w-1/2"
        />
        
        <Input
          label="Posta Kodu"
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          placeholder="34000"
          required
          error={errors.postalCode}
          className="w-1/2"
        />
      </div>
      
      <Input
        label="Ülke"
        type="text"
        name="country"
        value={formData.country}
        onChange={handleChange}
        required
        error={errors.country}
      />
    </motion.div>
  );

  const renderOrderSummary = () => (
    <motion.div 
      className={`bg-card-bg border border-border-color rounded-lg p-6 shadow-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <h3 className="text-lg font-medium text-text-color mb-4">Sipariş Özeti</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-text-muted">Ürün Tutarı</span>
          <span className="font-medium text-text-color">1.250 ₺</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Vergi</span>
          <span className="font-medium text-text-color">250 ₺</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Kargo</span>
          <span className="font-medium text-text-color">Ücretsiz</span>
        </div>
      </div>
      
      <div className="border-t border-border-color pt-4">
        <div className="flex justify-between">
          <span className="font-medium">Toplam</span>
          <span className="font-bold text-lg text-primary">1.500 ₺</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center text-sm text-text-muted">
        <FaLock className="mr-2" />
        <span>Güvenli ödeme - verileriniz korunmaktadır</span>
      </div>
    </motion.div>
  );

  const renderSuccessView = () => (
    <motion.div 
      className="py-8 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="flex justify-center mb-6"
      >
        <IoCheckmarkCircle className="w-24 h-24 text-green-500" />
      </motion.div>
      
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold text-text-color mb-4"
      >
        Ödeme Başarılı!
      </motion.h2>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-text-muted mb-8 max-w-md mx-auto"
      >
        Ödemeniz başarıyla tamamlandı. Sipariş onayı e-posta adresinize gönderildi. Yolculuğunuzdan keyif almanızı dileriz!
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button onClick={goToHome}>
          Ana Sayfaya Dön
        </Button>
      </motion.div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-6">
          <Link href="/home" className="inline-flex items-center text-primary hover:text-primary-dark transition-colors">
            <IoArrowBack className="mr-2" />
            <span>Geri Dön</span>
          </Link>
        </div>
        
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-text-color">Ödeme</h1>
          <p className="text-text-muted mt-2">Güvenli bir şekilde rezervasyonunuzu tamamlayın</p>
        </motion.div>
        
        {isSubmitted ? (
          renderSuccessView()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <form onSubmit={handleSubmit}>
                {renderCreditCardSection()}
                {renderBillingSection()}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full text-lg py-3"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Ödeme İşleniyor...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <FaCreditCard className="mr-2" />
                        Ödemeyi Tamamla
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>
            
            <div>
              {renderOrderSummary()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage; 