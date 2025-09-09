import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateTrackDto {
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  thumbnailUrl?: string;
  genre?: string;
}

export interface CreatePlaylistDto {
  name: string;
  description?: string;
  isPublic: boolean;
  tracks: string[];
}

@Injectable()
export class MusicService {
  private readonly logger = new Logger(MusicService.name);

  constructor(private prisma: PrismaService) {}

  async createTrack(userId: string, dto: CreateTrackDto) {
    try {
      const track = await this.prisma.musicTrack.create({
        data: {
          ...dto,
          userUploads: {
            create: {
              userId,
            },
          },
        },
      });

      this.logger.log(`Track created: ${track.title} by ${track.artist}`);
      return track;
    } catch (error) {
      this.logger.error(`Failed to create track: ${error.message}`);
      throw error;
    }
  }

  async getTracks(page: number = 1, limit: number = 20, search?: string) {
    try {
      const skip = (page - 1) * limit;

      const where = search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { artist: { contains: search, mode: 'insensitive' } },
              { album: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {};

      const [tracks, total] = await Promise.all([
        this.prisma.musicTrack.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.musicTrack.count({ where }),
      ]);

      return {
        tracks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get tracks: ${error.message}`);
      throw error;
    }
  }

  async createPlaylist(userId: string, dto: CreatePlaylistDto) {
    try {
      const playlist = await this.prisma.playlist.create({
        data: {
          name: dto.name,
          description: dto.description,
          isPublic: dto.isPublic,
          createdBy: userId,
          tracks: {
            create: dto.tracks.map((trackId, index) => ({
              trackId,
              order: index,
            })),
          },
        },
        include: {
          tracks: {
            include: {
              track: true,
            },
            orderBy: { order: 'asc' },
          },
        },
      });

      this.logger.log(`Playlist created: ${playlist.name} by user: ${userId}`);
      return playlist;
    } catch (error) {
      this.logger.error(`Failed to create playlist: ${error.message}`);
      throw error;
    }
  }

  async getPlaylist(playlistId: string) {
    try {
      const playlist = await this.prisma.playlist.findUnique({
        where: { id: playlistId },
        include: {
          tracks: {
            include: {
              track: true,
            },
            orderBy: { order: 'asc' },
          },
          creator: {
            select: {
              id: true,
              name: true,
              handle: true,
            },
          },
        },
      });

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      return playlist;
    } catch (error) {
      this.logger.error(`Failed to get playlist: ${error.message}`);
      throw error;
    }
  }

  async getUserPlaylists(userId: string) {
    try {
      const playlists = await this.prisma.playlist.findMany({
        where: { createdBy: userId },
        include: {
          tracks: {
            include: {
              track: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return playlists;
    } catch (error) {
      this.logger.error(`Failed to get user playlists: ${error.message}`);
      throw error;
    }
  }

  async searchMusic(query: string, type?: string) {
    try {
      const searchResults = await Promise.all([
        // Search tracks
        this.prisma.musicTrack.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { artist: { contains: query, mode: 'insensitive' } },
              { album: { contains: query, mode: 'insensitive' } },
            ],
          },
          take: 10,
        }),
        // Search playlists
        this.prisma.playlist.findMany({
          where: {
            isPublic: true,
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          take: 5,
        }),
      ]);

      return {
        tracks: searchResults[0],
        playlists: searchResults[1],
      };
    } catch (error) {
      this.logger.error(`Failed to search music: ${error.message}`);
      throw error;
    }
  }

  async incrementPlayCount(trackId: string) {
    try {
      await this.prisma.musicTrack.update({
        where: { id: trackId },
        data: {
          playCount: { increment: 1 },
        },
      });
    } catch (error) {
      this.logger.error(`Failed to increment play count: ${error.message}`);
    }
  }
}
