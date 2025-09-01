import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto, UpdateCollectionDto, AddToCollectionDto, CollectionResponseDto } from '@ayinel/types';

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  async createCollection(ownerId: string, dto: CreateCollectionDto): Promise<CollectionResponseDto> {
    const collection = await this.prisma.collection.create({
      data: {
        ownerId,
        title: dto.title,
        isPublic: dto.isPublic || true,
      },
    });

    return this.mapToCollectionResponse(collection);
  }

  async findAll(ownerId?: string): Promise<CollectionResponseDto[]> {
    const where = ownerId 
      ? { ownerId }
      : { isPublic: true };

    const collections = await this.prisma.collection.findMany({
      where,
      include: {
        items: {
          include: {
            video: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return collections.map(collection => this.mapToCollectionResponse(collection));
  }

  async findById(id: string): Promise<CollectionResponseDto> {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            video: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    return this.mapToCollectionResponse(collection);
  }

  async updateCollection(id: string, dto: UpdateCollectionDto): Promise<CollectionResponseDto> {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    const updatedCollection = await this.prisma.collection.update({
      where: { id },
      data: dto,
    });

    return this.mapToCollectionResponse(updatedCollection);
  }

  async deleteCollection(id: string): Promise<void> {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    await this.prisma.collection.delete({
      where: { id },
    });
  }

  async addToCollection(collectionId: string, dto: AddToCollectionDto): Promise<void> {
    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    const video = await this.prisma.video.findUnique({
      where: { id: dto.videoId },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // Get the highest order number in the collection
    const maxOrder = await this.prisma.collectionItem.aggregate({
      where: { collectionId },
      _max: { order: true },
    });

    const newOrder = (maxOrder._max.order || 0) + 1;

    await this.prisma.collectionItem.create({
      data: {
        collectionId,
        videoId: dto.videoId,
        order: newOrder,
      },
    });
  }

  async removeFromCollection(collectionId: string, videoId: string): Promise<void> {
    const collectionItem = await this.prisma.collectionItem.findUnique({
      where: {
        collectionId_videoId: {
          collectionId,
          videoId,
        },
      },
    });

    if (!collectionItem) {
      throw new NotFoundException('Video not found in collection');
    }

    await this.prisma.collectionItem.delete({
      where: {
        collectionId_videoId: {
          collectionId,
          videoId,
        },
      },
    });

    // Reorder remaining items
    await this.reorderCollectionItems(collectionId);
  }

  async reorderCollectionItems(collectionId: string): Promise<void> {
    const items = await this.prisma.collectionItem.findMany({
      where: { collectionId },
      orderBy: { order: 'asc' },
    });

    for (let i = 0; i < items.length; i++) {
      await this.prisma.collectionItem.update({
        where: { id: items[i].id },
        data: { order: i + 1 },
      });
    }
  }

  async searchCollections(query: string): Promise<CollectionResponseDto[]> {
    const collections = await this.prisma.collection.findMany({
      where: {
        AND: [
          { isPublic: true },
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      include: {
        items: {
          include: {
            video: true,
          },
        },
      },
      take: 10,
    });

    return collections.map(collection => this.mapToCollectionResponse(collection));
  }

  private mapToCollectionResponse(collection: any): CollectionResponseDto {
    return {
      id: collection.id,
      ownerId: collection.ownerId,
      title: collection.title,
      isPublic: collection.isPublic,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
    };
  }
}
