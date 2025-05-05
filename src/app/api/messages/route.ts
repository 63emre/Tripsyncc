import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getUserFromRequest } from '@/lib/auth/jwt';

// Mesajları listeleme
export async function GET(request: NextRequest) {
  const userPayload = getUserFromRequest(request);
  
  if (!userPayload) {
    return NextResponse.json(
      { error: 'Kimlik doğrulama gerekli' },
      { status: 401 }
    );
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const conversationWithUserId = searchParams.get('userId');
    
    // Belirli bir kullanıcı ile olan konuşmayı getir
    if (conversationWithUserId) {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userPayload.userId, receiverId: conversationWithUserId },
            { senderId: conversationWithUserId, receiverId: userPayload.userId },
          ],
        },
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          sender: {
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
          receiver: {
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
        },
      });
      
      // Okunmamış mesajları okundu olarak işaretle
      await prisma.message.updateMany({
        where: {
          senderId: conversationWithUserId,
          receiverId: userPayload.userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
      
      return NextResponse.json({ messages });
    } 
    
    // Kullanıcının tüm konuşmalarını getir (son mesajlarla birlikte)
    const conversations = await prisma.$queryRaw`
      WITH RankedMessages AS (
        SELECT 
          m.*,
          ROW_NUMBER() OVER (
            PARTITION BY 
              CASE 
                WHEN m."senderId" = ${userPayload.userId} THEN m."receiverId"
                ELSE m."senderId"
              END
            ORDER BY m."createdAt" DESC
          ) as rn
        FROM "Message" m
        WHERE m."senderId" = ${userPayload.userId} OR m."receiverId" = ${userPayload.userId}
      )
      SELECT 
        rm.*,
        u1.name as "senderName",
        u1.email as "senderEmail",
        p1.avatar as "senderAvatar",
        u2.name as "receiverName",
        u2.email as "receiverEmail",
        p2.avatar as "receiverAvatar",
        (SELECT COUNT(*) FROM "Message" 
         WHERE "receiverId" = ${userPayload.userId} 
         AND "senderId" = 
           CASE 
             WHEN rm."senderId" = ${userPayload.userId} THEN rm."receiverId"
             ELSE rm."senderId"
           END
         AND "isRead" = false) as "unreadCount"
      FROM RankedMessages rm
      JOIN "User" u1 ON rm."senderId" = u1.id
      JOIN "User" u2 ON rm."receiverId" = u2.id
      LEFT JOIN "Profile" p1 ON u1.id = p1."userId"
      LEFT JOIN "Profile" p2 ON u2.id = p2."userId"
      WHERE rn = 1
      ORDER BY rm."createdAt" DESC;
    `;
    
    // Konuşmaları düzenle
    const formattedConversations = conversations.map((msg: any) => {
      const otherUser = msg.senderId === userPayload.userId
        ? {
            id: msg.receiverId,
            name: msg.receiverName,
            email: msg.receiverEmail,
            avatar: msg.receiverAvatar,
          }
        : {
            id: msg.senderId, 
            name: msg.senderName,
            email: msg.senderEmail,
            avatar: msg.senderAvatar,
          };
      
      return {
        id: msg.id,
        content: msg.content,
        createdAt: msg.createdAt,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        isRead: msg.isRead,
        otherUser,
        unreadCount: Number(msg.unreadCount),
      };
    });
    
    return NextResponse.json({ conversations: formattedConversations });
  } catch (error) {
    console.error('Mesajları getirme hatası:', error);
    return NextResponse.json(
      { error: 'Mesajlar alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Yeni mesaj gönderme
export async function POST(request: NextRequest) {
  const userPayload = getUserFromRequest(request);
  
  if (!userPayload) {
    return NextResponse.json(
      { error: 'Kimlik doğrulama gerekli' },
      { status: 401 }
    );
  }
  
  try {
    const body = await request.json();
    const { content, receiverId } = body;
    
    // Gerekli alanları kontrol et
    if (!content || !receiverId) {
      return NextResponse.json(
        { error: 'Mesaj içeriği ve alıcı ID zorunludur' },
        { status: 400 }
      );
    }
    
    // Alıcının var olduğunu kontrol et
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    });
    
    if (!receiver) {
      return NextResponse.json(
        { error: 'Alıcı bulunamadı' },
        { status: 404 }
      );
    }
    
    // Kendine mesaj gönderemezsin
    if (receiverId === userPayload.userId) {
      return NextResponse.json(
        { error: 'Kendinize mesaj gönderemezsiniz' },
        { status: 400 }
      );
    }
    
    // Yeni mesaj oluştur
    const message = await prisma.message.create({
      data: {
        content,
        senderId: userPayload.userId,
        receiverId,
      },
      include: {
        sender: {
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
        receiver: {
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
      },
    });
    
    return NextResponse.json({
      message: 'Mesaj başarıyla gönderildi',
      data: message,
    });
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    return NextResponse.json(
      { error: 'Mesaj gönderilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}