import {
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsArray,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ContentRating, KidAgeGroup } from '@prisma/client';

export class CreateKidProfileDto {
  @IsString()
  displayName: string;

  @IsEnum(KidAgeGroup)
  ageGroup: KidAgeGroup;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class UpdateKidSettingsDto {
  @IsOptional()
  @IsBoolean()
  safeSearch?: boolean;

  @IsOptional()
  @IsEnum(ContentRating)
  maxRating?: ContentRating;

  @IsOptional()
  @IsBoolean()
  chatEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  dmsEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  tuneInAllowed?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1440) // 24 hours in minutes
  timeLimitsMin?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  blockedTags?: string[];
}

export class GuardianConsentDto {
  @IsString()
  guardianEmail: string;

  @IsString()
  childDisplayName: string;

  @IsEnum(KidAgeGroup)
  ageGroup: KidAgeGroup;
}

export class AgeVerificationDto {
  @IsString()
  dateOfBirth: string; // ISO date string
}
