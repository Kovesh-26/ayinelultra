import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum FriendshipStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  BLOCKED = 'BLOCKED'
}

export class SendFriendRequestDto {
  @IsString()
  addresseeId: string;
}

export class UpdateFriendshipDto {
  @IsEnum(FriendshipStatus)
  status: FriendshipStatus;
}

export class FriendshipResponseDto {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: Date;
  updatedAt: Date;
}
