import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request,
  UseInterceptors,
  UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadsService } from '../uploads/uploads.service';
import { 
  CreateChatRoomDto, 
  SendMessageDto, 
  JoinRoomDto, 
  LeaveRoomDto 
} from './dto/chat.dto';

@Controller('api/v1/chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Post('rooms')
  async createRoom(@Request() req, @Body() dto: CreateChatRoomDto) {
    return this.chatService.createRoom(req.user.id, dto);
  }

  @Get('rooms')
  async getRooms(@Request() req) {
    return this.chatService.getRooms(req.user.id);
  }

  @Get('rooms/:roomId')
  async getRoom(@Param('roomId') roomId: string, @Request() req) {
    return this.chatService.getRoom(roomId, req.user.id);
  }

  @Get('rooms/:roomId/messages')
  async getMessages(
    @Param('roomId') roomId: string,
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50'
  ) {
    return this.chatService.getMessages(
      roomId, 
      req.user.id, 
      parseInt(page), 
      parseInt(limit)
    );
  }

  @Post('rooms/:roomId/messages')
  async sendMessage(
    @Param('roomId') roomId: string,
    @Request() req,
    @Body() dto: SendMessageDto
  ) {
    return this.chatService.sendMessage(roomId, req.user.id, dto);
  }

  @Post('rooms/:roomId/messages/with-image')
  @UseInterceptors(FileInterceptor('file'))
  async sendMessageWithImage(
    @Param('roomId') roomId: string,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { text?: string; replyToId?: string }
  ) {
    // Upload the image first
    const attachmentUrl = await this.uploadsService.uploadChatImage(file, req.user.id);
    
    // Create message with attachment
    const messageDto: SendMessageDto = {
      text: body.text,
      attachmentUrl,
      attachmentType: 'image',
      replyToId: body.replyToId,
    };

    return this.chatService.sendMessage(roomId, req.user.id, messageDto);
  }

  @Post('rooms/:roomId/join')
  async joinRoom(@Param('roomId') roomId: string, @Request() req) {
    return this.chatService.joinRoom(roomId, req.user.id);
  }

  @Post('rooms/:roomId/leave')
  async leaveRoom(@Param('roomId') roomId: string, @Request() req) {
    return this.chatService.leaveRoom(roomId, req.user.id);
  }

  @Delete('messages/:messageId')
  async deleteMessage(@Param('messageId') messageId: string, @Request() req) {
    return this.chatService.deleteMessage(messageId, req.user.id);
  }

  @Get('rooms/:roomId/online')
  async getOnlineUsers(@Param('roomId') roomId: string) {
    return this.chatService.getOnlineUsers(roomId);
  }
}
