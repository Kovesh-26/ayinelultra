import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LiveService, CreateStreamDto } from './live.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/live')
@UseGuards(JwtAuthGuard)
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @Post('start')
  async createStream(@Request() req, @Body() dto: CreateStreamDto) {
    const userId = req.user.id;
    return this.liveService.createStream(userId, dto);
  }

  @Put(':streamId/start')
  async startStream(@Request() req, @Param('streamId') streamId: string) {
    const userId = req.user.id;
    return this.liveService.startStream(streamId, userId);
  }

  @Put(':streamId/end')
  async endStream(@Request() req, @Param('streamId') streamId: string) {
    const userId = req.user.id;
    return this.liveService.endStream(streamId, userId);
  }

  @Get(':streamId/status')
  async getStreamStatus(@Param('streamId') streamId: string) {
    return this.liveService.getStreamStatus(streamId);
  }

  @Get(':streamId/analytics')
  async getStreamAnalytics(
    @Request() req,
    @Param('streamId') streamId: string
  ) {
    const userId = req.user.id;
    // TODO: Add authorization check
    return this.liveService.getStreamAnalytics(streamId);
  }

  @Post(':streamId/chat')
  async sendChatMessage(
    @Request() req,
    @Param('streamId') streamId: string,
    @Body() message: { text: string }
  ) {
    // TODO: Implement chat functionality
    return { success: true, message: 'Chat message sent' };
  }

  @Get(':streamId/chat')
  async getChatMessages(@Param('streamId') streamId: string) {
    // TODO: Implement chat history
    return { messages: [] };
  }
}
