import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNumber,
} from 'class-validator';

// Tune-In (Follow) DTOs
export class TuneInDto {
  @IsString()
  followedId: string;
}

export class TuneInResponseDto {
  id: string;
  followerId: string;
  followedId: string;
  createdAt: Date;
}

// Boost (Like) DTOs
export class BoostVideoDto {
  @IsString()
  videoId: string;

  @IsEnum(['BOOST', 'DISLIKE'])
  type: 'BOOST' | 'DISLIKE';
}

export class BoostResponseDto {
  id: string;
  userId: string;
  videoId: string;
  type: 'BOOST' | 'DISLIKE';
  createdAt: Date;
}

// Video Chat (Comments) DTOs
export class CreateVideoChatDto {
  @IsString()
  videoId: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}

export class UpdateVideoChatDto {
  @IsString()
  text: string;
}

export class VideoChatResponseDto {
  id: string;
  userId: string;
  videoId: string;
  text: string;
  parentId?: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    username: string;
    displayName: string;
  };
  replies?: VideoChatResponseDto[];
}

// Notifications DTOs
export class NotificationResponseDto {
  id: string;
  userId: string;
  type: 'TUNE_IN' | 'BOOST' | 'CHAT' | 'BROADCAST' | 'CREW_UPDATE' | 'SYSTEM';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

export class MarkNotificationReadDto {
  @IsString()
  notificationId: string;
}

export class MarkAllNotificationsReadDto {
  @IsOptional()
  @IsString()
  type?: string;
}
