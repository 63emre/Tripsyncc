import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { comparePassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    // İstek gövdesinden e-posta ve şifre bilgisini al
    const { email, password } = await request.json();
    
    // Gerekli alanları kontrol et
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre gereklidir' },
        { status: 400 }
      );
    }
    
    // Kullanıcıyı e-posta adresine göre bul
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      }
    });
    
    // Kullanıcı yoksa veya şifre eşleşmezse hata döndür
    if (!user) {
      return NextResponse.json(
        { error: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }
    
    // Şifreleri karşılaştır
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }
    
    // JWT token oluştur
    const token = generateToken(user);
    
    // Kullanıcı bilgilerini ve token'ı döndür
    return NextResponse.json({
      message: 'Giriş başarılı',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: {
          bio: user.profile?.bio || '',
          avatar: user.profile?.avatar || '',
        }
      },
      token
    });
    
  } catch (error) {
    console.error('Giriş hatası:', error);
    return NextResponse.json(
      { error: 'Giriş sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}