import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';

export enum ChatRoomKind {
  DM = 'dm',
  FAN = 'fan',
  BROADCAST = 'broadcast',
}

export class CreateChatRoomDto {
  @IsEnum(ChatRoomKind)
  kind: ChatRoomKind;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  studioId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  participantIds?: string[];
}

export class SendMessageDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  replyToId?: string;
}

export class JoinRoomDto {
  @IsString()
  roomId: string;
}

export class LeaveRoomDto {
  @IsString()
  roomId: string;
}
