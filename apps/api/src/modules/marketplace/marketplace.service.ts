import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateCustomizationDto {
  name: string;
  description: string;
  type: 'theme' | 'layout' | 'widget' | 'animation' | 'music';
  price: number;
  previewUrl: string;
  files: string[];
  tags: string[];
  category: string;
}

export interface CustomizationItem {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  previewUrl: string;
  seller: {
    id: string;
    name: string;
    handle: string;
    rating: number;
  };
  rating: number;
  sales: number;
  downloads: number;
  tags: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class MarketplaceService {
  private readonly logger = new Logger(MarketplaceService.name);

  constructor(private prisma: PrismaService) {}

  async createCustomization(userId: string, dto: CreateCustomizationDto) {
    try {
      // TODO: Implement real file storage and validation
      const customization = await this.prisma.profileCustomization.create({
        data: {
          name: dto.name,
          description: dto.description,
          type: dto.type,
          price: dto.price,
          previewUrl: dto.previewUrl,
          files: dto.files,
          tags: dto.tags,
          category: dto.category,
          sellerId: userId,
          status: 'PENDING_REVIEW'
        }
      });

      this.logger.log(`Customization created: ${customization.name} by user: ${userId}`);
      return customization;
    } catch (error) {
      this.logger.error(`Failed to create customization: ${error.message}`);
      throw error;
    }
  }

  async getCustomizations(
    page: number = 1,
    limit: number = 20,
    category?: string,
    type?: string,
    search?: string,
    minPrice?: number,
    maxPrice?: number
  ) {
    try {
      const skip = (page - 1) * limit;
      
      const where: any = {
        status: 'APPROVED'
      };

      if (category) where.category = category;
      if (type) where.type = type;
      if (minPrice !== undefined) where.price = { gte: minPrice };
      if (maxPrice !== undefined) where.price = { ...where.price, lte: maxPrice };
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { hasSome: [search] } }
        ];
      }

      const [customizations, total] = await Promise.all([
        this.prisma.profileCustomization.findMany({
          where,
          skip,
          take: limit,
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                handle: true,
                rating: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.profileCustomization.count({ where })
      ]);

      return {
        customizations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      this.logger.error(`Failed to get customizations: ${error.message}`);
      throw error;
    }
  }

  async getCustomizationById(id: string) {
    try {
      const customization = await this.prisma.profileCustomization.findUnique({
        where: { id },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              handle: true,
              rating: true,
              bio: true
            }
          },
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  handle: true
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });

      if (!customization) {
        throw new Error('Customization not found');
      }

      return customization;
    } catch (error) {
      this.logger.error(`Failed to get customization: ${error.message}`);
      throw error;
    }
  }

  async purchaseCustomization(userId: string, customizationId: string) {
    try {
      // Check if user already owns this customization
      const existingPurchase = await this.prisma.customizationPurchase.findFirst({
        where: {
          userId,
          customizationId
        }
      });

      if (existingPurchase) {
        throw new Error('User already owns this customization');
      }

      const customization = await this.prisma.profileCustomization.findUnique({
        where: { id: customizationId },
        include: { seller: true }
      });

      if (!customization) {
        throw new Error('Customization not found');
      }

      // TODO: Integrate with billing system for payment processing
      // For now, create a placeholder purchase record
      const purchase = await this.prisma.customizationPurchase.create({
        data: {
          userId,
          customizationId,
          price: customization.price,
          status: 'COMPLETED'
        }
      });

      // Update seller's earnings
      await this.prisma.user.update({
        where: { id: customization.sellerId },
        data: {
          totalEarnings: { increment: customization.price * 0.8 } // 80% to seller, 20% platform fee
        }
      });

      // Update customization sales count
      await this.prisma.profileCustomization.update({
        where: { id: customizationId },
        data: {
          sales: { increment: 1 }
        }
      });

      this.logger.log(`Customization purchased: ${customizationId} by user: ${userId}`);
      return purchase;
    } catch (error) {
      this.logger.error(`Failed to purchase customization: ${error.message}`);
      throw error;
    }
  }

  async getUserPurchases(userId: string) {
    try {
      const purchases = await this.prisma.customizationPurchase.findMany({
        where: { userId },
        include: {
          customization: {
            select: {
              id: true,
              name: true,
              type: true,
              previewUrl: true,
              category: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return purchases;
    } catch (error) {
      this.logger.error(`Failed to get user purchases: ${error.message}`);
      throw error;
    }
  }

  async getUserSales(userId: string) {
    try {
      const sales = await this.prisma.customizationPurchase.findMany({
        where: {
          customization: { sellerId: userId }
        },
        include: {
          customization: {
            select: {
              id: true,
              name: true,
              type: true,
              price: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              handle: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return sales;
    } catch (error) {
      this.logger.error(`Failed to get user sales: ${error.message}`);
      throw error;
    }
  }

  async searchCustomizations(query: string, filters?: any) {
    try {
      const where: any = {
        status: 'APPROVED',
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } },
          { category: { contains: query, mode: 'insensitive' } }
        ]
      };

      if (filters?.type) where.type = filters.type;
      if (filters?.category) where.category = filters.category;
      if (filters?.minPrice) where.price = { gte: filters.minPrice };
      if (filters?.maxPrice) where.price = { ...where.price, lte: filters.maxPrice };

      const customizations = await this.prisma.profileCustomization.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              handle: true,
              rating: true
            }
          }
        },
        orderBy: { sales: 'desc' },
        take: 20
      });

      return customizations;
    } catch (error) {
      this.logger.error(`Failed to search customizations: ${error.message}`);
      throw error;
    }
  }

  async getCategories() {
    try {
      const categories = await this.prisma.profileCustomization.groupBy({
        by: ['category'],
        _count: {
          category: true
        },
        where: {
          status: 'APPROVED'
        }
      });

      return categories.map(cat => ({
        name: cat.category,
        count: cat._count.category
      }));
    } catch (error) {
      this.logger.error(`Failed to get categories: ${error.message}`);
      return [];
    }
  }

  async getTopSellers() {
    try {
      const topSellers = await this.prisma.user.findMany({
        where: {
          profileCustomizations: {
            some: {
              status: 'APPROVED'
            }
          }
        },
        select: {
          id: true,
          name: true,
          handle: true,
          rating: true,
          totalEarnings: true,
          _count: {
            select: {
              profileCustomizations: {
                where: { status: 'APPROVED' }
              }
            }
          }
        },
        orderBy: { totalEarnings: 'desc' },
        take: 10
      });

      return topSellers;
    } catch (error) {
      this.logger.error(`Failed to get top sellers: ${error.message}`);
      return [];
    }
  }
}
