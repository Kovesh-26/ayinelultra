import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  fonts?: string;

  @IsOptional()
  @IsString()
  palette?: string;

  @IsOptional()
  @IsUrl()
  wallpaperUrl?: string;

  @IsOptional()
  @IsUrl()
  musicUrl?: string;

  @IsOptional()
  photoAlbums?: Record<string, any>;

  @IsOptional()
  links?: Record<string, any>;

  @IsOptional()
  history?: Record<string, any>;
}

export class ProfileResponseDto {
  id: string;
  userId: string;
  bio?: string;
  fonts?: string;
  palette?: string;
  wallpaperUrl?: string;
  musicUrl?: string;
  photoAlbums?: Record<string, any>;
  links?: Record<string, any>;
  history?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
