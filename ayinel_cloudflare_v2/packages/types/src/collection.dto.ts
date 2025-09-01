import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class AddToCollectionDto {
  @IsString()
  videoId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  collectionIds?: string[];
}

export class CollectionResponseDto {
  id: string;
  ownerId: string;
  title: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
