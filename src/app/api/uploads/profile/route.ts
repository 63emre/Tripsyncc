import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getUserFromRequest } from '@/lib/auth/jwt';
import { handleFileUpload } from '@/utils/fileUpload';

// Profil fotoğrafı yükleme
export async function POST(req: NextRequest) {
  try {
    // Token'dan kullanıcı bilgilerini çıkar
    const tokenData = getUserFromRequest(req);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Yetkilendirme başarısız' },
        { status: 401 }
      );
    }

    // Form verisini al
    const formData = await req.formData();
    
    // Dosyayı yükle
    const avatarUrl = await handleFileUpload(formData, 'avatar', 'profiles');
    
    if (!avatarUrl) {
      return NextResponse.json(
        { error: 'Dosya yüklenemedi' },
        { status: 400 }
      );
    }

    // Kullanıcının profilini bul
    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Profil varsa güncelle, yoksa oluştur
    if (user.profile) {
      await prisma.profile.update({
        where: { id: user.profile.id },
        data: { avatar: avatarUrl },
      });
    } else {
      await prisma.profile.create({
        data: {
          userId: user.id,
          avatar: avatarUrl,
        },
      });
    }

    return NextResponse.json({
      success: true,
      avatarUrl,
    });
  } catch (error) {
    console.error('Profil fotoğrafı yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Profil fotoğrafı yüklenemedi' },
      { status: 500 }
    );
  }
}