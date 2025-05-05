import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { hashPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    // İstek gövdesinden JSON verileri al
    const { name, email, password } = await request.json();

    // Gerekli alanların kontrolü
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'İsim, e-posta ve şifre gereklidir' },
        { status: 400 }
      );
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      );
    }

    // Kullanıcının zaten var olup olmadığını kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 409 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await hashPassword(password);

    // Yeni kullanıcı oluştur
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profile: {
          create: {
            bio: '',
            avatarUrl: '',
          }
        }
      }
    });

    // Kullanıcı verilerini token'a ekle
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email
    });

    // Kullanıcı bilgilerini döndür (şifre hariç)
    return NextResponse.json({
      message: 'Kayıt başarılı',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      token
    }, { status: 201 });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    return NextResponse.json(
      { error: 'Kayıt işlemi sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}