import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudioDto, UpdateStudioDto } from './dto';

@Injectable()
export class StudiosService {
  constructor(private _prisma: PrismaService) {}

  async create(userId: string, createStudioDto: CreateStudioDto) {
    const studio = await this._prisma.studio.create({
      data: {
        ...createStudioDto,
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            handle: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    return studio;
  }

  async findById(id: string) {
    const studio = await this._prisma.studio.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            handle: true,
            displayName: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            videos: true,
            followers: true,
          },
        },
      },
    });

    if (!studio) {
      throw new NotFoundException('Studio not found');
    }

    return studio;
  }

  async findByHandle(handle: string) {
    const studio = await this._prisma.studio.findUnique({
      where: { handle },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            handle: true,
            displayName: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            videos: true,
            followers: true,
          },
        },
      },
    });

    if (!studio) {
      throw new NotFoundException('Studio not found');
    }

    return studio;
  }

  async findByOwner(userId: string) {
    return this._prisma.studio.findMany({
      where: { ownerId: userId },
      include: {
        _count: {
          select: {
            videos: true,
            followers: true,
          },
        },
      },
    });
  }

  async update(id: string, userId: string, updateStudioDto: UpdateStudioDto) {
    const studio = await this._prisma.studio.findUnique({
      where: { id },
    });

    if (!studio) {
      throw new NotFoundException('Studio not found');
    }

    if (studio.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own studio');
    }

    return this._prisma.studio.update({
      where: { id },
      data: updateStudioDto,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            handle: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async delete(id: string, userId: string) {
    const studio = await this._prisma.studio.findUnique({
      where: { id },
    });

    if (!studio) {
      throw new NotFoundException('Studio not found');
    }

    if (studio.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own studio');
    }

    await this._prisma.studio.delete({
      where: { id },
    });

    return { message: 'Studio deleted successfully' };
  }

  async searchStudios(query: string, limit = 10) {
    return this._prisma.studio.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { handle: { contains: query, mode: 'insensitive' } },
        ],
        isPublic: true,
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            handle: true,
            displayName: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            videos: true,
            followers: true,
          },
        },
      },
      take: limit,
    });
  }

  async followStudio(studioId: string, userId: string) {
    const existingFollow = await this._prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId: studioId,
      },
    });

    if (existingFollow) {
      throw new ForbiddenException('You are already following this studio');
    }

    return this._prisma.follow.create({
      data: {
        followerId: userId,
        followingId: studioId,
      },
    });
  }

  async unfollowStudio(studioId: string, userId: string) {
    const follow = await this._prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId: studioId,
      },
    });

    if (!follow) {
      throw new ForbiddenException('You are not following this studio');
    }

    await this._prisma.follow.delete({
      where: { id: follow.id },
    });

    return { message: 'Unfollowed successfully' };
  }
}
