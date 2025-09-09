import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';

export enum ConversationType {
  DM = 'DM',
  GROUP = 'GROUP',
  KID = 'KID',
}

export class CreateConversationDto {
  @IsEnum(ConversationType)
  type: ConversationType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsArray()
  @IsString({ each: true })
  memberIds: string[];
}

export class SendMessageDto {
  @IsString()
  conversationId: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;
}

export class MessageResponseDto {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  createdAt: Date;
}

export class ConversationResponseDto {
  id: string;
  type: ConversationType;
  title?: string;
  createdById: string;
  members: string[];
  lastMessage?: MessageResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
