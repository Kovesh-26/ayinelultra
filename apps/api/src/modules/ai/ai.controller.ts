import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards, 
  Req, 
  UseInterceptors, 
  UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiService, AskAiDto, AiResponseDto } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadsService } from '../uploads/uploads.service';

@Controller('api/v1/ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Post('ask')
  @UseGuards(JwtAuthGuard)
  async askAi(@Req() req, @Body() dto: AskAiDto): Promise<AiResponseDto> {
    return this.aiService.askAi(req.user.id, dto);
  }

  @Post('ask-with-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async askAiWithImage(
    @Req() req,
    @UploadedFile() image: Express.Multer.File,
    @Body() body: { query: string; context?: string },
  ): Promise<AiResponseDto> {
    // Upload the image first
    const imageUrl = await this.uploadsService.uploadChatImage(image, req.user.id);
    
    // Create the AI request with image
    const dto: AskAiDto = {
      query: body.query,
      context: body.context,
      imageUrl,
    };

    return this.aiService.askAi(req.user.id, dto);
  }

  @Get('help')
  async getHelp(): Promise<{ message: string; topics: string[] }> {
    return {
      message: 'I\'m your Ayinel AI assistant! I can help you with platform features, especially the new image sharing in chat.',
      topics: [
        'Image sharing in chat',
        'Video uploads',
        'Creating collections',
        'Building your crew',
        'Studio management',
        'Safety features',
      ],
    };
  }
}