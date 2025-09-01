import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  async tuneIn(followerId: string, followeeId: string) {
    if (followerId === followeeId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    return this.prisma.follow.upsert({
      where: { followerId_followeeId: { followerId, followeeId } },
      update: {},
      create: { followerId, followeeId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        followee: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async unTuneIn(followerId: string, followeeId: string) {
    return this.prisma.follow.delete({
      where: { followerId_followeeId: { followerId, followeeId } },
    });
  }

  async counts(userId: string) {
    const [crew, following] = await this.prisma.$transaction([
      this.prisma.follow.count({ where: { followeeId: userId } }), // Crew
      this.prisma.follow.count({ where: { followerId: userId } }), // Following
    ]);

    return { crew, following };
  }

  async getFollowers(userId: string) {
    return this.prisma.follow.findMany({
      where: { followeeId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFollowing(userId: string) {
    return this.prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        followee: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async isFollowing(followerId: string, followeeId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: { followerId_followeeId: { followerId, followeeId } },
    });
    return !!follow;
  }
}
