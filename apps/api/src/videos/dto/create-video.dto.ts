import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  ownerId: string;

  @IsOptional()
  @IsString()
  studioId?: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum({ FLIP: 'FLIP', BROADCAST: 'BROADCAST' })
  type: 'FLIP' | 'BROADCAST';

  @IsOptional()
  playbackId?: string;
}
