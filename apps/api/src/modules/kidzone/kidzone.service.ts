import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateKidProfileDto,
  UpdateKidSettingsDto,
  GuardianConsentDto,
  AgeVerificationDto,
} from './dto/kidzone.dto';
import { ContentRating, KidAgeGroup } from '@prisma/client';

@Injectable()
export class KidzoneService {
  constructor(private prisma: PrismaService) {}

  // KidZone Feed - Get safe content for kids
  async getKidZoneFeed(userId?: string, ageGroup?: KidAgeGroup) {
    const where: any = {
      isKidSafe: true,
      contentRating: {
        in: [ContentRating.G, ContentRating.PG, ContentRating.PG13],
      },
      visibility: 'PUBLIC',
    };

    // If user has kid settings, apply additional filters
    if (userId) {
      const kidSettings = await this.prisma.kidSettings.findUnique({
        where: { userId },
      });

      if (kidSettings) {
        where.contentRating = {
          in: this.getContentRatingsForMaxRating(kidSettings.maxRating),
        };
      }
    }

    const videos = await this.prisma.video.findMany({
      where,
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
            isFamilyFriendly: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return {
      videos: videos.filter(
        (video) => !video.studio || video.studio.isFamilyFriendly
      ),
      total: videos.length,
    };
  }

  // Get family-friendly studios
  async getFamilyFriendlyStudios() {
    return this.prisma.studio.findMany({
      where: {
        isFamilyFriendly: true,
        kidzoneVisible: true,
      },
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
            videos: {
              where: {
                isKidSafe: true,
                contentRating: {
                  in: [ContentRating.G, ContentRating.PG, ContentRating.PG13],
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Create kid profile
  async createKidProfile(guardianId: string, dto: CreateKidProfileDto) {
    return this.prisma.kidProfile.create({
      data: {
        guardianId,
        ...dto,
      },
    });
  }

  // Get kid profiles for guardian
  async getKidProfiles(guardianId: string) {
    return this.prisma.kidProfile.findMany({
      where: { guardianId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Update kid settings
  async updateKidSettings(userId: string, dto: UpdateKidSettingsDto) {
    return this.prisma.kidSettings.upsert({
      where: { userId },
      update: dto,
      create: {
        userId,
        ...dto,
      },
    });
  }

  // Get kid settings
  async getKidSettings(userId: string) {
    return this.prisma.kidSettings.findUnique({
      where: { userId },
    });
  }

  // Age verification
  async verifyAge(userId: string, dto: AgeVerificationDto) {
    const dateOfBirth = new Date(dto.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
    ) {
      // Birthday hasn't occurred this year
      age--;
    }

    const isMinor = age < 18;

    // Update user with age information
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        dateOfBirth,
        isMinor,
      },
    });

    // If minor, create default kid settings
    if (isMinor) {
      await this.updateKidSettings(userId, {
        safeSearch: true,
        maxRating: ContentRating.PG13,
        chatEnabled: false,
        dmsEnabled: false,
        tuneInAllowed: true,
      });
    }

    return {
      user,
      isMinor,
      age,
    };
  }

  // Guardian consent
  async requestGuardianConsent(userId: string, dto: GuardianConsentDto) {
    // In a real implementation, you would:
    // 1. Send email to guardian
    // 2. Generate verification token
    // 3. Store pending consent request

    // For now, we'll just update the user with guardian info
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        guardianEmail: dto.guardianEmail,
        isMinor: true,
      },
    });
  }

  // Verify guardian consent
  async verifyGuardianConsent(userId: string, token: string) {
    // In a real implementation, you would verify the token
    // For now, we'll just mark as verified
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        guardianVerifiedAt: new Date(),
      },
    });
  }

  // Helper method to get content ratings based on max rating
  private getContentRatingsForMaxRating(
    maxRating: ContentRating
  ): ContentRating[] {
    const ratings = [
      ContentRating.G,
      ContentRating.PG,
      ContentRating.PG13,
      ContentRating.R,
      ContentRating.NC17,
    ];
    const maxIndex = ratings.indexOf(maxRating);
    return ratings.slice(0, maxIndex + 1);
  }

  // Check if content is safe for kid
  async isContentSafeForKid(
    videoId: string,
    userId?: string
  ): Promise<boolean> {
    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
      include: {
        studio: true,
      },
    });

    if (!video) return false;

    // Basic safety checks
    if (!video.isKidSafe) return false;
    if (
      video.contentRating === ContentRating.R ||
      video.contentRating === ContentRating.NC17
    )
      return false;
    if (video.studio && !video.studio.isFamilyFriendly) return false;

    // If user has kid settings, apply additional filters
    if (userId) {
      const kidSettings = await this.prisma.kidSettings.findUnique({
        where: { userId },
      });

      if (kidSettings) {
        const allowedRatings = this.getContentRatingsForMaxRating(
          kidSettings.maxRating
        );
        if (!allowedRatings.includes(video.contentRating)) return false;
      }
    }

    return true;
  }
}
