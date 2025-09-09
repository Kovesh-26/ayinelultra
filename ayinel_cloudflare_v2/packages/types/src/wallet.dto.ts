import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export enum TransactionType {
  PURCHASE = 'PURCHASE',
  TIP = 'TIP',
  BOOST = 'BOOST',
  STORE = 'STORE',
  MEMBERSHIP = 'MEMBERSHIP',
  PAYOUT = 'PAYOUT',
  BONUS = 'BONUS',
  REFUND = 'REFUND',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export class PurchaseTokensDto {
  @IsString()
  packageId: string;

  @IsOptional()
  @IsString()
  paymentMethod?: 'stripe' | 'paypal' | 'cashapp';
}

export class SpendTokensDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  @Min(1)
  amountTokens: number;

  @IsOptional()
  @IsString()
  targetType?: string;

  @IsOptional()
  @IsString()
  targetId?: string;
}

export class TipDto {
  @IsString()
  targetId: string;

  @IsString()
  targetType: 'user' | 'studio';

  @IsNumber()
  @Min(1)
  amountTokens: number;
}

export class BoostDto {
  @IsString()
  videoId: string;

  @IsNumber()
  @Min(1)
  amountTokens: number;
}

export class WalletResponseDto {
  id: string;
  userId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export class TransactionResponseDto {
  id: string;
  userId: string;
  type: TransactionType;
  amountTokens: number;
  amountUSD?: number;
  targetType?: string;
  targetId?: string;
  status: TransactionStatus;
  createdAt: Date;
}
