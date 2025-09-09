import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AskAiDto,
  AiResponseDto,
  TutorialResponseDto,
  FeatureGuideResponseDto,
  CreateAiIntegrationDto,
  AiIntegrationResponseDto,
} from '@ayinel/types';

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

    // AI response logic based on user query
    const response = await this.generateAiResponse(dto.query, user);

    // Log the interaction
    await this.prisma.aiInteraction.create({
      data: {
        userId,
        query: dto.query,
        response: response.answer,
        context: dto.context || 'general',
      },
    });

    return response;
  }

  async getTutorials(
    userId: string,
    feature?: string
  ): Promise<TutorialResponseDto[]> {
    const tutorials = await this.prisma.tutorial.findMany({
      where: feature ? { feature } : {},
      orderBy: { order: 'asc' },
    });

    // Check user progress
    const userProgress = await this.prisma.userTutorialProgress.findMany({
      where: { userId },
    });

    return tutorials.map((tutorial) => ({
      id: tutorial.id,
      title: tutorial.title,
      description: tutorial.description,
      feature: tutorial.feature,
      steps: tutorial.steps,
      videoUrl: tutorial.videoUrl,
      isCompleted: userProgress.some(
        (progress) => progress.tutorialId === tutorial.id
      ),
      order: tutorial.order,
    }));
  }

  async markTutorialComplete(
    userId: string,
    tutorialId: string
  ): Promise<void> {
    const existing = await this.prisma.userTutorialProgress.findUnique({
      where: {
        userId_tutorialId: {
          userId,
          tutorialId,
        },
      },
    });

    if (!existing) {
      await this.prisma.userTutorialProgress.create({
        data: {
          userId,
          tutorialId,
          completedAt: new Date(),
        },
      });
    }
  }

  async getFeatureGuides(): Promise<FeatureGuideResponseDto[]> {
    const guides = await this.prisma.featureGuide.findMany({
      orderBy: { order: 'asc' },
    });

    return guides.map((guide) => ({
      id: guide.id,
      title: guide.title,
      description: guide.description,
      feature: guide.feature,
      content: guide.content,
      tips: guide.tips,
      order: guide.order,
    }));
  }

  async getPersonalizedTips(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        studio: true,
        videos: true,
        collections: true,
      },
    });

    const tips: string[] = [];

    // New user tips
    if (user.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      tips.push(
        'Welcome to Ayinel! Start by exploring trending videos and creating your first collection.'
      );
      tips.push('Complete your profile to help others discover your content.');
    }

    // Creator tips
    if (user.studio && !user.studio.isCreator) {
      tips.push(
        'Ready to become a creator? Upgrade your studio to start uploading videos and building your crew.'
      );
    }

    // Engagement tips
    if (user.videos.length === 0) {
      tips.push(
        'Start creating content! Upload your first video to begin your creator journey.'
      );
    }

    if (user.collections.length === 0) {
      tips.push(
        'Create collections to organize your favorite videos and share them with others.'
      );
    }

    // Platform usage tips
    tips.push(
      'Use the search feature to discover new creators and content that matches your interests.'
    );
    tips.push(
      'Join conversations in the chat to connect with other users and creators.'
    );

    return tips.slice(0, 5); // Return top 5 tips
  }

  async getQuickActions(userId: string): Promise<any[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        studio: true,
        videos: true,
      },
    });

    const actions = [
      {
        id: 'upload-video',
        title: 'Upload Video',
        description: 'Share your content with the world',
        icon: '🎥',
        action: 'navigate',
        path: '/upload',
        available: !!user.studio,
      },
      {
        id: 'create-collection',
        title: 'Create Collection',
        description: 'Organize your favorite videos',
        icon: '📚',
        action: 'navigate',
        path: '/collections/new',
        available: true,
      },
      {
        id: 'start-chat',
        title: 'Start Chat',
        description: 'Connect with other users',
        icon: '💬',
        action: 'navigate',
        path: '/chat',
        available: true,
      },
      {
        id: 'explore-trending',
        title: 'Trending Videos',
        description: 'Discover popular content',
        icon: '🔥',
        action: 'navigate',
        path: '/trending',
        available: true,
      },
      {
        id: 'studio-dashboard',
        title: 'Studio Dashboard',
        description: 'Manage your creator account',
        icon: '🎭',
        action: 'navigate',
        path: '/studio',
        available: !!user.studio,
      },
    ];

    return actions;
  }

  // AI Integration Methods
  async createAiIntegration(
    userId: string,
    dto: CreateAiIntegrationDto
  ): Promise<AiIntegrationResponseDto> {
    const integration = await this.prisma.aiIntegration.create({
      data: {
        userId,
        name: dto.name,
        provider: dto.provider,
        apiKey: dto.apiKey,
        config: dto.config,
        isActive: dto.isActive || true,
      },
    });

    return this.mapToAiIntegrationResponse(integration);
  }

  async getUserIntegrations(
    userId: string
  ): Promise<AiIntegrationResponseDto[]> {
    const integrations = await this.prisma.aiIntegration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return integrations.map((integration) =>
      this.mapToAiIntegrationResponse(integration)
    );
  }

  async getAiIntegration(
    id: string,
    userId: string
  ): Promise<AiIntegrationResponseDto> {
    const integration = await this.prisma.aiIntegration.findFirst({
      where: { id, userId },
    });

    if (!integration) {
      throw new NotFoundException('AI integration not found');
    }

    return this.mapToAiIntegrationResponse(integration);
  }

  async updateAiIntegration(
    id: string,
    userId: string,
    dto: CreateAiIntegrationDto
  ): Promise<AiIntegrationResponseDto> {
    const integration = await this.prisma.aiIntegration.findFirst({
      where: { id, userId },
    });

    if (!integration) {
      throw new NotFoundException('AI integration not found');
    }

    const updatedIntegration = await this.prisma.aiIntegration.update({
      where: { id },
      data: {
        name: dto.name,
        provider: dto.provider,
        apiKey: dto.apiKey,
        config: dto.config,
        isActive: dto.isActive,
      },
    });

    return this.mapToAiIntegrationResponse(updatedIntegration);
  }

  async deleteAiIntegration(id: string, userId: string): Promise<void> {
    const integration = await this.prisma.aiIntegration.findFirst({
      where: { id, userId },
    });

    if (!integration) {
      throw new NotFoundException('AI integration not found');
    }

    await this.prisma.aiIntegration.delete({
      where: { id },
    });
  }

  async chatWithExternalAi(
    integrationId: string,
    userId: string,
    dto: AskAiDto
  ): Promise<AiResponseDto> {
    const integration = await this.prisma.aiIntegration.findFirst({
      where: { id: integrationId, userId },
    });

    if (!integration) {
      throw new NotFoundException('AI integration not found');
    }

    if (!integration.isActive) {
      throw new BadRequestException('AI integration is not active');
    }

    // Call external AI based on provider
    const response = await this.callExternalAi(integration, dto.query);

    // Log the external AI interaction
    await this.prisma.aiInteraction.create({
      data: {
        userId,
        query: dto.query,
        response: response.answer,
        context: 'external-ai',
        aiIntegrationId: integrationId,
      },
    });

    return response;
  }

  async getAiProviders(): Promise<any[]> {
    return [
      {
        id: 'openai',
        name: 'OpenAI',
        description: 'GPT-4, GPT-3.5, and other OpenAI models',
        features: ['Text generation', 'Code assistance', 'Creative writing'],
        pricing: 'Pay per token',
        website: 'https://openai.com',
        setupGuide: 'https://platform.openai.com/docs/quickstart',
      },
      {
        id: 'anthropic',
        name: 'Anthropic Claude',
        description: 'Claude AI for conversation and analysis',
        features: ['Conversation', 'Document analysis', 'Reasoning'],
        pricing: 'Pay per token',
        website: 'https://anthropic.com',
        setupGuide: 'https://docs.anthropic.com/claude',
      },
      {
        id: 'google',
        name: 'Google AI',
        description: 'PaLM and other Google AI models',
        features: ['Text generation', 'Translation', 'Code generation'],
        pricing: 'Pay per request',
        website: 'https://ai.google',
        setupGuide: 'https://ai.google.dev/docs',
      },
      {
        id: 'cohere',
        name: 'Cohere',
        description: 'Text generation and classification',
        features: ['Text generation', 'Classification', 'Embeddings'],
        pricing: 'Pay per request',
        website: 'https://cohere.ai',
        setupGuide: 'https://docs.cohere.com',
      },
      {
        id: 'huggingface',
        name: 'Hugging Face',
        description: 'Open source AI models and APIs',
        features: ['Multiple models', 'Custom models', 'Inference API'],
        pricing: 'Free tier + paid plans',
        website: 'https://huggingface.co',
        setupGuide: 'https://huggingface.co/docs',
      },
    ];
  }

  async getAiGuides(): Promise<any[]> {
    return [
      {
        id: 'getting-started',
        title: 'Getting Started with AI on Ayinel',
        description:
          'Learn how to integrate and use AI services on the platform',
        sections: [
          {
            title: 'What is AI Integration?',
            content:
              'AI integration allows you to connect external AI services to enhance your Ayinel experience. You can use AI for content creation, analysis, and automation.',
          },
          {
            title: 'Supported AI Providers',
            content:
              'Ayinel supports integration with popular AI providers including OpenAI, Anthropic Claude, Google AI, Cohere, and Hugging Face.',
          },
          {
            title: 'Setting Up Your First Integration',
            content:
              '1. Choose an AI provider\n2. Get your API key\n3. Configure the integration\n4. Start using AI features',
          },
        ],
      },
      {
        id: 'content-creation',
        title: 'AI-Powered Content Creation',
        description: 'Use AI to enhance your video content and descriptions',
        sections: [
          {
            title: 'Video Descriptions',
            content:
              'Generate engaging video descriptions using AI. Simply provide a brief summary and let AI create compelling descriptions.',
          },
          {
            title: 'Title Optimization',
            content:
              'Get AI suggestions for video titles that are more likely to attract viewers and improve discoverability.',
          },
          {
            title: 'Tag Generation',
            content:
              'Automatically generate relevant tags for your videos to improve search visibility.',
          },
        ],
      },
      {
        id: 'analytics-insights',
        title: 'AI Analytics and Insights',
        description: 'Get intelligent insights about your content performance',
        sections: [
          {
            title: 'Performance Analysis',
            content:
              'AI can analyze your video performance and provide insights on what works best for your audience.',
          },
          {
            title: 'Trend Predictions',
            content:
              'Get predictions about trending topics and content that might perform well.',
          },
          {
            title: 'Audience Insights',
            content:
              'Understand your audience better with AI-powered demographic and behavior analysis.',
          },
        ],
      },
      {
        id: 'automation',
        title: 'AI Automation',
        description: 'Automate repetitive tasks with AI',
        sections: [
          {
            title: 'Comment Moderation',
            content:
              'Use AI to automatically moderate comments and filter inappropriate content.',
          },
          {
            title: 'Content Scheduling',
            content:
              'AI can help optimize your content posting schedule based on when your audience is most active.',
          },
          {
            title: 'Response Generation',
            content:
              'Generate quick responses to common comments and questions.',
          },
        ],
      },
    ];
  }

  private async callExternalAi(
    integration: any,
    query: string
  ): Promise<AiResponseDto> {
    // This is a simplified implementation
    // In production, you would make actual API calls to the respective AI providers

    switch (integration.provider) {
      case 'openai':
        return this.callOpenAI(integration, query);
      case 'anthropic':
        return this.callAnthropic(integration, query);
      case 'google':
        return this.callGoogleAI(integration, query);
      case 'cohere':
        return this.callCohere(integration, query);
      case 'huggingface':
        return this.callHuggingFace(integration, query);
      default:
        throw new BadRequestException('Unsupported AI provider');
    }
  }

  private async callOpenAI(
    integration: any,
    query: string
  ): Promise<AiResponseDto> {
    // Mock OpenAI response - replace with actual API call
    return {
      answer: `OpenAI Response: ${query}\n\nThis is a simulated response from OpenAI. In production, this would be an actual API call to GPT models.`,
      suggestions: [
        'Ask for more details',
        'Request code examples',
        'Get creative suggestions',
      ],
      relatedTutorials: ['openai-integration', 'content-creation'],
    };
  }

  private async callAnthropic(
    integration: any,
    query: string
  ): Promise<AiResponseDto> {
    // Mock Anthropic response
    return {
      answer: `Claude Response: ${query}\n\nThis is a simulated response from Anthropic Claude. Claude is designed for helpful, harmless, and honest conversations.`,
      suggestions: [
        'Ask for analysis',
        'Request reasoning',
        'Get detailed explanations',
      ],
      relatedTutorials: ['anthropic-integration', 'ai-analysis'],
    };
  }

  private async callGoogleAI(
    integration: any,
    query: string
  ): Promise<AiResponseDto> {
    // Mock Google AI response
    return {
      answer: `Google AI Response: ${query}\n\nThis is a simulated response from Google AI. Google's PaLM models are powerful for various AI tasks.`,
      suggestions: [
        'Ask for translation',
        'Request code help',
        'Get creative content',
      ],
      relatedTutorials: ['google-ai-integration', 'multilingual-content'],
    };
  }

  private async callCohere(
    integration: any,
    query: string
  ): Promise<AiResponseDto> {
    // Mock Cohere response
    return {
      answer: `Cohere Response: ${query}\n\nThis is a simulated response from Cohere. Cohere specializes in text generation and classification.`,
      suggestions: ['Generate more text', 'Classify content', 'Get embeddings'],
      relatedTutorials: ['cohere-integration', 'text-generation'],
    };
  }

  private async callHuggingFace(
    integration: any,
    query: string
  ): Promise<AiResponseDto> {
    // Mock Hugging Face response
    return {
      answer: `Hugging Face Response: ${query}\n\nThis is a simulated response from Hugging Face. HF provides access to thousands of open-source AI models.`,
      suggestions: [
        'Try different models',
        'Customize responses',
        'Use specific models',
      ],
      relatedTutorials: ['huggingface-integration', 'custom-models'],
    };
  }

  private mapToAiIntegrationResponse(
    integration: any
  ): AiIntegrationResponseDto {
    return {
      id: integration.id,
      userId: integration.userId,
      name: integration.name,
      provider: integration.provider,
      config: integration.config,
      isActive: integration.isActive,
      createdAt: integration.createdAt,
      updatedAt: integration.updatedAt,
    };
  }

  private async generateAiResponse(
    query: string,
    user: any
  ): Promise<AiResponseDto> {
    const lowerQuery = query.toLowerCase();

    // Common platform questions and responses
    if (lowerQuery.includes('upload') || lowerQuery.includes('video')) {
      return {
        answer: `To upload a video on Ayinel:\n\n1. Go to your Studio Dashboard\n2. Click "Upload Video"\n3. Select your video file\n4. Add title, description, and tags\n5. Choose visibility settings\n6. Click "Publish"\n\nNeed help? Check out our video upload tutorial!`,
        suggestions: [
          'How to edit video details?',
          'What video formats are supported?',
          'How to schedule uploads?',
        ],
        relatedTutorials: ['video-upload', 'video-optimization'],
      };
    }

    if (lowerQuery.includes('collection') || lowerQuery.includes('playlist')) {
      return {
        answer: `Collections (our version of playlists) help you organize videos:\n\n1. Click "Create Collection" from any video\n2. Give it a title and description\n3. Add videos by clicking the "+" button\n4. Make it public or private\n5. Share with your crew!\n\nCollections are perfect for organizing your favorite content.`,
        suggestions: [
          'How to make collections public?',
          'Can I collaborate on collections?',
          'How to share collections?',
        ],
        relatedTutorials: ['collections', 'sharing-content'],
      };
    }

    if (lowerQuery.includes('crew') || lowerQuery.includes('subscriber')) {
      return {
        answer: `Your crew are the people who follow your content:\n\n• They get notified when you upload new videos\n• They can see your latest content first\n• You can interact with them in comments and chat\n• Build your crew by creating great content!\n\nTo see your crew, visit your profile page.`,
        suggestions: [
          'How to grow my crew?',
          'What are crew benefits?',
          'How to engage with crew?',
        ],
        relatedTutorials: ['building-audience', 'engagement'],
      };
    }

    if (lowerQuery.includes('chat') || lowerQuery.includes('message')) {
      return {
        answer: `Ayinel's chat feature lets you connect with others:\n\n• Start private conversations with other users\n• Join group chats with shared interests\n• Send text messages and media\n• Use safe chat features in KidZone\n\nChat is a great way to build community!`,
        suggestions: [
          'How to start a group chat?',
          'Is chat safe for kids?',
          'How to block users?',
        ],
        relatedTutorials: ['chat-features', 'kidzone-safety'],
      };
    }

    if (lowerQuery.includes('studio') || lowerQuery.includes('creator')) {
      return {
        answer: `Your Studio is your creator headquarters:\n\n• Upload and manage videos\n• View analytics and insights\n• Manage your crew and comments\n• Access creator tools and features\n\nUpgrade to creator status to unlock all features!`,
        suggestions: [
          'How to upgrade to creator?',
          'What are creator benefits?',
          'How to use analytics?',
        ],
        relatedTutorials: ['studio-overview', 'creator-upgrade'],
      };
    }

    if (lowerQuery.includes('kidzone') || lowerQuery.includes('kids')) {
      return {
        answer: `KidZone is our safe space for young users:\n\n• Age-appropriate content only\n• Safe chat with parental controls\n• Educational and fun videos\n• Parent monitoring features\n\nKidZone ensures a safe experience for children!`,
        suggestions: [
          'How to set up KidZone?',
          'What parental controls are available?',
          'How to monitor activity?',
        ],
        relatedTutorials: ['kidzone-setup', 'parental-controls'],
      };
    }

    if (
      lowerQuery.includes('ai') ||
      lowerQuery.includes('artificial intelligence')
    ) {
      return {
        answer: `Ayinel's AI features help you create better content:\n\n• Connect external AI services (OpenAI, Claude, Google AI)\n• Generate video descriptions and titles\n• Get content optimization suggestions\n• Automate repetitive tasks\n\nSet up AI integrations in your account settings!`,
        suggestions: [
          'How to set up AI integration?',
          'What AI providers are supported?',
          'How to use AI for content?',
        ],
        relatedTutorials: ['ai-integration', 'ai-content-creation'],
      };
    }

    // Default response
    return {
      answer: `Welcome to Ayinel! I'm here to help you navigate our platform. You can ask me about:\n\n• Uploading videos\n• Creating collections\n• Building your crew\n• Using chat features\n• Studio management\n• KidZone safety\n• AI integrations\n\nWhat would you like to learn about?`,
      suggestions: [
        'How to upload videos?',
        'What are collections?',
        'How to use chat?',
        'Tell me about AI features',
      ],
      relatedTutorials: ['getting-started', 'platform-overview'],
    };
  }
}
