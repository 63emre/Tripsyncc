import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

// JWT Secret should be stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'tripsyncc-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Type definition for token payload
type TokenPayload = {
  userId: string;  // Changed from 'id' to 'userId' to match what's used in the route.ts
  email: string;
};

/**
 * Generate a JWT token for a user
 * @param user The user to generate a token for
 * @returns The generated JWT token
 */
export const generateToken = (user: User): string => {
  const payload: TokenPayload = {
    userId: user.id,  // Changed from 'id' to 'userId'
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify and decode a JWT token
 * @param token The token to verify
 * @returns The decoded token payload or null if invalid
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Get user ID from authorization header
 * @param authHeader The authorization header
 * @returns The user ID or null if invalid
 */
export const getUserIdFromAuthHeader = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  return decoded?.userId || null;
};

/**
 * Authorization header'dan token'ı ayıklar
 * @param authHeader Authorization header değeri
 * @returns Token string veya null
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  // "Bearer " kısmını çıkar (7 karakter)
  return authHeader.substring(7);
}

/**
 * HTTP isteğinden Authorization başlığını alır ve token'ı çıkarır
 * @param req HTTP isteği
 * @returns JWT token veya null
 */
export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  
  return extractTokenFromHeader(authHeader);
}

/**
 * HTTP isteğinden kullanıcı bilgilerini çıkarır
 * @param req HTTP isteği
 * @returns Kullanıcı bilgileri veya null
 */
export function getUserFromRequest(req: NextRequest): TokenPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

/**
 * Belirli bir endpoint'i JWT token ile korur
 * @param handler API route işleyicisi
 * @returns İşlenmiş API yanıtı
 */
export function withAuth(handler: (req: NextRequest, userData: TokenPayload) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const userData = getUserFromRequest(req);
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Yetkilendirme başarısız' },
        { status: 401 }
      );
    }
    
    return handler(req, userData);
  };
}