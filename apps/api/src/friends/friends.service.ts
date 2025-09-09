import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async request(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException('Cannot friend yourself');
    }

    // Ensure stable ordering to avoid duplicates
    const [aId, bId] =
      userId < targetUserId ? [userId, targetUserId] : [targetUserId, userId];

    return this.prisma.friendship.upsert({
      where: { aId_bId: { aId, bId } },
      update: {},
      create: { aId, bId, status: 'PENDING' },
      include: {
        a: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        b: {
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

  async accept(aId: string, bId: string) {
    const [x, y] = aId < bId ? [aId, bId] : [bId, aId];

    return this.prisma.friendship.update({
      where: { aId_bId: { aId: x, bId: y } },
      data: { status: 'ACCEPTED' },
      include: {
        a: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        b: {
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

  async list(userId: string) {
    return this.prisma.friendship.findMany({
      where: {
        OR: [{ aId: userId }, { bId: userId }],
        status: 'ACCEPTED',
      },
      include: {
        a: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        b: {
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

  async getPendingRequests(userId: string) {
    return this.prisma.friendship.findMany({
      where: {
        bId: userId, // Only requests where user is the target
        status: 'PENDING',
      },
      include: {
        a: {
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

  async block(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException('Cannot block yourself');
    }

    const [aId, bId] =
      userId < targetUserId ? [userId, targetUserId] : [targetUserId, userId];

    return this.prisma.friendship.upsert({
      where: { aId_bId: { aId, bId } },
      update: { status: 'BLOCKED' },
      create: { aId, bId, status: 'BLOCKED' },
    });
  }
}
