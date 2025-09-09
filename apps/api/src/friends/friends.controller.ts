import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { RequestFriendDto } from './dto/request-friend.dto';

@Controller('friends')
export class FriendsController {
  constructor(private friends: FriendsService) {}

  @Get(':userId')
  list(@Param('userId') userId: string) {
    return this.friends.list(userId);
  }

  @Post(':userId/request')
  request(@Param('userId') userId: string, @Body() dto: RequestFriendDto) {
    return this.friends.request(userId, dto.targetUserId);
  }

  @Post('accept/:aId/:bId')
  accept(@Param('aId') aId: string, @Param('bId') bId: string) {
    return this.friends.accept(aId, bId);
  }

  @Get(':userId/pending')
  getPendingRequests(@Param('userId') userId: string) {
    return this.friends.getPendingRequests(userId);
  }

  @Post(':userId/block/:targetUserId')
  block(
    @Param('userId') userId: string,
    @Param('targetUserId') targetUserId: string
  ) {
    return this.friends.block(userId, targetUserId);
  }
}
