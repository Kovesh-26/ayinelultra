import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('products')
  async getProducts() {
    return this.marketplaceService.getProducts();
  }

  @Post('products')
  @UseGuards(JwtAuthGuard)
  async createProduct(@Request() req: any, @Body() productData: any) {
    return this.marketplaceService.createProduct(productData);
  }
}