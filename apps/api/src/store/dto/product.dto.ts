import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  storeId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  priceCents: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsEnum({ PHYSICAL: 'PHYSICAL', DIGITAL: 'DIGITAL' })
  type?: 'PHYSICAL' | 'DIGITAL';
}

export class CreateOrderDto {
  @IsString()
  buyerId: string;

  @IsString()
  storeId: string;

  items: { productId: string; quantity: number }[];
}
