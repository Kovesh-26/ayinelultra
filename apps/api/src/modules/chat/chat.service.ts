import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatRoomDto, SendMessageDto, ChatRoomKind } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createRoom(userId: string, dto: CreateChatRoomDto) {
    const room = await this.prisma.conversation.create({
      data: {
        title: dto.title,
        participants: {
          create: [
            {
              userId,
              role: 'ADMIN'
            },
            ...(dto.participantIds || []).map(participantId => ({
              userId: participantId,
              role: 'MEMBER'
            }))
          ]
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });

    return room;
  }

  async getRooms(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
              }
            }
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
              }
            }
          }
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  }

  async getRoom(roomId: string, userId: string) {
    const room = await this.prisma.conversation.findUnique({
      where: { id: roomId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user is participant
    const isParticipant = room.participants.some(p => p.userId === userId);
    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant in this room');
    }

    return room;
  }

  async getMessages(roomId: string, userId: string, page: number = 1, limit: number = 50) {
    // Check if user is participant
    const room = await this.getRoom(roomId, userId);
    
    const messages = await this.prisma.message.findMany({
      where: {
        conversationId: roomId
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        },
        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    });

    return {
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        total: await this.prisma.message.count({
          where: { conversationId: roomId }
        })
      }
    };
  }

  async sendMessage(roomId: string, userId: string, dto: SendMessageDto) {
    // Check if user is participant
    await this.getRoom(roomId, userId);

    // Validate that either text or attachment is provided
    if (!dto.text && !dto.attachmentUrl) {
      throw new BadRequestException('Message must contain either text or an attachment');
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId: roomId,
        senderId: userId,
        text: dto.text,
        attachmentUrl: dto.attachmentUrl,
        attachmentType: dto.attachmentType,
        replyToId: dto.replyToId
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        },
        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });

    // Update conversation updatedAt
    await this.prisma.conversation.update({
      where: { id: roomId },
      data: { updatedAt: new Date() }
    });

    return message;
  }

  async joinRoom(roomId: string, userId: string) {
    const room = await this.prisma.conversation.findUnique({
      where: { id: roomId },
      include: {
        participants: true
      }
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user is already a participant
    const isParticipant = room.participants.some(p => p.userId === userId);
    if (isParticipant) {
      return room;
    }

    // Add user to room
    await this.prisma.conversationParticipant.create({
      data: {
        conversationId: roomId,
        userId,
        role: 'MEMBER'
      }
    });

    return this.getRoom(roomId, userId);
  }

  async leaveRoom(roomId: string, userId: string) {
    const room = await this.getRoom(roomId, userId);

    // Remove user from room
    await this.prisma.conversationParticipant.deleteMany({
      where: {
        conversationId: roomId,
        userId
      }
    });

    return { success: true };
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    return this.prisma.message.delete({
      where: { id: messageId }
    });
  }

  async getOnlineUsers(roomId: string) {
    // This would typically integrate with Redis or a real-time presence system
    // For now, return empty array
    return [];
  }
}
