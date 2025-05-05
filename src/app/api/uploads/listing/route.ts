import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getUserFromRequest } from '@/lib/auth/jwt';
import { handleFileUpload } from '@/utils/fileUpload';

// İlan fotoğrafı yükleme
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
    
    // İlan ID'sini al
    const listingId = formData.get('listingId')?.toString();
    const caption = formData.get('caption')?.toString() || '';
    const isPrimary = formData.get('isPrimary') === 'true';
    
    if (!listingId) {
      return NextResponse.json(
        { error: 'İlan ID\'si gereklidir' },
        { status: 400 }
      );
    }
    
    // İlanı kontrol et ve kullanıcının sahibi olup olmadığını doğrula
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });
    
    if (!listing) {
      return NextResponse.json(
        { error: 'İlan bulunamadı' },
        { status: 404 }
      );
    }
    
    if (listing.ownerId !== tokenData.userId) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }
    
    // Dosyayı yükle - file alanından alarak listings klasörüne kaydet
    const imageUrl = await handleFileUpload(formData, 'file', 'listings');
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Dosya yüklenemedi' },
        { status: 400 }
      );
    }

    // Eğer bu görsel birincil olarak işaretlendiyse, diğer tüm görselleri birincil olmaktan çıkar
    if (isPrimary) {
      await prisma.listingImage.updateMany({
        where: { listingId },
        data: { isPrimary: false },
      });
    }
    
    // Görsel kaydını oluştur
    const image = await prisma.listingImage.create({
      data: {
        url: imageUrl,
        caption,
        isPrimary,
        listingId,
      },
    });

    return NextResponse.json({
      success: true,
      image,
    });
  } catch (error) {
    console.error('İlan fotoğrafı yükleme hatası:', error);
    return NextResponse.json(
      { error: 'İlan fotoğrafı yüklenemedi' },
      { status: 500 }
    );
  }
}