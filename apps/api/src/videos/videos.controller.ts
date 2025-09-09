import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';

@Controller('videos')
export class VideosController {
  constructor(private videos: VideosService) {}

  @Post()
  create(@Body() dto: CreateVideoDto) {
    return this.videos.create(dto);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.videos.getById(id);
  }

  @Get()
  list(
    @Query('type') type?: 'FLIP' | 'BROADCAST',
    @Query('limit') limit?: string
  ) {
    return this.videos.list({
      type,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get('trending')
  trending() {
    return this.videos.trending();
  }

  @Get('user/:userId')
  getByUser(@Param('userId') userId: string) {
    return this.videos.getByUser(userId);
  }

  @Get('studio/:studioId')
  getByStudio(@Param('studioId') studioId: string) {
    return this.videos.getByStudio(studioId);
  }
}
