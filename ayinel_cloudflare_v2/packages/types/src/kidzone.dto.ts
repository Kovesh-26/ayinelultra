import {
  IsString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  Max,
} from 'class-validator';

export class CreateKidProfileDto {
  @IsString()
  nickName: string;

  @IsEmail()
  guardianEmail: string;

  @IsNumber()
  @Min(0)
  @Max(17)
  age: number;

  @IsOptional()
  learningPrefs?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  safeContacts?: string[];
}

export class UpdateKidProfileDto {
  @IsOptional()
  @IsString()
  nickName?: string;

  @IsOptional()
  @IsEmail()
  guardianEmail?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(17)
  age?: number;

  @IsOptional()
  learningPrefs?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  safeContacts?: string[];
}

export class GuardianConsentDto {
  @IsString()
  kidUserId: string;

  @IsEmail()
  guardianEmail: string;

  @IsString()
  consentToken: string;
}

export class KidProfileResponseDto {
  id: string;
  userId: string;
  nickName: string;
  guardianEmail: string;
  age: number;
  learningPrefs?: Record<string, any>;
  safeContacts?: string[];
  createdAt: Date;
  updatedAt: Date;
}
