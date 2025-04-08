export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  city: string;
  description: string;
  shortDescription: string;
  priceRange: string;
  accommodationType: string;
  images: string[];
  rating: number;
  featured?: boolean;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  description: string;
  imageUrl?: string;
}

export interface Attraction {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl?: string;
}

export interface Listing {
  id: string;
  userId: string;
  title: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  price: number;
  capacity: number;
  roomCount: number;
  description: string;
  images: string[];
  amenities: string[];
}

export interface Friend {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
} 