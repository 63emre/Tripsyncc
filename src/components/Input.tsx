"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface InputProps {
  type?: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  error,
  className = '',
}) => {
  return (
    <motion.div 
      className={`mb-4 ${className}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label htmlFor={name} className="block text-sm font-medium text-text-color mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <motion.input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-border-color'
        } rounded-md shadow-sm bg-input-bg text-text-color focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`}
      />
      {error && (
        <motion.p 
          className="mt-1 text-sm text-red-500"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default Input; 