import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, ProfileResponseDto } from '@ayinel/types';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      // Create default profile if it doesn't exist
      return this.createDefaultProfile(userId);
    }

    return this.mapToProfileResponse(profile);
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto
  ): Promise<ProfileResponseDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      // Create profile if it doesn't exist
      const newProfile = await this.prisma.profile.create({
        data: {
          userId,
          ...dto,
        },
      });
      return this.mapToProfileResponse(newProfile);
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data: dto,
    });

    return this.mapToProfileResponse(updatedProfile);
  }

  async getProfileByUsername(username: string): Promise<ProfileResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.profile) {
      return this.createDefaultProfile(user.id);
    }

    return this.mapToProfileResponse(user.profile);
  }

  private async createDefaultProfile(
    userId: string
  ): Promise<ProfileResponseDto> {
    const profile = await this.prisma.profile.create({
      data: {
        userId,
        bio: '',
        fonts: 'default',
        palette: 'default',
      },
    });

    return this.mapToProfileResponse(profile);
  }

  private mapToProfileResponse(profile: any): ProfileResponseDto {
    return {
      id: profile.id,
      userId: profile.userId,
      bio: profile.bio,
      fonts: profile.fonts,
      palette: profile.palette,
      wallpaperUrl: profile.wallpaperUrl,
      musicUrl: profile.musicUrl,
      photoAlbums: profile.photoAlbums,
      links: profile.links,
      history: profile.history,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
