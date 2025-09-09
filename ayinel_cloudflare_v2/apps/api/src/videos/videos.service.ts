import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateVideoDto,
  UpdateVideoDto,
  VideoResponseDto,
} from '@ayinel/types';

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  async createVideo(
    studioId: string,
    dto: CreateVideoDto
  ): Promise<VideoResponseDto> {
    const studio = await this.prisma.studio.findUnique({
      where: { id: studioId },
    });

    if (!studio) {
      throw new NotFoundException('Studio not found');
    }

    const video = await this.prisma.video.create({
      data: {
        studioId,
        title: dto.title,
        description: dto.description,
        visibility: dto.visibility || 'PRIVATE',
        tags: dto.tags || [],
        status: 'DRAFT',
      },
    });

    return this.mapToVideoResponse(video);
  }

  async findAll(visibility: string = 'PUBLIC'): Promise<VideoResponseDto[]> {
    const videos = await this.prisma.video.findMany({
      where: {
        AND: [{ visibility: visibility as any }, { status: 'READY' }],
      },
      include: {
        studio: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return videos.map((video) => this.mapToVideoResponse(video));
  }

  async findById(id: string): Promise<VideoResponseDto> {
    const video = await this.prisma.video.findUnique({
      where: { id },
      include: {
        studio: true,
      },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return this.mapToVideoResponse(video);
  }

  async findByStudioId(studioId: string): Promise<VideoResponseDto[]> {
    const videos = await this.prisma.video.findMany({
      where: { studioId },
      orderBy: { createdAt: 'desc' },
    });

    return videos.map((video) => this.mapToVideoResponse(video));
  }

  async updateVideo(
    id: string,
    dto: UpdateVideoDto
  ): Promise<VideoResponseDto> {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    const updatedVideo = await this.prisma.video.update({
      where: { id },
      data: dto,
    });

    return this.mapToVideoResponse(updatedVideo);
  }

  async deleteVideo(id: string): Promise<void> {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    await this.prisma.video.delete({
      where: { id },
    });
  }

  async incrementViews(id: string): Promise<void> {
    await this.prisma.video.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  async searchVideos(query: string): Promise<VideoResponseDto[]> {
    const videos = await this.prisma.video.findMany({
      where: {
        AND: [
          { visibility: 'PUBLIC' },
          { status: 'READY' },
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { tags: { hasSome: [query] } },
            ],
          },
        ],
      },
      include: {
        studio: true,
      },
      take: 20,
      orderBy: { views: 'desc' },
    });

    return videos.map((video) => this.mapToVideoResponse(video));
  }

  async getTrendingVideos(): Promise<VideoResponseDto[]> {
    const videos = await this.prisma.video.findMany({
      where: {
        AND: [{ visibility: 'PUBLIC' }, { status: 'READY' }],
      },
      include: {
        studio: true,
      },
      take: 20,
      orderBy: { views: 'desc' },
    });

    return videos.map((video) => this.mapToVideoResponse(video));
  }

  async getRecentVideos(): Promise<VideoResponseDto[]> {
    const videos = await this.prisma.video.findMany({
      where: {
        AND: [{ visibility: 'PUBLIC' }, { status: 'READY' }],
      },
      include: {
        studio: true,
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    return videos.map((video) => this.mapToVideoResponse(video));
  }

  private mapToVideoResponse(video: any): VideoResponseDto {
    return {
      id: video.id,
      studioId: video.studioId,
      title: video.title,
      description: video.description,
      status: video.status,
      visibility: video.visibility,
      duration: video.duration,
      views: video.views,
      boosts: video.boosts || 0,
      tags: video.tags,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    };
  }
}
