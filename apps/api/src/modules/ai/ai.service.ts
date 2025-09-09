import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AskAiDto {
  query: string;
  context?: string;
  imageUrl?: string; // Support for image attachments
}

export interface AiResponseDto {
  answer: string;
  suggestions: string[];
  relatedTutorials?: string[];
}

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async askAi(userId: string, dto: AskAiDto): Promise<AiResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate AI response based on query and optional image
    const response = await this.generateAiResponse(dto.query, user, dto.imageUrl);

    // Log the interaction (only create if the table exists)
    try {
      await this.prisma.aiInteraction.create({
        data: {
          userId,
          query: dto.query,
          response: response.answer,
          context: dto.context || 'general',
        },
      });
    } catch (error) {
      // Table might not exist yet, just log the error but continue
      console.warn('Could not log AI interaction:', error.message);
    }

    return response;
  }

  private async generateAiResponse(query: string, user: any, imageUrl?: string): Promise<AiResponseDto> {
    const lowerQuery = query.toLowerCase();

    // Handle image-based queries
    if (imageUrl) {
      return {
        answer: `I can see you've shared an image with me! While I can't analyze the actual image content yet, I can help you with:\n\n• Uploading images to chat conversations\n• Sharing pictures with other users\n• Managing your image uploads\n• Understanding our image policies\n\nIs there something specific about this image or image sharing you'd like to know?`,
        suggestions: [
          'How do I share images in chat?',
          'What image formats are supported?',
          'How do I delete an uploaded image?',
          'Are there size limits for images?',
        ],
        relatedTutorials: ['image-upload', 'chat-features'],
      };
    }

    // Handle image/upload related questions
    if (lowerQuery.includes('image') || lowerQuery.includes('picture') || lowerQuery.includes('photo') || lowerQuery.includes('upload')) {
      return {
        answer: `Great question about images! Here's how image sharing works on Ayinel:\n\n🖼️ **In Chat:**\n• Click the image icon in the chat input\n• Select an image from your device\n• Add optional text with your image\n• Send to share with others\n\n📱 **Supported Formats:**\n• JPEG, PNG, GIF, WebP\n• Maximum size: 10MB\n• Automatically optimized for sharing\n\n✨ **Tips:**\n• Images are compressed for faster loading\n• You can send images with or without text\n• Images are stored securely\n\nNeed help with a specific part?`,
        suggestions: [
          'How do I upload images in chat?',
          'What happens to my uploaded images?',
          'Can I send videos too?',
          'How do I delete an image I sent?',
        ],
        relatedTutorials: ['chat-features', 'image-upload', 'media-sharing'],
      };
    }

    // Handle chat-related questions
    if (lowerQuery.includes('chat') || lowerQuery.includes('message')) {
      return {
        answer: `Ayinel's chat system is powerful and versatile:\n\n💬 **Text Messages:**\n• Send instant messages to other users\n• Reply to specific messages\n• Create group conversations\n\n🖼️ **Media Sharing:**\n• Share images directly in chat\n• Upload pictures with optional captions\n• View shared images in full screen\n\n👥 **Chat Features:**\n• Private conversations\n• Group chats\n• Safe messaging in KidZone\n• Message history\n\nThe chat now supports both text and images!`,
        suggestions: [
          'How do I start a group chat?',
          'Can I share images in chat?',
          'How do I reply to messages?',
          'Is chat safe for kids?',
        ],
        relatedTutorials: ['chat-features', 'image-sharing', 'group-chats'],
      };
    }

    // Handle copilot/AI questions
    if (lowerQuery.includes('copilot') || lowerQuery.includes('ai') || lowerQuery.includes('assistant')) {
      return {
        answer: `I'm your Ayinel AI assistant! I'm here to help you with:\n\n🤖 **What I Can Do:**\n• Answer questions about the platform\n• Help with image and media sharing\n• Guide you through features\n• Provide tips and tutorials\n\n📸 **New Feature - Image Support:**\n• You can now share images with me in chat!\n• I can help explain image-related features\n• Get assistance with upload issues\n\n💡 **How to Use Me:**\n• Ask questions in plain language\n• Share screenshots for help\n• Get step-by-step guidance\n\nWhat would you like help with today?`,
        suggestions: [
          'How do I share images with you?',
          'Help me with video uploads',
          'Explain collection features',
          'Show me safety features',
        ],
        relatedTutorials: ['ai-assistant', 'getting-started', 'platform-features'],
      };
    }

    // Default response
    return {
      answer: `Hello! I'm your Ayinel AI assistant, and I'm excited to help you navigate our platform! 🎉\n\n✨ **What's New:**\nYou can now share images with me in our chat! Just upload a picture and I'll help you with any questions.\n\n🔍 **I can help you with:**\n• Image and media sharing\n• Video uploads and management\n• Creating collections\n• Using chat features\n• Building your crew\n• Studio management\n• KidZone safety features\n\n💬 **Try saying:**\n• "How do I upload images?"\n• "Help me create a collection"\n• "Show me chat features"\n\nWhat would you like to explore first?`,
      suggestions: [
        'How do I share images in chat?',
        'Help me upload my first video',
        'What are collections?',
        'Show me safety features',
      ],
      relatedTutorials: ['getting-started', 'image-upload', 'platform-overview'],
    };
  }
}