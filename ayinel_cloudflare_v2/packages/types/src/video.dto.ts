import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
} from 'class-validator';

export enum VideoStatus {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  BLOCKED = 'BLOCKED',
}

export enum VideoVisibility {
  PUBLIC = 'PUBLIC',
  CREW = 'CREW',
  PRIVATE = 'PRIVATE',
}

export class CreateVideoDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(VideoVisibility)
  visibility?: VideoVisibility;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateVideoDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(VideoVisibility)
  visibility?: VideoVisibility;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class VideoResponseDto {
  id: string;
  studioId: string;
  title: string;
  description?: string;
  status: VideoStatus;
  visibility: VideoVisibility;
  duration?: number;
  views: number;
  boosts: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
