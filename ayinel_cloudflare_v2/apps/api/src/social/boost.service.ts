import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BoostVideoDto, BoostResponseDto } from '@ayinel/types';

@Injectable()
export class BoostService {
  constructor(private prisma: PrismaService) {}

  async boostVideo(userId: string, dto: BoostVideoDto): Promise<BoostResponseDto> {
    // Check if video exists
    const video = await this.prisma.video.findUnique({
      where: { id: dto.videoId },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // Check if already boosted
    const existingBoost = await this.prisma.videoBoost.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId: dto.videoId,
        },
      },
    });

    if (existingBoost) {
      // Update existing boost
      const updatedBoost = await this.prisma.videoBoost.update({
        where: { id: existingBoost.id },
        data: { type: dto.type },
      });

      // Update video boost count
      await this.updateVideoBoostCount(dto.videoId);

      return {
        id: updatedBoost.id,
        userId: updatedBoost.userId,
        videoId: updatedBoost.videoId,
        type: updatedBoost.type,
        createdAt: updatedBoost.createdAt,
      };
    }

    // Create new boost
    const boost = await this.prisma.videoBoost.create({
      data: {
        userId,
        videoId: dto.videoId,
        type: dto.type,
      },
    });

    // Update video boost count
    await this.updateVideoBoostCount(dto.videoId);

    return {
      id: boost.id,
      userId: boost.userId,
      videoId: boost.videoId,
      type: boost.type,
      createdAt: boost.createdAt,
    };
  }

  async removeBoost(userId: string, videoId: string): Promise<void> {
    const boost = await this.prisma.videoBoost.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
    });

    if (!boost) {
      throw new NotFoundException('Boost not found');
    }

    await this.prisma.videoBoost.delete({
      where: { id: boost.id },
    });

    // Update video boost count
    await this.updateVideoBoostCount(videoId);
  }

  async getVideoBoosts(videoId: string): Promise<BoostResponseDto[]> {
    const boosts = await this.prisma.videoBoost.findMany({
      where: { videoId },
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

    return boosts.map(boost => ({
      id: boost.id,
      userId: boost.userId,
      videoId: boost.videoId,
      type: boost.type,
      createdAt: boost.createdAt,
    }));
  }

  async getUserBoosts(userId: string): Promise<BoostResponseDto[]> {
    const boosts = await this.prisma.videoBoost.findMany({
      where: { userId },
      include: {
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
    });

    return boosts.map(boost => ({
      id: boost.id,
      userId: boost.userId,
      videoId: boost.videoId,
      type: boost.type,
      createdAt: boost.createdAt,
    }));
  }

  async hasUserBoosted(userId: string, videoId: string): Promise<{ hasBoosted: boolean; type?: 'BOOST' | 'DISLIKE' }> {
    const boost = await this.prisma.videoBoost.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
    });

    if (!boost) {
      return { hasBoosted: false };
    }

    return { hasBoosted: true, type: boost.type };
  }

  async getVideoBoostCount(videoId: string): Promise<{ boosts: number; dislikes: number }> {
    const [boosts, dislikes] = await Promise.all([
      this.prisma.videoBoost.count({
        where: { videoId, type: 'BOOST' },
      }),
      this.prisma.videoBoost.count({
        where: { videoId, type: 'DISLIKE' },
      }),
    ]);

    return { boosts, dislikes };
  }

  private async updateVideoBoostCount(videoId: string): Promise<void> {
    const boostCount = await this.prisma.videoBoost.count({
      where: { videoId, type: 'BOOST' },
    });

    await this.prisma.video.update({
      where: { id: videoId },
      data: { boosts: boostCount },
    });
  }
}
