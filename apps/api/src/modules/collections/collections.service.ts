import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto, UpdateCollectionDto, AddVideoToCollectionDto, RemoveVideoFromCollectionDto } from './dto/collections.dto';

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateCollectionDto) {
    const collection = await this.prisma.collection.create({
      data: {
        userId,
        ...dto,
        items: {
          create: dto.videoIds?.map(videoId => ({
            videoId
          })) || []
        }
      },
      include: {
        items: {
          include: {
            video: {
              include: {
                owner: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatarUrl: true
                  }
                }
              }
            }
          }
        }
      }
    });

    return collection;
  }

  async findAll(userId?: string, visibility?: string) {
    const where: any = {};
    
    if (visibility === 'public') {
      where.visibility = 'PUBLIC';
    } else if (userId) {
      where.OR = [
        { visibility: 'PUBLIC' },
        { userId }
      ];
    } else {
      where.visibility = 'PUBLIC';
    }

    return this.prisma.collection.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        },
        items: {
          include: {
            video: {
              include: {
                owner: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatarUrl: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: string, userId?: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        },
        items: {
          include: {
            video: {
              include: {
                owner: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatarUrl: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    // Check visibility
    if (collection.visibility === 'PRIVATE' && collection.userId !== userId) {
      throw new ForbiddenException('Collection is private');
    }

    return collection;
  }

  async update(id: string, userId: string, dto: UpdateCollectionDto) {
    const collection = await this.prisma.collection.findUnique({
      where: { id }
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException('You can only update your own collections');
    }

    return this.prisma.collection.update({
      where: { id },
      data: dto,
      include: {
        items: {
          include: {
            video: {
              include: {
                owner: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatarUrl: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async remove(id: string, userId: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id }
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException('You can only delete your own collections');
    }

    return this.prisma.collection.delete({
      where: { id }
    });
  }

  async addVideo(id: string, userId: string, dto: AddVideoToCollectionDto) {
    const collection = await this.prisma.collection.findUnique({
      where: { id }
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException('You can only modify your own collections');
    }

    // Check if video exists
    const video = await this.prisma.video.findUnique({
      where: { id: dto.videoId }
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // Check if video is already in collection
    const existingItem = await this.prisma.collectionItem.findUnique({
      where: {
        collectionId_videoId: {
          collectionId: id,
          videoId: dto.videoId
        }
      }
    });

    if (existingItem) {
      throw new ForbiddenException('Video is already in this collection');
    }

    return this.prisma.collectionItem.create({
      data: {
        collectionId: id,
        videoId: dto.videoId
      },
      include: {
        video: {
          include: {
            owner: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });
  }

  async removeVideo(id: string, userId: string, dto: RemoveVideoFromCollectionDto) {
    const collection = await this.prisma.collection.findUnique({
      where: { id }
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException('You can only modify your own collections');
    }

    const item = await this.prisma.collectionItem.findUnique({
      where: {
        collectionId_videoId: {
          collectionId: id,
          videoId: dto.videoId
        }
      }
    });

    if (!item) {
      throw new NotFoundException('Video not found in collection');
    }

    return this.prisma.collectionItem.delete({
      where: {
        collectionId_videoId: {
          collectionId: id,
          videoId: dto.videoId
        }
      }
    });
  }

  async findByUser(userId: string, targetUserId?: string) {
    const where: any = {};
    
    if (targetUserId) {
      where.userId = targetUserId;
      where.OR = [
        { visibility: 'PUBLIC' },
        { userId: userId } // User can see their own private collections
      ];
    } else {
      where.userId = userId;
    }

    return this.prisma.collection.findMany({
      where,
      include: {
        items: {
          include: {
            video: {
              include: {
                owner: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatarUrl: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
