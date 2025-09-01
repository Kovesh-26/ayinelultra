import { IsString, IsOptional, IsNumber, IsUrl, IsInt, Min } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsOptional()
  externalLinks?: Record<string, any>;
}

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  externalLinks?: Record<string, any>;
}

export class CreateProductDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(1)
  priceTokens: number;

  @IsOptional()
  @IsUrl()
  mediaUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  priceTokens?: number;

  @IsOptional()
  @IsUrl()
  mediaUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;
}

export class ProductResponseDto {
  id: string;
  storeId: string;
  title: string;
  description?: string;
  priceTokens: number;
  mediaUrl?: string;
  stock?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class StoreResponseDto {
  id: string;
  ownerId: string;
  name: string;
  externalLinks?: Record<string, any>;
  products: ProductResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}
