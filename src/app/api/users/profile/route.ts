import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getUserFromRequest } from '@/lib/auth/jwt';

// Kullanıcı profil bilgilerini döndür
export async function GET(req: NextRequest) {
  try {
    // Token'dan kullanıcı bilgilerini çıkar
    const tokenData = getUserFromRequest(req);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Yetkilendirme başarısız' },
        { status: 401 }
      );
    }

    // Kullanıcı bilgilerini getir
    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Şifreyi çıkar
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Profil bilgisi alma hatası:', error);
    return NextResponse.json(
      { error: 'Profil bilgisi alınamadı' },
      { status: 500 }
    );
  }
}

// Kullanıcı profil bilgilerini güncelle
export async function PUT(req: NextRequest) {
  try {
    // Token'dan kullanıcı bilgilerini çıkar
    const tokenData = getUserFromRequest(req);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Yetkilendirme başarısız' },
        { status: 401 }
      );
    }

    // Güncelleme verilerini al
    const body = await req.json();
    const {
      name,
      bio,
      phoneNumber,
      address,
      city,
      country,
      dateOfBirth,
    } = body;

    // Kullanıcıyı bul
    let user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Kullanıcı adını güncelle (eğer belirtilmişse)
    if (name !== undefined) {
      user = await prisma.user.update({
        where: { id: tokenData.userId },
        data: { name },
        include: { profile: true },
      });
    }

    // Profili güncelle
    if (user.profile) {
      // Mevcut profil varsa güncelle
      await prisma.profile.update({
        where: { id: user.profile.id },
        data: {
          bio: bio !== undefined ? bio : user.profile.bio,
          phoneNumber: phoneNumber !== undefined ? phoneNumber : user.profile.phoneNumber,
          address: address !== undefined ? address : user.profile.address,
          city: city !== undefined ? city : user.profile.city,
          country: country !== undefined ? country : user.profile.country,
          dateOfBirth: dateOfBirth !== undefined ? new Date(dateOfBirth) : user.profile.dateOfBirth,
        },
      });
    } else {
      // Profil yoksa oluştur
      await prisma.profile.create({
        data: {
          userId: user.id,
          bio,
          phoneNumber,
          address,
          city,
          country,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        },
      });
    }

    // Güncellenmiş kullanıcı bilgilerini getir
    const updatedUser = await prisma.user.findUnique({
      where: { id: tokenData.userId },
      include: { profile: true },
    });

    // Şifreyi çıkar
    const { password, ...userWithoutPassword } = updatedUser!;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Profil güncellenemedi' },
      { status: 500 }
    );
  }
}