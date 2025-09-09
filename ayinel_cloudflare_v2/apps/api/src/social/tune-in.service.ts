import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TuneInDto, TuneInResponseDto } from '@ayinel/types';

@Injectable()
export class TuneInService {
  constructor(private prisma: PrismaService) {}

  async tuneInToUser(
    followerId: string,
    dto: TuneInDto
  ): Promise<TuneInResponseDto> {
    if (followerId === dto.followedId) {
      throw new BadRequestException('You cannot tune in to yourself');
    }

    // Check if user exists
    const followedUser = await this.prisma.user.findUnique({
      where: { id: dto.followedId },
    });

    if (!followedUser) {
      throw new NotFoundException('User not found');
    }

    // Check if already tuned in
    const existingTuneIn = await this.prisma.tuneIn.findUnique({
      where: {
        followerId_followedId: {
          followerId,
          followedId: dto.followedId,
        },
      },
    });

    if (existingTuneIn) {
      throw new BadRequestException('Already tuned in to this user');
    }

    const tuneIn = await this.prisma.tuneIn.create({
      data: {
        followerId,
        followedId: dto.followedId,
      },
    });

    return {
      id: tuneIn.id,
      followerId: tuneIn.followerId,
      followedId: tuneIn.followedId,
      createdAt: tuneIn.createdAt,
    };
  }

  async untuneFromUser(followerId: string, followedId: string): Promise<void> {
    const tuneIn = await this.prisma.tuneIn.findUnique({
      where: {
        followerId_followedId: {
          followerId,
          followedId,
        },
      },
    });

    if (!tuneIn) {
      throw new NotFoundException('Tune-in relationship not found');
    }

    await this.prisma.tuneIn.delete({
      where: { id: tuneIn.id },
    });
  }

  async getTuneInsByUser(userId: string): Promise<TuneInResponseDto[]> {
    const tuneIns = await this.prisma.tuneIn.findMany({
      where: { followerId: userId },
      include: {
        followed: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    return tuneIns.map((tuneIn) => ({
      id: tuneIn.id,
      followerId: tuneIn.followerId,
      followedId: tuneIn.followedId,
      createdAt: tuneIn.createdAt,
    }));
  }

  async getTuneInCrew(userId: string): Promise<TuneInResponseDto[]> {
    const tuneIns = await this.prisma.tuneIn.findMany({
      where: { followedId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    return tuneIns.map((tuneIn) => ({
      id: tuneIn.id,
      followerId: tuneIn.followerId,
      followedId: tuneIn.followedId,
      createdAt: tuneIn.createdAt,
    }));
  }

  async isTunedIn(followerId: string, followedId: string): Promise<boolean> {
    const tuneIn = await this.prisma.tuneIn.findUnique({
      where: {
        followerId_followedId: {
          followerId,
          followedId,
        },
      },
    });

    return !!tuneIn;
  }

  async getTuneInCount(
    userId: string
  ): Promise<{ following: number; crew: number }> {
    const [following, crew] = await Promise.all([
      this.prisma.tuneIn.count({
        where: { followerId: userId },
      }),
      this.prisma.tuneIn.count({
        where: { followedId: userId },
      }),
    ]);

    return { following, crew };
  }
}
