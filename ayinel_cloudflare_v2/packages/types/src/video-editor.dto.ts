import { IsString, IsOptional, IsBoolean, IsObject, IsArray, IsNumber } from 'class-validator';

export class CreateVideoProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsObject()
  settings?: any;
}

export class UpdateVideoProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsObject()
  settings?: any;
}

export class VideoProjectResponseDto {
  id: string;
  userId: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  settings?: any;
  isPublished: boolean;
  isCensored: boolean;
  contentRating: string;
  ageRestriction: string;
  isInappropriate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class AddVideoClipDto {
  @IsString()
  videoUrl: string;

  @IsNumber()
  startTime: number;

  @IsNumber()
  endTime: number;

  @IsOptional()
  @IsNumber()
  position?: number;
}

export class AddAudioTrackDto {
  @IsString()
  audioUrl: string;

  @IsNumber()
  startTime: number;

  @IsOptional()
  @IsNumber()
  volume?: number;
}

export class AddTextOverlayDto {
  @IsString()
  text: string;

  @IsNumber()
  startTime: number;

  @IsNumber()
  endTime: number;

  @IsOptional()
  @IsObject()
  style?: any;

  @IsOptional()
  @IsNumber()
  positionX?: number;

  @IsOptional()
  @IsNumber()
  positionY?: number;
}

export class AddTransitionDto {
  @IsString()
  type: string;

  @IsNumber()
  startTime: number;

  @IsNumber()
  duration: number;

  @IsOptional()
  @IsObject()
  settings?: any;
}

export class ExportVideoDto {
  @IsString()
  projectId: string;

  @IsString()
  format: string;

  @IsOptional()
  @IsString()
  quality?: string;

  @IsOptional()
  @IsObject()
  settings?: any;
}

export class VideoProjectTimelineDto {
  clips: VideoClipDto[];
  audioTracks: AudioTrackDto[];
  textOverlays: TextOverlayDto[];
  transitions: TransitionDto[];
}

export class VideoClipDto {
  id: string;
  videoUrl: string;
  startTime: number;
  endTime: number;
  position: number;
  duration: number;
}

export class AudioTrackDto {
  id: string;
  audioUrl: string;
  startTime: number;
  volume: number;
  duration: number;
}

export class TextOverlayDto {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  style: any;
  positionX: number;
  positionY: number;
}

export class TransitionDto {
  id: string;
  type: string;
  startTime: number;
  duration: number;
  settings: any;
}

export class VideoTemplateDto {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  settings: any;
  isPublic: boolean;
  createdAt: Date;
}

export class CreateVideoTemplateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsObject()
  settings: any;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
