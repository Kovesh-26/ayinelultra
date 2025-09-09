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
import { AiService } from './ai.service';
import {
  AskAiDto,
  AiResponseDto,
  TutorialResponseDto,
  FeatureGuideResponseDto,
  CreateAiIntegrationDto,
  AiIntegrationResponseDto,
} from '@ayinel/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('AI Assistant')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('ask')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ask AI assistant for platform help' })
  @ApiResponse({ status: 200, description: 'AI response generated' })
  async askAi(@Req() req, @Body() dto: AskAiDto): Promise<AiResponseDto> {
    return this.aiService.askAi(req.user.id, dto);
  }

  @Get('tutorials')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get platform tutorials' })
  @ApiResponse({ status: 200, description: 'Tutorials retrieved' })
  async getTutorials(
    @Req() req,
    @Query('feature') feature?: string
  ): Promise<TutorialResponseDto[]> {
    return this.aiService.getTutorials(req.user.id, feature);
  }

  @Post('tutorials/:id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark tutorial as complete' })
  @ApiResponse({ status: 200, description: 'Tutorial marked complete' })
  async markTutorialComplete(
    @Param('id') tutorialId: string,
    @Req() req
  ): Promise<void> {
    return this.aiService.markTutorialComplete(req.user.id, tutorialId);
  }

  @Get('guides')
  @ApiOperation({ summary: 'Get feature guides' })
  @ApiResponse({ status: 200, description: 'Feature guides retrieved' })
  async getFeatureGuides(): Promise<FeatureGuideResponseDto[]> {
    return this.aiService.getFeatureGuides();
  }

  @Get('tips')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get personalized tips' })
  @ApiResponse({ status: 200, description: 'Personalized tips retrieved' })
  async getPersonalizedTips(@Req() req): Promise<string[]> {
    return this.aiService.getPersonalizedTips(req.user.id);
  }

  @Get('quick-actions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get quick actions for user' })
  @ApiResponse({ status: 200, description: 'Quick actions retrieved' })
  async getQuickActions(@Req() req): Promise<any[]> {
    return this.aiService.getQuickActions(req.user.id);
  }

  // AI Integration endpoints
  @Post('integrations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create AI integration' })
  @ApiResponse({ status: 201, description: 'AI integration created' })
  async createAiIntegration(
    @Req() req,
    @Body() dto: CreateAiIntegrationDto
  ): Promise<AiIntegrationResponseDto> {
    return this.aiService.createAiIntegration(req.user.id, dto);
  }

  @Get('integrations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user AI integrations' })
  @ApiResponse({ status: 200, description: 'AI integrations retrieved' })
  async getUserIntegrations(@Req() req): Promise<AiIntegrationResponseDto[]> {
    return this.aiService.getUserIntegrations(req.user.id);
  }

  @Get('integrations/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get AI integration by ID' })
  @ApiResponse({ status: 200, description: 'AI integration found' })
  async getAiIntegration(
    @Param('id') id: string,
    @Req() req
  ): Promise<AiIntegrationResponseDto> {
    return this.aiService.getAiIntegration(id, req.user.id);
  }

  @Put('integrations/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update AI integration' })
  @ApiResponse({ status: 200, description: 'AI integration updated' })
  async updateAiIntegration(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: CreateAiIntegrationDto
  ): Promise<AiIntegrationResponseDto> {
    return this.aiService.updateAiIntegration(id, req.user.id, dto);
  }

  @Delete('integrations/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete AI integration' })
  @ApiResponse({ status: 200, description: 'AI integration deleted' })
  async deleteAiIntegration(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {
    return this.aiService.deleteAiIntegration(id, req.user.id);
  }

  @Post('integrations/:id/chat')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chat with external AI' })
  @ApiResponse({ status: 200, description: 'AI response received' })
  async chatWithExternalAi(
    @Param('id') integrationId: string,
    @Req() req,
    @Body() dto: AskAiDto
  ): Promise<AiResponseDto> {
    return this.aiService.chatWithExternalAi(integrationId, req.user.id, dto);
  }

  @Get('providers')
  @ApiOperation({ summary: 'Get available AI providers' })
  @ApiResponse({ status: 200, description: 'AI providers list' })
  async getAiProviders(): Promise<any[]> {
    return this.aiService.getAiProviders();
  }
}
