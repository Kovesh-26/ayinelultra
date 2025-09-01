import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVideoDto) {
    return this.prisma.video.create({
      data: { ...dto },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        studio: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            boosts: true,
          },
        },
      },
    });
  }

  async getById(id: string) {
    const video = await this.prisma.video.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        studio: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            boosts: true,
          },
        },
      },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return video;
  }

  async list(params?: { type?: 'FLIP' | 'BROADCAST'; limit?: number }) {
    return this.prisma.video.findMany({
      where: { type: params?.type },
      orderBy: { createdAt: 'desc' },
      take: params?.limit || 30,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        studio: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            boosts: true,
          },
        },
      },
    });
  }

  async trending() {
    return this.prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        studio: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            boosts: true,
          },
        },
      },
    });
  }

  async getByUser(userId: string) {
    return this.prisma.video.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        studio: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            boosts: true,
          },
        },
      },
    });
  }

  async getByStudio(studioId: string) {
    return this.prisma.video.findMany({
      where: { studioId },
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            boosts: true,
          },
        },
      },
    });
  }
}
