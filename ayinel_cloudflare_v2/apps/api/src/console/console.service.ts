import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConsoleIntegrationDto, ConsoleIntegrationResponseDto } from '@ayinel/types';

@Injectable()
export class ConsoleService {
  constructor(private prisma: PrismaService) {}

  async createConsoleIntegration(userId: string, dto: ConsoleIntegrationDto): Promise<ConsoleIntegrationResponseDto> {
    const integration = await this.prisma.consoleIntegration.create({
      data: {
        userId,
        platform: dto.platform,
        apiKey: dto.apiKey,
        webhookUrl: dto.webhookUrl,
        settings: dto.settings,
        isActive: true,
      },
    });

    return this.mapToConsoleIntegrationResponse(integration);
  }

  async getUserIntegrations(userId: string): Promise<ConsoleIntegrationResponseDto[]> {
    const integrations = await this.prisma.consoleIntegration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return integrations.map(integration => this.mapToConsoleIntegrationResponse(integration));
  }

  async getConsoleIntegration(id: string, userId: string): Promise<ConsoleIntegrationResponseDto> {
    const integration = await this.prisma.consoleIntegration.findFirst({
      where: { id, userId },
    });

    if (!integration) {
      throw new NotFoundException('Console integration not found');
    }

    return this.mapToConsoleIntegrationResponse(integration);
  }

  async updateConsoleIntegration(id: string, userId: string, dto: ConsoleIntegrationDto): Promise<ConsoleIntegrationResponseDto> {
    const integration = await this.prisma.consoleIntegration.findFirst({
      where: { id, userId },
    });

    if (!integration) {
      throw new NotFoundException('Console integration not found');
    }

    const updatedIntegration = await this.prisma.consoleIntegration.update({
      where: { id },
      data: {
        platform: dto.platform,
        apiKey: dto.apiKey,
        webhookUrl: dto.webhookUrl,
        settings: dto.settings,
      },
    });

    return this.mapToConsoleIntegrationResponse(updatedIntegration);
  }

  async deleteConsoleIntegration(id: string, userId: string): Promise<void> {
    const integration = await this.prisma.consoleIntegration.findFirst({
      where: { id, userId },
    });

    if (!integration) {
      throw new NotFoundException('Console integration not found');
    }

    await this.prisma.consoleIntegration.delete({
      where: { id },
    });
  }

  async toggleIntegrationStatus(id: string, userId: string): Promise<ConsoleIntegrationResponseDto> {
    const integration = await this.prisma.consoleIntegration.findFirst({
      where: { id, userId },
    });

    if (!integration) {
      throw new NotFoundException('Console integration not found');
    }

    const updatedIntegration = await this.prisma.consoleIntegration.update({
      where: { id },
      data: {
        isActive: !integration.isActive,
      },
    });

    return this.mapToConsoleIntegrationResponse(updatedIntegration);
  }

  async syncProducts(integrationId: string, userId: string): Promise<any> {
    const integration = await this.prisma.consoleIntegration.findFirst({
      where: { id: integrationId, userId },
    });

    if (!integration) {
      throw new NotFoundException('Console integration not found');
    }

    if (!integration.isActive) {
      throw new BadRequestException('Integration is not active');
    }

    // Sync products based on platform
    return this.syncProductsByPlatform(integration);
  }

  async getAvailablePlatforms(): Promise<any[]> {
    return [
      {
        id: 'amazon',
        name: 'Amazon',
        description: 'Amazon Marketplace integration',
        features: ['Product sync', 'Order management', 'Inventory tracking'],
        logo: 'https://example.com/amazon-logo.png',
        setupGuide: 'https://sellercentral.amazon.com/',
        apiDocs: 'https://developer.amazonservices.com/',
        categories: ['Electronics', 'Books', 'Home & Garden', 'Fashion'],
      },
      {
        id: 'walmart',
        name: 'Walmart',
        description: 'Walmart Marketplace integration',
        features: ['Product listing', 'Order fulfillment', 'Analytics'],
        logo: 'https://example.com/walmart-logo.png',
        setupGuide: 'https://marketplace.walmart.com/',
        apiDocs: 'https://developer.walmart.com/',
        categories: ['Electronics', 'Home', 'Grocery', 'Toys'],
      },
      {
        id: 'etsy',
        name: 'Etsy',
        description: 'Etsy marketplace for handmade and vintage items',
        features: ['Shop management', 'Order processing', 'Analytics'],
        logo: 'https://example.com/etsy-logo.png',
        setupGuide: 'https://www.etsy.com/seller-handbook/',
        apiDocs: 'https://developer.etsy.com/',
        categories: ['Handmade', 'Vintage', 'Crafts', 'Art'],
      },
      {
        id: 'ebay',
        name: 'eBay',
        description: 'eBay marketplace integration',
        features: ['Listing management', 'Order processing', 'Feedback system'],
        logo: 'https://example.com/ebay-logo.png',
        setupGuide: 'https://pages.ebay.com/seller-center/',
        apiDocs: 'https://developer.ebay.com/',
        categories: ['Electronics', 'Collectibles', 'Fashion', 'Home & Garden'],
      },
      {
        id: 'shopify',
        name: 'Shopify',
        description: 'Shopify e-commerce platform',
        features: ['Store management', 'Order processing', 'Analytics'],
        logo: 'https://example.com/shopify-logo.png',
        setupGuide: 'https://help.shopify.com/',
        apiDocs: 'https://shopify.dev/api',
        categories: ['All categories supported'],
      },
      {
        id: 'woocommerce',
        name: 'WooCommerce',
        description: 'WordPress e-commerce plugin',
        features: ['Store management', 'Order processing', 'Extensions'],
        logo: 'https://example.com/woocommerce-logo.png',
        setupGuide: 'https://docs.woocommerce.com/',
        apiDocs: 'https://woocommerce.github.io/woocommerce-rest-api-docs/',
        categories: ['All categories supported'],
      },
      {
        id: 'bigcommerce',
        name: 'BigCommerce',
        description: 'BigCommerce e-commerce platform',
        features: ['Store management', 'Multi-channel selling', 'Analytics'],
        logo: 'https://example.com/bigcommerce-logo.png',
        setupGuide: 'https://support.bigcommerce.com/',
        apiDocs: 'https://developer.bigcommerce.com/',
        categories: ['All categories supported'],
      },
      {
        id: 'magento',
        name: 'Magento',
        description: 'Adobe Magento e-commerce platform',
        features: ['Enterprise e-commerce', 'B2B capabilities', 'Analytics'],
        logo: 'https://example.com/magento-logo.png',
        setupGuide: 'https://docs.magento.com/',
        apiDocs: 'https://developer.adobe.com/commerce/webapi/',
        categories: ['All categories supported'],
      },
      {
        id: 'prestashop',
        name: 'PrestaShop',
        description: 'PrestaShop e-commerce platform',
        features: ['Store management', 'Multi-store', 'Modules'],
        logo: 'https://example.com/prestashop-logo.png',
        setupGuide: 'https://doc.prestashop.com/',
        apiDocs: 'https://devdocs.prestashop.com/',
        categories: ['All categories supported'],
      },
      {
        id: 'opencart',
        name: 'OpenCart',
        description: 'OpenCart e-commerce platform',
        features: ['Store management', 'Extensions', 'Multi-store'],
        logo: 'https://example.com/opencart-logo.png',
        setupGuide: 'https://docs.opencart.com/',
        apiDocs: 'https://docs.opencart.com/developer/',
        categories: ['All categories supported'],
      },
    ];
  }

  async getPlatformCategories(platform: string): Promise<any[]> {
    const platformData = {
      amazon: [
        { id: 'electronics', name: 'Electronics', subcategories: ['Computers', 'Phones', 'TV & Video', 'Audio'] },
        { id: 'books', name: 'Books', subcategories: ['Fiction', 'Non-Fiction', 'Educational', 'Children'] },
        { id: 'home', name: 'Home & Garden', subcategories: ['Kitchen', 'Furniture', 'Garden', 'Tools'] },
        { id: 'fashion', name: 'Fashion', subcategories: ['Clothing', 'Shoes', 'Jewelry', 'Accessories'] },
      ],
      walmart: [
        { id: 'electronics', name: 'Electronics', subcategories: ['Computers', 'Phones', 'TV & Video'] },
        { id: 'home', name: 'Home', subcategories: ['Kitchen', 'Furniture', 'Decor'] },
        { id: 'grocery', name: 'Grocery', subcategories: ['Fresh Food', 'Pantry', 'Beverages'] },
        { id: 'toys', name: 'Toys', subcategories: ['Action Figures', 'Board Games', 'Educational'] },
      ],
      etsy: [
        { id: 'handmade', name: 'Handmade', subcategories: ['Jewelry', 'Clothing', 'Home Decor', 'Art'] },
        { id: 'vintage', name: 'Vintage', subcategories: ['Clothing', 'Jewelry', 'Home', 'Collectibles'] },
        { id: 'crafts', name: 'Crafts', subcategories: ['Supplies', 'Kits', 'Finished Items'] },
        { id: 'art', name: 'Art', subcategories: ['Paintings', 'Photography', 'Sculptures', 'Digital'] },
      ],
      ebay: [
        { id: 'electronics', name: 'Electronics', subcategories: ['Computers', 'Phones', 'Cameras', 'Audio'] },
        { id: 'collectibles', name: 'Collectibles', subcategories: ['Coins', 'Stamps', 'Trading Cards', 'Antiques'] },
        { id: 'fashion', name: 'Fashion', subcategories: ['Clothing', 'Shoes', 'Jewelry', 'Watches'] },
        { id: 'home', name: 'Home & Garden', subcategories: ['Furniture', 'Garden', 'Tools', 'Decor'] },
      ],
    };

    return platformData[platform] || [];
  }

  async getIntegrationStats(integrationId: string, userId: string): Promise<any> {
    const integration = await this.prisma.consoleIntegration.findFirst({
      where: { id: integrationId, userId },
    });

    if (!integration) {
      throw new NotFoundException('Console integration not found');
    }

    // Mock stats - in production, fetch from actual platform APIs
    return {
      platform: integration.platform,
      totalProducts: Math.floor(Math.random() * 1000) + 100,
      activeListings: Math.floor(Math.random() * 500) + 50,
      totalOrders: Math.floor(Math.random() * 1000) + 200,
      totalRevenue: Math.floor(Math.random() * 50000) + 5000,
      averageRating: (Math.random() * 2 + 3).toFixed(1),
      lastSync: new Date().toISOString(),
    };
  }

  private async syncProductsByPlatform(integration: any): Promise<any> {
    // Mock sync process - in production, make actual API calls
    const syncResults = {
      platform: integration.platform,
      status: 'completed',
      productsSynced: Math.floor(Math.random() * 100) + 10,
      ordersSynced: Math.floor(Math.random() * 50) + 5,
      errors: [],
      timestamp: new Date().toISOString(),
    };

    // Log sync activity
    await this.prisma.consoleSyncLog.create({
      data: {
        consoleIntegrationId: integration.id,
        status: syncResults.status,
        productsSynced: syncResults.productsSynced,
        ordersSynced: syncResults.ordersSynced,
        errors: syncResults.errors,
      },
    });

    return syncResults;
  }

  private mapToConsoleIntegrationResponse(integration: any): ConsoleIntegrationResponseDto {
    return {
      id: integration.id,
      userId: integration.userId,
      platform: integration.platform,
      webhookUrl: integration.webhookUrl,
      settings: integration.settings,
      isActive: integration.isActive,
      createdAt: integration.createdAt,
      updatedAt: integration.updatedAt,
    };
  }
}
