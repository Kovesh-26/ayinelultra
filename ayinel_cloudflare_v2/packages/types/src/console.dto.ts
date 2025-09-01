import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class ConsoleIntegrationDto {
  @IsString()
  platform: string;

  @IsString()
  apiKey: string;

  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @IsOptional()
  @IsObject()
  settings?: any;
}

export class ConsoleIntegrationResponseDto {
  id: string;
  userId: string;
  platform: string;
  webhookUrl?: string;
  settings?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
