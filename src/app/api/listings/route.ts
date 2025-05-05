import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getUserFromRequest } from '@/lib/auth/jwt';

// Tüm ilanları getir
export async function GET(req: NextRequest) {
  try {
    // URL parametrelerini al
    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const capacity = searchParams.get('capacity') ? Number(searchParams.get('capacity')) : undefined;
    
    // Sayfalama parametreleri
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10;
    const skip = (page - 1) * limit;
    
    // Arama filtreleri
    const where: any = {};
    
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      };
    }
    
    if (category) {
      where.category = category;
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }
    
    if (capacity !== undefined) {
      where.capacity = {
        gte: capacity,
      };
    }
    
    // İlanları getir
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              profile: {
                select: {
                  avatar: true,
                },
              },
            },
          },
          images: {
            where: {
              isPrimary: true,
            },
            take: 1,
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);
    
    // İlanları format et ve döndür
    const formattedListings = listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      price: listing.price,
      location: listing.location,
      category: listing.category,
      capacity: listing.capacity,
      primaryImage: listing.images[0]?.url || null,
      owner: {
        id: listing.owner.id,
        name: listing.owner.name,
        email: listing.owner.email,
        avatar: listing.owner.profile?.avatar || null,
      },
      reviewCount: listing._count.reviews,
    }));
    
    return NextResponse.json({
      listings: formattedListings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('İlanları getirme hatası:', error);
    return NextResponse.json(
      { error: 'İlanlar alınamadı' },
      { status: 500 }
    );
  }
}

// Yeni ilan oluştur
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
    
    // İstek gövdesini al
    const body = await req.json();
    const {
      title,
      description,
      price,
      capacity,
      location,
      latitude,
      longitude,
      amenities,
      category,
    } = body;
    
    // Zorunlu alanları kontrol et
    if (!title || !description || price === undefined || !capacity || !location || !category) {
      return NextResponse.json(
        { error: 'Tüm zorunlu alanları doldurun' },
        { status: 400 }
      );
    }
    
    // İlanı oluştur
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        location,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        amenities: amenities || [],
        category,
        ownerId: tokenData.userId,
      },
    });
    
    return NextResponse.json({
      success: true,
      listing,
    });
  } catch (error) {
    console.error('İlan oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'İlan oluşturulamadı' },
      { status: 500 }
    );
  }
}