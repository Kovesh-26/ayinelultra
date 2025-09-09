import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('tune-in')
export class FollowController {
  constructor(private follow: FollowService) {}

  @Post(':followerId/:followeeId')
  tuneIn(
    @Param('followerId') followerId: string,
    @Param('followeeId') followeeId: string
  ) {
    return this.follow.tuneIn(followerId, followeeId);
  }

  @Delete(':followerId/:followeeId')
  unTuneIn(
    @Param('followerId') followerId: string,
    @Param('followeeId') followeeId: string
  ) {
    return this.follow.unTuneIn(followerId, followeeId);
  }

  @Get('counts/:userId')
  counts(@Param('userId') userId: string) {
    return this.follow.counts(userId);
  }

  @Get(':userId/followers')
  getFollowers(@Param('userId') userId: string) {
    return this.follow.getFollowers(userId);
  }

  @Get(':userId/following')
  getFollowing(@Param('userId') userId: string) {
    return this.follow.getFollowing(userId);
  }

  @Get(':followerId/following/:followeeId')
  isFollowing(
    @Param('followerId') followerId: string,
    @Param('followeeId') followeeId: string
  ) {
    return this.follow.isFollowing(followerId, followeeId);
  }
}
