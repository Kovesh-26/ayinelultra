import { IsString, IsOptional, IsBoolean, IsObject, IsArray } from 'class-validator';

export class AskAiDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsString()
  context?: string;
}

export class AiResponseDto {
  answer: string;
  suggestions?: string[];
  relatedTutorials?: string[];
}

export class TutorialResponseDto {
  id: string;
  title: string;
  description: string;
  feature: string;
  steps: string[];
  videoUrl?: string;
  isCompleted: boolean;
  order: number;
}

export class FeatureGuideResponseDto {
  id: string;
  title: string;
  description: string;
  feature: string;
  content: string;
  tips: string[];
  order: number;
}

export class CreateAiIntegrationDto {
  @IsString()
  name: string;

  @IsString()
  provider: string;

  @IsString()
  apiKey: string;

  @IsOptional()
  @IsObject()
  config?: any;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AiIntegrationResponseDto {
  id: string;
  userId: string;
  name: string;
  provider: string;
  config?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}


