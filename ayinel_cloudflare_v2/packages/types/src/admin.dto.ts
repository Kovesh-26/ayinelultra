import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export enum ReportReason {
  SPAM = 'SPAM',
  INAPPROPRIATE = 'INAPPROPRIATE',
  HARASSMENT = 'HARASSMENT',
  COPYRIGHT = 'COPYRIGHT',
  VIOLENCE = 'VIOLENCE',
  OTHER = 'OTHER',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export class CreateReportDto {
  @IsString()
  targetType: string;

  @IsString()
  targetId: string;

  @IsEnum(ReportReason)
  reason: ReportReason;

  @IsOptional()
  @IsString()
  detail?: string;
}

export class UpdateReportDto {
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}

export class BanUserDto {
  @IsString()
  userId: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsNumber()
  durationDays?: number;
}

export class UpdateFeatureFlagDto {
  @IsString()
  key: string;

  @IsBoolean()
  enabled: boolean;
}

export class CreateTokenPackageDto {
  @IsString()
  title: string;

  @IsNumber()
  tokens: number;

  @IsNumber()
  priceUSD: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ReportResponseDto {
  id: string;
  reporterId: string;
  targetType: string;
  targetId: string;
  reason: ReportReason;
  detail?: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}
