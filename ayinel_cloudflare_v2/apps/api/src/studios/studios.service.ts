import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudioDto, UpdateStudioDto, StudioResponseDto } from '@ayinel/types';

@Injectable()
export class StudiosService {
  constructor(private prisma: PrismaService) {}

  async createStudio(ownerId: string, dto: CreateStudioDto): Promise<StudioResponseDto> {
    // Check if handle is unique
    const existingStudio = await this.prisma.studio.findUnique({
      where: { handle: dto.handle },
    });

    if (existingStudio) {
      throw new BadRequestException('Studio handle already exists');
    }

    // Check if user already has a studio
    const existingUserStudio = await this.prisma.studio.findUnique({
      where: { ownerId },
    });

    if (existingUserStudio) {
      throw new BadRequestException('User already has a studio');
    }

    const studio = await this.prisma.studio.create({
      data: {
        ownerId,
        name: dto.name,
        handle: dto.handle,
        about: dto.about,
        bannerUrl: dto.bannerUrl,
        isCreator: false, // Default to false, can be upgraded later
      },
    });

    return this.mapToStudioResponse(studio);
  }

  async findAll(): Promise<StudioResponseDto[]> {
    const studios = await this.prisma.studio.findMany({
      where: { isCreator: true }, // Only show creator studios
    });

    return studios.map(studio => this.mapToStudioResponse(studio));
  }

  async findById(id: string): Promise<StudioResponseDto> {
    const studio = await this.prisma.studio.findUnique({
      where: { id },
    });

    if (!studio) {
      throw new NotFoundException('Studio not found');
    }

    return this.mapToStudioResponse(studio);
  }

  async findByHandle(handle: string): Promise<StudioResponseDto> {
    const studio = await this.prisma.studio.findUnique({
      where: { handle },
    });

    if (!studio) {
      throw new NotFoundException('Studio not found');
    }

    return this.mapToStudioResponse(studio);
  }

  async findByOwnerId(ownerId: string): Promise<StudioResponseDto> {
    const studio = await this.prisma.studio.findUnique({
      where: { ownerId },
    });

    if (!studio) {
      throw new NotFoundException('Studio not found');
    }

    return this.mapToStudioResponse(studio);
  }

  async updateStudio(id: string, dto: UpdateStudioDto): Promise<StudioResponseDto> {
    const studio = await this.prisma.studio.findUnique({
      where: { id },
    });

    if (!studio) {
      throw new NotFoundException('Studio not found');
    }

    // Check if handle is being changed and if it's unique
    if (dto.handle && dto.handle !== studio.handle) {
      const existingStudio = await this.prisma.studio.findUnique({
        where: { handle: dto.handle },
      });

      if (existingStudio) {
        throw new BadRequestException('Studio handle already exists');
      }
    }

    const updatedStudio = await this.prisma.studio.update({
      where: { id },
      data: dto,
    });

    return this.mapToStudioResponse(updatedStudio);
  }

  async upgradeToCreator(id: string): Promise<StudioResponseDto> {
    const studio = await this.prisma.studio.findUnique({
      where: { id },
    });

    if (!studio) {
      throw new NotFoundException('Studio not found');
    }

    const updatedStudio = await this.prisma.studio.update({
      where: { id },
      data: { isCreator: true },
    });

    return this.mapToStudioResponse(updatedStudio);
  }

  async searchStudios(query: string): Promise<StudioResponseDto[]> {
    const studios = await this.prisma.studio.findMany({
      where: {
        AND: [
          { isCreator: true },
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { handle: { contains: query, mode: 'insensitive' } },
              { about: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      take: 10,
    });

    return studios.map(studio => this.mapToStudioResponse(studio));
  }

  private mapToStudioResponse(studio: any): StudioResponseDto {
    return {
      id: studio.id,
      ownerId: studio.ownerId,
      name: studio.name,
      handle: studio.handle,
      bannerUrl: studio.bannerUrl,
      about: studio.about,
      isCreator: studio.isCreator,
      createdAt: studio.createdAt,
      updatedAt: studio.updatedAt,
    };
  }
}
