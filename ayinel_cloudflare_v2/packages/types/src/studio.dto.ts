import { IsString, IsOptional, IsUrl, IsBoolean } from 'class-validator';

export class CreateStudioDto {
  @IsString()
  name: string;

  @IsString()
  handle: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsUrl()
  bannerUrl?: string;
}

export class UpdateStudioDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  handle?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsUrl()
  bannerUrl?: string;

  @IsOptional()
  @IsBoolean()
  isCreator?: boolean;
}

export class StudioResponseDto {
  id: string;
  ownerId: string;
  name: string;
  handle: string;
  bannerUrl?: string;
  about?: string;
  isCreator: boolean;
  createdAt: Date;
  updatedAt: Date;
}
