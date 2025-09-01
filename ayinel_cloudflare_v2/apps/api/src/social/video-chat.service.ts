import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoChatDto, UpdateVideoChatDto, VideoChatResponseDto } from '@ayinel/types';

@Injectable()
export class VideoChatService {
  constructor(private prisma: PrismaService) {}

  async createVideoChat(userId: string, dto: CreateVideoChatDto): Promise<VideoChatResponseDto> {
    // Check if video exists
    const video = await this.prisma.video.findUnique({
      where: { id: dto.videoId },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // If it's a reply, check if parent chat exists
    if (dto.parentId) {
      const parentChat = await this.prisma.videoChat.findUnique({
        where: { id: dto.parentId },
      });

      if (!parentChat) {
        throw new NotFoundException('Parent chat not found');
      }
    }

    const chat = await this.prisma.videoChat.create({
      data: {
        userId,
        videoId: dto.videoId,
        text: dto.text,
        parentId: dto.parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    return this.mapToVideoChatResponse(chat);
  }

  async updateVideoChat(chatId: string, userId: string, dto: UpdateVideoChatDto): Promise<VideoChatResponseDto> {
    const chat = await this.prisma.videoChat.findFirst({
      where: { id: chatId, userId },
    });

    if (!chat) {
      throw new NotFoundException('Video chat not found or you do not have permission to edit it');
    }

    const updatedChat = await this.prisma.videoChat.update({
      where: { id: chatId },
      data: {
        text: dto.text,
        isEdited: true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    return this.mapToVideoChatResponse(updatedChat);
  }

  async deleteVideoChat(chatId: string, userId: string): Promise<void> {
    const chat = await this.prisma.videoChat.findFirst({
      where: { id: chatId, userId },
    });

    if (!chat) {
      throw new NotFoundException('Video chat not found or you do not have permission to delete it');
    }

    await this.prisma.videoChat.delete({
      where: { id: chatId },
    });
  }

  async getVideoChats(videoId: string, parentId?: string): Promise<VideoChatResponseDto[]> {
    const chats = await this.prisma.videoChat.findMany({
      where: { videoId, parentId: parentId || null },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return chats.map(chat => this.mapToVideoChatResponse(chat));
  }

  async getUserVideoChats(userId: string): Promise<VideoChatResponseDto[]> {
    const chats = await this.prisma.videoChat.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        video: {
          select: {
            id: true,
            title: true,
            studio: {
              select: {
                id: true,
                name: true,
                handle: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return chats.map(chat => this.mapToVideoChatResponse(chat));
  }

  async getVideoChatCount(videoId: string): Promise<number> {
    return this.prisma.videoChat.count({
      where: { videoId },
    });
  }

  private mapToVideoChatResponse(chat: any): VideoChatResponseDto {
    return {
      id: chat.id,
      userId: chat.userId,
      videoId: chat.videoId,
      text: chat.text,
      parentId: chat.parentId,
      isEdited: chat.isEdited,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      user: chat.user ? {
        id: chat.user.id,
        username: chat.user.username,
        displayName: chat.user.displayName,
      } : undefined,
      replies: chat.replies ? chat.replies.map((reply: any) => this.mapToVideoChatResponse(reply)) : undefined,
    };
  }
}
