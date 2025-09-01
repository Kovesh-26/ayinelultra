import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VideosService } from './videos.service';
import { CreateVideoDto, UpdateVideoDto, VideoResponseDto } from '@ayinel/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new video' })
  @ApiResponse({ status: 201, description: 'Video created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createVideo(
    @Body() dto: CreateVideoDto,
    @Query('studioId') studioId: string,
  ): Promise<VideoResponseDto> {
    return this.videosService.createVideo(studioId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all public videos' })
  @ApiResponse({ status: 200, description: 'Videos retrieved successfully' })
  async findAll(@Query('visibility') visibility?: string): Promise<VideoResponseDto[]> {
    return this.videosService.findAll(visibility);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending videos' })
  @ApiResponse({ status: 200, description: 'Trending videos retrieved' })
  async getTrendingVideos(): Promise<VideoResponseDto[]> {
    return this.videosService.getTrendingVideos();
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent videos' })
  @ApiResponse({ status: 200, description: 'Recent videos retrieved' })
  async getRecentVideos(): Promise<VideoResponseDto[]> {
    return this.videosService.getRecentVideos();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search videos' })
  @ApiResponse({ status: 200, description: 'Videos found' })
  async searchVideos(@Query('q') query: string): Promise<VideoResponseDto[]> {
    return this.videosService.searchVideos(query);
  }

  @Get('studio/:studioId')
  @ApiOperation({ summary: 'Get videos by studio' })
  @ApiResponse({ status: 200, description: 'Studio videos retrieved' })
  async findByStudioId(@Param('studioId') studioId: string): Promise<VideoResponseDto[]> {
    return this.videosService.findByStudioId(studioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get video by ID' })
  @ApiResponse({ status: 200, description: 'Video found' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async findById(@Param('id') id: string): Promise<VideoResponseDto> {
    return this.videosService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update video' })
  @ApiResponse({ status: 200, description: 'Video updated successfully' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async updateVideo(
    @Param('id') id: string,
    @Body() dto: UpdateVideoDto,
  ): Promise<VideoResponseDto> {
    return this.videosService.updateVideo(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete video' })
  @ApiResponse({ status: 200, description: 'Video deleted successfully' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async deleteVideo(@Param('id') id: string): Promise<void> {
    return this.videosService.deleteVideo(id);
  }

  @Post(':id/view')
  @ApiOperation({ summary: 'Increment video views' })
  @ApiResponse({ status: 200, description: 'View count incremented' })
  async incrementViews(@Param('id') id: string): Promise<void> {
    return this.videosService.incrementViews(id);
  }
}
