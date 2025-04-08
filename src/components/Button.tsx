"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outlined' | 'danger';
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  title?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  icon,
  title,
}) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center justify-center';
  
  const variantStyles = {
    primary: 'btn-primary bg-primary hover:bg-primary-dark text-white focus:ring-primary shadow-sm hover:shadow',
    secondary: 'btn-secondary bg-secondary hover:bg-secondary-dark text-white focus:ring-secondary shadow-sm hover:shadow',
    outlined: 'btn-outlined bg-transparent border border-primary text-primary hover:bg-primary/5 focus:ring-primary',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-sm hover:shadow',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button; 