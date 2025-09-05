import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { MusicService, CreateTrackDto, CreatePlaylistDto } from './music.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get('tracks')
  async getTracks(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string
  ) {
    return this.musicService.getTracks(parseInt(page), parseInt(limit), search);
  }

  @Post('tracks')
  @UseGuards(JwtAuthGuard)
  async createTrack(@Request() req, @Body() dto: CreateTrackDto) {
    const userId = req.user.id;
    return this.musicService.createTrack(userId, dto);
  }

  @Get('playlists/:playlistId')
  async getPlaylist(@Param('playlistId') playlistId: string) {
    return this.musicService.getPlaylist(playlistId);
  }

  @Post('playlists')
  @UseGuards(JwtAuthGuard)
  async createPlaylist(@Request() req, @Body() dto: CreatePlaylistDto) {
    const userId = req.user.id;
    return this.musicService.createPlaylist(userId, dto);
  }

  @Get('user/:userId/playlists')
  async getUserPlaylists(@Param('userId') userId: string) {
    return this.musicService.getUserPlaylists(userId);
  }

  @Get('search')
  async searchMusic(
    @Query('q') query: string,
    @Query('type') type?: string
  ) {
    return this.musicService.searchMusic(query, type);
  }

  @Post('tracks/:trackId/play')
  async incrementPlayCount(@Param('trackId') trackId: string) {
    return this.musicService.incrementPlayCount(trackId);
  }
}
