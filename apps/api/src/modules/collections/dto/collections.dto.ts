import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Visibility } from '@prisma/client';

export class CreateCollectionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(Visibility)
  visibility: Visibility = Visibility.PUBLIC;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videoIds?: string[];
}

export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;
}

export class AddVideoToCollectionDto {
  @IsString()
  videoId: string;
}

export class RemoveVideoFromCollectionDto {
  @IsString()
  videoId: string;
}
