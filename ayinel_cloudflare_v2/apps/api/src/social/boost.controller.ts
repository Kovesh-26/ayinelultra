import { Controller, Post, Delete, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BoostService } from './boost.service';
import { BoostVideoDto, BoostResponseDto } from '@ayinel/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Boost')
@Controller('boost')
export class BoostController {
  constructor(private readonly boostService: BoostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Boost or dislike a video' })
  @ApiResponse({ status: 201, description: 'Video boosted successfully' })
  async boostVideo(@Req() req, @Body() dto: BoostVideoDto): Promise<BoostResponseDto> {
    return this.boostService.boostVideo(req.user.id, dto);
  }

  @Delete(':videoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove boost from video' })
  @ApiResponse({ status: 200, description: 'Boost removed successfully' })
  async removeBoost(@Req() req, @Param('videoId') videoId: string): Promise<void> {
    return this.boostService.removeBoost(req.user.id, videoId);
  }

  @Get('video/:videoId')
  @ApiOperation({ summary: 'Get all boosts for a video' })
  @ApiResponse({ status: 200, description: 'List of video boosts' })
  async getVideoBoosts(@Param('videoId') videoId: string): Promise<BoostResponseDto[]> {
    return this.boostService.getVideoBoosts(videoId);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user\'s boosts' })
  @ApiResponse({ status: 200, description: 'List of user\'s boosts' })
  async getUserBoosts(@Req() req): Promise<BoostResponseDto[]> {
    return this.boostService.getUserBoosts(req.user.id);
  }

  @Get('check/:videoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if user has boosted a video' })
  @ApiResponse({ status: 200, description: 'Boost status' })
  async hasUserBoosted(@Req() req, @Param('videoId') videoId: string): Promise<{ hasBoosted: boolean; type?: 'BOOST' | 'DISLIKE' }> {
    return this.boostService.hasUserBoosted(req.user.id, videoId);
  }

  @Get('count/:videoId')
  @ApiOperation({ summary: 'Get boost count for a video' })
  @ApiResponse({ status: 200, description: 'Boost count' })
  async getVideoBoostCount(@Param('videoId') videoId: string): Promise<{ boosts: number; dislikes: number }> {
    return this.boostService.getVideoBoostCount(videoId);
  }
}
