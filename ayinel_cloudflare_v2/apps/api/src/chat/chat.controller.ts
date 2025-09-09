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
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import {
  CreateConversationDto,
  SendMessageDto,
  ConversationResponseDto,
  MessageResponseDto,
} from '@ayinel/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({
    status: 201,
    description: 'Conversation created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createConversation(
    @Req() req,
    @Body() dto: CreateConversationDto
  ): Promise<ConversationResponseDto> {
    return this.chatService.createConversation(req.user.id, dto);
  }

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user conversations' })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
  })
  async getConversations(@Req() req): Promise<ConversationResponseDto[]> {
    return this.chatService.getConversations(req.user.id);
  }

  @Get('conversations/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get conversation by ID' })
  @ApiResponse({ status: 200, description: 'Conversation found' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getConversation(
    @Param('id') id: string,
    @Req() req
  ): Promise<ConversationResponseDto> {
    return this.chatService.getConversation(id, req.user.id);
  }

  @Post('conversations/:id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send message to conversation' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendMessage(
    @Param('id') conversationId: string,
    @Req() req,
    @Body() dto: SendMessageDto
  ): Promise<MessageResponseDto> {
    return this.chatService.sendMessage(conversationId, req.user.id, dto);
  }

  @Get('conversations/:id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get conversation messages' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  async getMessages(
    @Param('id') conversationId: string,
    @Req() req,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ): Promise<MessageResponseDto[]> {
    return this.chatService.getMessages(
      conversationId,
      req.user.id,
      limit,
      offset
    );
  }

  @Post('conversations/:id/members')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add member to conversation' })
  @ApiResponse({ status: 200, description: 'Member added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async addMemberToConversation(
    @Param('id') conversationId: string,
    @Req() req,
    @Body('memberId') memberId: string
  ): Promise<void> {
    return this.chatService.addMemberToConversation(
      conversationId,
      req.user.id,
      memberId
    );
  }

  @Delete('conversations/:id/members/:memberId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove member from conversation' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async removeMemberFromConversation(
    @Param('id') conversationId: string,
    @Param('memberId') memberId: string,
    @Req() req
  ): Promise<void> {
    return this.chatService.removeMemberFromConversation(
      conversationId,
      req.user.id,
      memberId
    );
  }
}
