import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateStreamDto {
  title: string;
  description?: string;
  visibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE';
  quality: '720p' | '1080p' | '4K';
}

export interface StreamStatus {
  streamId: string;
  status: 'OFFLINE' | 'LIVE' | 'PROCESSING' | 'ENDED';
  viewerCount: number;
  startTime?: Date;
  duration: number;
  quality: string;
}

@Injectable()
export class LiveService {
  private readonly logger = new Logger(LiveService.name);

  constructor(private prisma: PrismaService) {}

  async createStream(userId: string, dto: CreateStreamDto) {
    try {
      // Generate unique stream ID
      const streamId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create stream record
      const stream = await this.prisma.liveStream.create({
        data: {
          streamId,
          userId,
          title: dto.title,
          description: dto.description,
          visibility: dto.visibility,
          quality: dto.quality,
          status: 'OFFLINE',
          rtmpUrl: `rtmp://live.ayinel.com/live/${streamId}`,
          streamKey: `key_${Math.random().toString(36).substr(2, 16)}`,
          playbackUrl: `https://stream.ayinel.com/${streamId}/index.m3u8`
        }
      });

      this.logger.log(`Stream created: ${streamId} for user: ${userId}`);
      return stream;
    } catch (error) {
      this.logger.error(`Failed to create stream: ${error.message}`);
      throw error;
    }
  }

  async startStream(streamId: string, userId: string) {
    try {
      const stream = await this.prisma.liveStream.findFirst({
        where: { streamId, userId }
      });

      if (!stream) {
        throw new Error('Stream not found or unauthorized');
      }

      const updatedStream = await this.prisma.liveStream.update({
        where: { id: stream.id },
        data: {
          status: 'LIVE',
          startTime: new Date()
        }
      });

      this.logger.log(`Stream started: ${streamId}`);
      return updatedStream;
    } catch (error) {
      this.logger.error(`Failed to start stream: ${error.message}`);
      throw error;
    }
  }

  async endStream(streamId: string, userId: string) {
    try {
      const stream = await this.prisma.liveStream.findFirst({
        where: { streamId, userId }
      });

      if (!stream) {
        throw new Error('Stream not found or unauthorized');
      }

      const duration = stream.startTime 
        ? Math.floor((Date.now() - stream.startTime.getTime()) / 1000)
        : 0;

      const updatedStream = await this.prisma.liveStream.update({
        where: { id: stream.id },
        data: {
          status: 'ENDED',
          endTime: new Date()
        }
      });

      this.logger.log(`Stream ended: ${streamId}, duration: ${duration}s`);
      return updatedStream;
    } catch (error) {
      this.logger.error(`Failed to end stream: ${error.message}`);
      throw error;
    }
  }

  async getStreamStatus(streamId: string): Promise<StreamStatus> {
    try {
      const stream = await this.prisma.liveStream.findUnique({
        where: { streamId }
      });

      if (!stream) {
        throw new Error('Stream not found');
      }

      const duration = stream.startTime && stream.status === 'LIVE'
        ? Math.floor((Date.now() - stream.startTime.getTime()) / 1000)
        : 0;

      return {
        streamId: stream.streamId,
        status: stream.status as any,
        viewerCount: stream.peakViewers,
        startTime: stream.startTime,
        duration,
        quality: stream.quality
      };
    } catch (error) {
      this.logger.error(`Failed to get stream status: ${error.message}`);
      throw error;
    }
  }

  async updateViewerCount(streamId: string, count: number) {
    try {
      await this.prisma.liveStream.update({
        where: { streamId },
        data: {
          peakViewers: Math.max(count, 0),
          totalViews: { increment: count > 0 ? 1 : 0 }
        }
      });
    } catch (error) {
      this.logger.error(`Failed to update viewer count: ${error.message}`);
    }
  }

  async getStreamAnalytics(streamId: string) {
    try {
      const stream = await this.prisma.liveStream.findUnique({
        where: { streamId },
        include: {
          chatMessages: {
            orderBy: { timestamp: 'desc' },
            take: 100
          }
        }
      });

      if (!stream) {
        throw new Error('Stream not found');
      }

      return {
        streamId: stream.streamId,
        peakViewers: stream.peakViewers,
        totalViews: stream.totalViews,
        averageWatchTime: stream.totalViews > 0 ? 300 : 0, // Placeholder
        topRegions: ['US', 'CA', 'UK'], // Placeholder
        deviceTypes: { mobile: 60, desktop: 30, tablet: 10 } // Placeholder
      };
    } catch (error) {
      this.logger.error(`Failed to get stream analytics: ${error.message}`);
      throw error;
    }
  }
}
