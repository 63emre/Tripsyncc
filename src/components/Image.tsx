"use client";

import React from 'react';
import { useImage } from '@/utils/imageUtils';
import { motion } from 'framer-motion';

interface ImageProps {
  src?: string;
  alt: string;
  type?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  animate?: boolean;
  onClick?: () => void;
  containerClassName?: string;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  type = 'default',
  className = '',
  width,
  height,
  priority = false,
  animate = true,
  onClick,
  containerClassName = '',
}) => {
  const { src: imageSrc, loading } = useImage(src, type);
  
  const imageStyle: React.CSSProperties = {
    objectFit: 'cover',
    ...(width ? { width: `${width}px` } : {}),
    ...(height ? { height: `${height}px` } : {}),
  };
  
  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    ...(width ? { width: `${width}px` } : {}),
    ...(height ? { height: `${height}px` } : {}),
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  const ImageElement = () => (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${onClick ? 'cursor-pointer' : ''} ${loading ? 'opacity-0' : 'opacity-100'}`}
      style={imageStyle}
      onClick={handleClick}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
  
  if (animate) {
    return (
      <div style={wrapperStyle} className={containerClassName}>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
            <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19.5 12c0-4.136-3.364-7.5-7.5-7.5s-7.5 3.364-7.5 7.5 3.364 7.5 7.5 7.5 7.5-3.364 7.5-7.5zm-15 0c0-4.136 3.364-7.5 7.5-7.5v1.5c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6h1.5c0 4.136-3.364 7.5-7.5 7.5s-7.5-3.364-7.5-7.5z"
              />
            </svg>
          </div>
        ) : null}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <ImageElement />
        </motion.div>
      </div>
    );
  }
  
  return (
    <div style={wrapperStyle} className={containerClassName}>
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19.5 12c0-4.136-3.364-7.5-7.5-7.5s-7.5 3.364-7.5 7.5 3.364 7.5 7.5 7.5 7.5-3.364 7.5-7.5zm-15 0c0-4.136 3.364-7.5 7.5-7.5v1.5c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6h1.5c0 4.136-3.364 7.5-7.5 7.5s-7.5-3.364-7.5-7.5z"
            />
          </svg>
        </div>
      ) : null}
      <ImageElement />
    </div>
  );
};

export default Image; 