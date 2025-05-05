import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from './jwt';
import { prisma } from '../db/prisma';

/**
 * API endpointlerini korumak için kimlik doğrulama middleware'i
 */
export async function authMiddleware(request: NextRequest) {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Kimlik doğrulama gerekli. Lütfen giriş yapın.' },
      { status: 401 }
    );
  }
  
  // Kullanıcının veritabanında hala var olduğundan emin ol
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { id: true }
    });
    
    if (!dbUser) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 401 });
    }
    
    // Kulllanıcı bilgisini request'e ekle
    request.headers.set('X-User-ID', user.userId);
    request.headers.set('X-User-Email', user.email);
    
    return NextResponse.next();
  } catch (error) {
    console.error('Auth middleware hatası:', error);
    return NextResponse.json(
      { error: 'Kimlik doğrulama işlemi sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}