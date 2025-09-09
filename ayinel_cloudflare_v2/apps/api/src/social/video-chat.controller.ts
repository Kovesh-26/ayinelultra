import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VideoChatService } from './video-chat.service';
import {
  CreateVideoChatDto,
  UpdateVideoChatDto,
  VideoChatResponseDto,
} from '@ayinel/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Video Chat')
@Controller('video-chat')
export class VideoChatController {
  constructor(private readonly videoChatService: VideoChatService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a video chat (comment)' })
  @ApiResponse({ status: 201, description: 'Video chat created successfully' })
  async createVideoChat(
    @Req() req,
    @Body() dto: CreateVideoChatDto
  ): Promise<VideoChatResponseDto> {
    return this.videoChatService.createVideoChat(req.user.id, dto);
  }

  @Put(':chatId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a video chat' })
  @ApiResponse({ status: 200, description: 'Video chat updated successfully' })
  async updateVideoChat(
    @Req() req,
    @Param('chatId') chatId: string,
    @Body() dto: UpdateVideoChatDto
  ): Promise<VideoChatResponseDto> {
    return this.videoChatService.updateVideoChat(chatId, req.user.id, dto);
  }

  @Delete(':chatId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a video chat' })
  @ApiResponse({ status: 200, description: 'Video chat deleted successfully' })
  async deleteVideoChat(
    @Req() req,
    @Param('chatId') chatId: string
  ): Promise<void> {
    return this.videoChatService.deleteVideoChat(chatId, req.user.id);
  }

  @Get('video/:videoId')
  @ApiOperation({ summary: 'Get video chats for a video' })
  @ApiResponse({ status: 200, description: 'List of video chats' })
  async getVideoChats(
    @Param('videoId') videoId: string,
    @Query('parentId') parentId?: string
  ): Promise<VideoChatResponseDto[]> {
    return this.videoChatService.getVideoChats(videoId, parentId);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user's video chats" })
  @ApiResponse({ status: 200, description: "List of user's video chats" })
  async getUserVideoChats(@Req() req): Promise<VideoChatResponseDto[]> {
    return this.videoChatService.getUserVideoChats(req.user.id);
  }

  @Get('count/:videoId')
  @ApiOperation({ summary: 'Get video chat count for a video' })
  @ApiResponse({ status: 200, description: 'Video chat count' })
  async getVideoChatCount(
    @Param('videoId') videoId: string
  ): Promise<{ count: number }> {
    const count = await this.videoChatService.getVideoChatCount(videoId);
    return { count };
  }
}
