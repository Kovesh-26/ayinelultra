import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateVideoProjectDto, 
  UpdateVideoProjectDto, 
  VideoProjectResponseDto,
  AddVideoClipDto,
  AddAudioTrackDto,
  AddTextOverlayDto,
  AddTransitionDto,
  ExportVideoDto,
  VideoProjectTimelineDto,
  CreateVideoTemplateDto,
  VideoTemplateDto
} from '@ayinel/types';

@Injectable()
export class VideoEditorService {
  constructor(private prisma: PrismaService) {}

  // Video Project Management
  async createVideoProject(userId: string, dto: CreateVideoProjectDto): Promise<VideoProjectResponseDto> {
    // Check if user is in KidZone and enforce restrictions
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (user?.profile?.isKidZone) {
      // KidZone users can only create family-friendly content
      dto.settings = {
        ...dto.settings,
        contentRating: 'G',
        isCensored: true,
        ageRestriction: 'family',
      };
    }

    const project = await this.prisma.videoProject.create({
      data: {
        userId,
        name: dto.name,
        description: dto.description,
        thumbnailUrl: dto.thumbnailUrl,
        settings: dto.settings || {},
        isPublished: false,
        isCensored: dto.settings?.isCensored || false,
        contentRating: dto.settings?.contentRating || 'PG-13',
        ageRestriction: dto.settings?.ageRestriction || 'teen',
      },
    });

    return this.mapToVideoProjectResponse(project);
  }

  async getUserProjects(userId: string): Promise<VideoProjectResponseDto[]> {
    const projects = await this.prisma.videoProject.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    return projects.map(project => this.mapToVideoProjectResponse(project));
  }

  async getVideoProject(id: string, userId: string): Promise<VideoProjectResponseDto> {
    const project = await this.prisma.videoProject.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new NotFoundException('Video project not found');
    }

    return this.mapToVideoProjectResponse(project);
  }

  async updateVideoProject(id: string, userId: string, dto: UpdateVideoProjectDto): Promise<VideoProjectResponseDto> {
    const project = await this.prisma.videoProject.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new NotFoundException('Video project not found');
    }

    const updatedProject = await this.prisma.videoProject.update({
      where: { id },
      data: dto,
    });

    return this.mapToVideoProjectResponse(updatedProject);
  }

  async deleteVideoProject(id: string, userId: string): Promise<void> {
    const project = await this.prisma.videoProject.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new NotFoundException('Video project not found');
    }

    await this.prisma.videoProject.delete({
      where: { id },
    });
  }

  async publishVideoProject(id: string, userId: string): Promise<VideoProjectResponseDto> {
    const project = await this.prisma.videoProject.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new NotFoundException('Video project not found');
    }

    const updatedProject = await this.prisma.videoProject.update({
      where: { id },
      data: { isPublished: true },
    });

    return this.mapToVideoProjectResponse(updatedProject);
  }

  // Timeline Management
  async getProjectTimeline(projectId: string, userId: string): Promise<VideoProjectTimelineDto> {
    const project = await this.prisma.videoProject.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundException('Video project not found');
    }

    const clips = await this.prisma.videoClip.findMany({
      where: { projectId },
      orderBy: { position: 'asc' },
    });

    const audioTracks = await this.prisma.audioTrack.findMany({
      where: { projectId },
      orderBy: { startTime: 'asc' },
    });

    const textOverlays = await this.prisma.textOverlay.findMany({
      where: { projectId },
      orderBy: { startTime: 'asc' },
    });

    const transitions = await this.prisma.transition.findMany({
      where: { projectId },
      orderBy: { startTime: 'asc' },
    });

    return {
      clips: clips.map(clip => ({
        id: clip.id,
        videoUrl: clip.videoUrl,
        startTime: clip.startTime,
        endTime: clip.endTime,
        position: clip.position,
        duration: clip.endTime - clip.startTime,
      })),
      audioTracks: audioTracks.map(track => ({
        id: track.id,
        audioUrl: track.audioUrl,
        startTime: track.startTime,
        volume: track.volume,
        duration: track.duration,
      })),
      textOverlays: textOverlays.map(overlay => ({
        id: overlay.id,
        text: overlay.text,
        startTime: overlay.startTime,
        endTime: overlay.endTime,
        style: overlay.style,
        positionX: overlay.positionX,
        positionY: overlay.positionY,
      })),
      transitions: transitions.map(transition => ({
        id: transition.id,
        type: transition.type,
        startTime: transition.startTime,
        duration: transition.duration,
        settings: transition.settings,
      })),
    };
  }

  // Video Clips
  async addVideoClip(projectId: string, userId: string, dto: AddVideoClipDto): Promise<any> {
    const project = await this.prisma.videoProject.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundException('Video project not found');
    }

    const clip = await this.prisma.videoClip.create({
      data: {
        projectId,
        videoUrl: dto.videoUrl,
        startTime: dto.startTime,
        endTime: dto.endTime,
        position: dto.position || 0,
      },
    });

    return clip;
  }

  async updateVideoClip(clipId: string, userId: string, dto: Partial<AddVideoClipDto>): Promise<any> {
    const clip = await this.prisma.videoClip.findFirst({
      where: { id: clipId },
      include: { project: true },
    });

    if (!clip || clip.project.userId !== userId) {
      throw new NotFoundException('Video clip not found');
    }

    const updatedClip = await this.prisma.videoClip.update({
      where: { id: clipId },
      data: dto,
    });

    return updatedClip;
  }

  async deleteVideoClip(clipId: string, userId: string): Promise<void> {
    const clip = await this.prisma.videoClip.findFirst({
      where: { id: clipId },
      include: { project: true },
    });

    if (!clip || clip.project.userId !== userId) {
      throw new NotFoundException('Video clip not found');
    }

    await this.prisma.videoClip.delete({
      where: { id: clipId },
    });
  }

  // Audio Tracks
  async addAudioTrack(projectId: string, userId: string, dto: AddAudioTrackDto): Promise<any> {
    const project = await this.prisma.videoProject.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundException('Video project not found');
    }

    const track = await this.prisma.audioTrack.create({
      data: {
        projectId,
        audioUrl: dto.audioUrl,
        startTime: dto.startTime,
        volume: dto.volume || 1.0,
        duration: 0, // Will be calculated from audio file
      },
    });

    return track;
  }

  async updateAudioTrack(trackId: string, userId: string, dto: Partial<AddAudioTrackDto>): Promise<any> {
    const track = await this.prisma.audioTrack.findFirst({
      where: { id: trackId },
      include: { project: true },
    });

    if (!track || track.project.userId !== userId) {
      throw new NotFoundException('Audio track not found');
    }

    const updatedTrack = await this.prisma.audioTrack.update({
      where: { id: trackId },
      data: dto,
    });

    return updatedTrack;
  }

  async deleteAudioTrack(trackId: string, userId: string): Promise<void> {
    const track = await this.prisma.audioTrack.findFirst({
      where: { id: trackId },
      include: { project: true },
    });

    if (!track || track.project.userId !== userId) {
      throw new NotFoundException('Audio track not found');
    }

    await this.prisma.audioTrack.delete({
      where: { id: trackId },
    });
  }

  // Text Overlays
  async addTextOverlay(projectId: string, userId: string, dto: AddTextOverlayDto): Promise<any> {
    const project = await this.prisma.videoProject.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundException('Video project not found');
    }

    const overlay = await this.prisma.textOverlay.create({
      data: {
        projectId,
        text: dto.text,
        startTime: dto.startTime,
        endTime: dto.endTime,
        style: dto.style || {},
        positionX: dto.positionX || 0,
        positionY: dto.positionY || 0,
      },
    });

    return overlay;
  }

  async updateTextOverlay(overlayId: string, userId: string, dto: Partial<AddTextOverlayDto>): Promise<any> {
    const overlay = await this.prisma.textOverlay.findFirst({
      where: { id: overlayId },
      include: { project: true },
    });

    if (!overlay || overlay.project.userId !== userId) {
      throw new NotFoundException('Text overlay not found');
    }

    const updatedOverlay = await this.prisma.textOverlay.update({
      where: { id: overlayId },
      data: dto,
    });

    return updatedOverlay;
  }

  async deleteTextOverlay(overlayId: string, userId: string): Promise<void> {
    const overlay = await this.prisma.textOverlay.findFirst({
      where: { id: overlayId },
      include: { project: true },
    });

    if (!overlay || overlay.project.userId !== userId) {
      throw new NotFoundException('Text overlay not found');
    }

    await this.prisma.textOverlay.delete({
      where: { id: overlayId },
    });
  }

  // Transitions
  async addTransition(projectId: string, userId: string, dto: AddTransitionDto): Promise<any> {
    const project = await this.prisma.videoProject.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundException('Video project not found');
    }

    const transition = await this.prisma.transition.create({
      data: {
        projectId,
        type: dto.type,
        startTime: dto.startTime,
        duration: dto.duration,
        settings: dto.settings || {},
      },
    });

    return transition;
  }

  async updateTransition(transitionId: string, userId: string, dto: Partial<AddTransitionDto>): Promise<any> {
    const transition = await this.prisma.transition.findFirst({
      where: { id: transitionId },
      include: { project: true },
    });

    if (!transition || transition.project.userId !== userId) {
      throw new NotFoundException('Transition not found');
    }

    const updatedTransition = await this.prisma.transition.update({
      where: { id: transitionId },
      data: dto,
    });

    return updatedTransition;
  }

  async deleteTransition(transitionId: string, userId: string): Promise<void> {
    const transition = await this.prisma.transition.findFirst({
      where: { id: transitionId },
      include: { project: true },
    });

    if (!transition || transition.project.userId !== userId) {
      throw new NotFoundException('Transition not found');
    }

    await this.prisma.transition.delete({
      where: { id: transitionId },
    });
  }

  // Video Export
  async exportVideo(userId: string, dto: ExportVideoDto): Promise<any> {
    const project = await this.prisma.videoProject.findFirst({
      where: { id: dto.projectId, userId },
    });

    if (!project) {
      throw new NotFoundException('Video project not found');
    }

    // Create export job
    const exportJob = await this.prisma.videoExportJob.create({
      data: {
        projectId: dto.projectId,
        userId,
        format: dto.format,
        quality: dto.quality || '1080p',
        settings: dto.settings || {},
        status: 'pending',
      },
    });

    // In production, this would trigger a background job for video processing
    // For now, we'll simulate the export process
    setTimeout(async () => {
      await this.prisma.videoExportJob.update({
        where: { id: exportJob.id },
        data: { status: 'completed' },
      });
    }, 5000);

    return {
      jobId: exportJob.id,
      status: 'pending',
      estimatedTime: '5 minutes',
    };
  }

  async getExportStatus(jobId: string, userId: string): Promise<any> {
    const job = await this.prisma.videoExportJob.findFirst({
      where: { id: jobId, userId },
    });

    if (!job) {
      throw new NotFoundException('Export job not found');
    }

    return {
      jobId: job.id,
      status: job.status,
      progress: job.progress || 0,
      downloadUrl: job.downloadUrl,
    };
  }

  // Video Templates
  async getVideoTemplates(category?: string): Promise<VideoTemplateDto[]> {
    const where = category ? { category, isPublic: true } : { isPublic: true };
    
    const templates = await this.prisma.videoTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return templates.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      thumbnailUrl: template.thumbnailUrl,
      category: template.category,
      settings: template.settings,
      isPublic: template.isPublic,
      createdAt: template.createdAt,
    }));
  }

  async createVideoTemplate(userId: string, dto: CreateVideoTemplateDto): Promise<VideoTemplateDto> {
    const template = await this.prisma.videoTemplate.create({
      data: {
        userId,
        name: dto.name,
        description: dto.description,
        category: dto.category,
        settings: dto.settings,
        isPublic: dto.isPublic || false,
        thumbnailUrl: '',
      },
    });

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      thumbnailUrl: template.thumbnailUrl,
      category: template.category,
      settings: template.settings,
      isPublic: template.isPublic,
      createdAt: template.createdAt,
    };
  }

  async applyTemplate(projectId: string, userId: string, templateId: string): Promise<VideoProjectResponseDto> {
    const project = await this.prisma.videoProject.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundException('Video project not found');
    }

    const template = await this.prisma.videoTemplate.findFirst({
      where: { id: templateId, isPublic: true },
    });

    if (!template) {
      throw new NotFoundException('Video template not found');
    }

    const updatedProject = await this.prisma.videoProject.update({
      where: { id: projectId },
      data: {
        settings: { ...project.settings, ...template.settings },
      },
    });

    return this.mapToVideoProjectResponse(updatedProject);
  }

  // Effects and Filters
  async getAvailableEffects(): Promise<any[]> {
    return [
      {
        id: 'fade-in',
        name: 'Fade In',
        description: 'Gradual fade in effect',
        category: 'transitions',
        settings: { duration: 1000 },
      },
      {
        id: 'fade-out',
        name: 'Fade Out',
        description: 'Gradual fade out effect',
        category: 'transitions',
        settings: { duration: 1000 },
      },
      {
        id: 'blur',
        name: 'Blur',
        description: 'Blur effect',
        category: 'filters',
        settings: { intensity: 5 },
      },
      {
        id: 'brightness',
        name: 'Brightness',
        description: 'Adjust brightness',
        category: 'filters',
        settings: { value: 1.0 },
      },
      {
        id: 'contrast',
        name: 'Contrast',
        description: 'Adjust contrast',
        category: 'filters',
        settings: { value: 1.0 },
      },
      {
        id: 'saturation',
        name: 'Saturation',
        description: 'Adjust color saturation',
        category: 'filters',
        settings: { value: 1.0 },
      },
    ];
  }

  async getAvailableTransitions(): Promise<any[]> {
    return [
      {
        id: 'crossfade',
        name: 'Crossfade',
        description: 'Smooth transition between clips',
        duration: 1000,
      },
      {
        id: 'slide-left',
        name: 'Slide Left',
        description: 'Slide transition to the left',
        duration: 800,
      },
      {
        id: 'slide-right',
        name: 'Slide Right',
        description: 'Slide transition to the right',
        duration: 800,
      },
      {
        id: 'zoom-in',
        name: 'Zoom In',
        description: 'Zoom in transition',
        duration: 600,
      },
      {
        id: 'zoom-out',
        name: 'Zoom Out',
        description: 'Zoom out transition',
        duration: 600,
      },
    ];
  }

  // Censored/Uncensored Content Management
  async toggleCensoredStatus(projectId: string, userId: string): Promise<VideoProjectResponseDto> {
    const project = await this.prisma.videoProject.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundException('Video project not found');
    }

    const updatedProject = await this.prisma.videoProject.update({
      where: { id: projectId },
      data: {
        isCensored: !project.isCensored,
      },
    });

    return this.mapToVideoProjectResponse(updatedProject);
  }

  async getCensoredProjects(userId: string): Promise<VideoProjectResponseDto[]> {
    const projects = await this.prisma.videoProject.findMany({
      where: { 
        userId,
        isCensored: true,
        isInappropriate: false,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return projects.map(project => this.mapToVideoProjectResponse(project));
  }

  async getUncensoredProjects(userId: string): Promise<VideoProjectResponseDto[]> {
    // Check if user is in KidZone - if so, deny access
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (user?.profile?.isKidZone) {
      throw new BadRequestException('KidZone users cannot access uncensored content');
    }

    const projects = await this.prisma.videoProject.findMany({
      where: { 
        userId,
        isCensored: false,
        isInappropriate: false,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return projects.map(project => this.mapToVideoProjectResponse(project));
  }

  async markAsInappropriate(projectId: string, userId: string, reason: string): Promise<VideoProjectResponseDto> {
    const project = await this.prisma.videoProject.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundException('Video project not found');
    }

    const updatedProject = await this.prisma.videoProject.update({
      where: { id: projectId },
      data: {
        isInappropriate: true,
        inappropriateReason: reason,
        isCensored: true, // Automatically censor inappropriate content
      },
    });

    // Log the inappropriate content report
    await this.prisma.contentReport.create({
      data: {
        reporterId: userId,
        contentType: 'video_project',
        contentId: projectId,
        reason,
        status: 'pending',
      },
    });

    return this.mapToVideoProjectResponse(updatedProject);
  }

  async getContentFilterSettings(): Promise<any> {
    return {
      enabled: true,
      autoCensor: true,
      kidZoneRestrictions: {
        noUncensoredContent: true,
        noInappropriateContent: true,
        maxAgeRating: 'G',
        restrictedCategories: ['violence', 'adult', 'explicit'],
      },
      contentCategories: [
        { id: 'family', name: 'Family Friendly', ageRating: 'G' },
        { id: 'teen', name: 'Teen', ageRating: 'PG-13' },
        { id: 'adult', name: 'Adult', ageRating: 'R' },
        { id: 'explicit', name: 'Explicit', ageRating: 'NC-17' },
      ],
      filterOptions: {
        blurInappropriate: true,
        muteProfanity: true,
        skipViolentScenes: true,
        ageBasedFiltering: true,
      },
    };
  }



  private mapToVideoProjectResponse(project: any): VideoProjectResponseDto {
    return {
      id: project.id,
      userId: project.userId,
      name: project.name,
      description: project.description,
      thumbnailUrl: project.thumbnailUrl,
      settings: project.settings,
      isPublished: project.isPublished,
      isCensored: project.isCensored,
      contentRating: project.contentRating,
      ageRestriction: project.ageRestriction,
      isInappropriate: project.isInappropriate,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
