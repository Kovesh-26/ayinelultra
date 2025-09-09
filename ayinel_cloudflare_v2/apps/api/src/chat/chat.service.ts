import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateConversationDto,
  SendMessageDto,
  ConversationResponseDto,
  MessageResponseDto,
} from '@ayinel/types';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createConversation(
    createdById: string,
    dto: CreateConversationDto
  ): Promise<ConversationResponseDto> {
    // Validate that all members exist
    const members = await this.prisma.user.findMany({
      where: { id: { in: dto.memberIds } },
    });

    if (members.length !== dto.memberIds.length) {
      throw new BadRequestException('Some members not found');
    }

    const conversation = await this.prisma.conversation.create({
      data: {
        type: dto.type,
        title: dto.title,
        createdById,
        members: {
          create: dto.memberIds.map((memberId) => ({
            userId: memberId,
          })),
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return this.mapToConversationResponse(conversation);
  }

  async getConversations(userId: string): Promise<ConversationResponseDto[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map((conversation) =>
      this.mapToConversationResponse(conversation)
    );
  }

  async getConversation(
    id: string,
    userId: string
  ): Promise<ConversationResponseDto> {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id,
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.mapToConversationResponse(conversation);
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    dto: SendMessageDto
  ): Promise<MessageResponseDto> {
    // Check if user is member of conversation
    const membership = await this.prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: senderId,
        },
      },
    });

    if (!membership) {
      throw new BadRequestException(
        'You are not a member of this conversation'
      );
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        text: dto.text,
        mediaUrl: dto.mediaUrl,
      },
    });

    // Update conversation's updatedAt
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return this.mapToMessageResponse(message);
  }

  async getMessages(
    conversationId: string,
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<MessageResponseDto[]> {
    // Check if user is member of conversation
    const membership = await this.prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new BadRequestException(
        'You are not a member of this conversation'
      );
    }

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return messages
      .reverse()
      .map((message) => this.mapToMessageResponse(message));
  }

  async addMemberToConversation(
    conversationId: string,
    userId: string,
    newMemberId: string
  ): Promise<void> {
    // Check if user is member of conversation
    const membership = await this.prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new BadRequestException(
        'You are not a member of this conversation'
      );
    }

    // Check if new member already exists
    const existingMembership = await this.prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: newMemberId,
        },
      },
    });

    if (existingMembership) {
      throw new BadRequestException(
        'User is already a member of this conversation'
      );
    }

    await this.prisma.conversationMember.create({
      data: {
        conversationId,
        userId: newMemberId,
      },
    });
  }

  async removeMemberFromConversation(
    conversationId: string,
    userId: string,
    memberId: string
  ): Promise<void> {
    // Check if user is member of conversation
    const membership = await this.prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new BadRequestException(
        'You are not a member of this conversation'
      );
    }

    await this.prisma.conversationMember.delete({
      where: {
        conversationId_userId: {
          conversationId,
          userId: memberId,
        },
      },
    });
  }

  private mapToConversationResponse(
    conversation: any
  ): ConversationResponseDto {
    return {
      id: conversation.id,
      type: conversation.type,
      title: conversation.title,
      createdById: conversation.createdById,
      members: conversation.members.map((member) => member.userId),
      lastMessage: conversation.messages?.[0]
        ? this.mapToMessageResponse(conversation.messages[0])
        : undefined,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  private mapToMessageResponse(message: any): MessageResponseDto {
    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      text: message.text,
      mediaUrl: message.mediaUrl,
      createdAt: message.createdAt,
    };
  }
}
