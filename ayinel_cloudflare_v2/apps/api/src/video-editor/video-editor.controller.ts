import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VideoEditorService } from './video-editor.service';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Video Editor')
@Controller('video-editor')
export class VideoEditorController {
  constructor(private readonly videoEditorService: VideoEditorService) {}

  // Video Project Management
  @Post('projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create video project' })
  @ApiResponse({ status: 201, description: 'Video project created' })
  async createVideoProject(@Req() req, @Body() dto: CreateVideoProjectDto): Promise<VideoProjectResponseDto> {
    return this.videoEditorService.createVideoProject(req.user.id, dto);
  }

  @Get('projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user video projects' })
  @ApiResponse({ status: 200, description: 'Video projects retrieved' })
  async getUserProjects(@Req() req): Promise<VideoProjectResponseDto[]> {
    return this.videoEditorService.getUserProjects(req.user.id);
  }

  @Get('projects/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get video project by ID' })
  @ApiResponse({ status: 200, description: 'Video project found' })
  async getVideoProject(@Param('id') id: string, @Req() req): Promise<VideoProjectResponseDto> {
    return this.videoEditorService.getVideoProject(id, req.user.id);
  }

  @Put('projects/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update video project' })
  @ApiResponse({ status: 200, description: 'Video project updated' })
  async updateVideoProject(@Param('id') id: string, @Req() req, @Body() dto: UpdateVideoProjectDto): Promise<VideoProjectResponseDto> {
    return this.videoEditorService.updateVideoProject(id, req.user.id, dto);
  }

  @Delete('projects/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete video project' })
  @ApiResponse({ status: 200, description: 'Video project deleted' })
  async deleteVideoProject(@Param('id') id: string, @Req() req): Promise<void> {
    return this.videoEditorService.deleteVideoProject(id, req.user.id);
  }

  @Post('projects/:id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish video project' })
  @ApiResponse({ status: 200, description: 'Video project published' })
  async publishVideoProject(@Param('id') id: string, @Req() req): Promise<VideoProjectResponseDto> {
    return this.videoEditorService.publishVideoProject(id, req.user.id);
  }

  // Timeline Management
  @Get('projects/:id/timeline')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get project timeline' })
  @ApiResponse({ status: 200, description: 'Project timeline retrieved' })
  async getProjectTimeline(@Param('id') projectId: string, @Req() req): Promise<VideoProjectTimelineDto> {
    return this.videoEditorService.getProjectTimeline(projectId, req.user.id);
  }

  // Video Clips
  @Post('projects/:id/clips')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add video clip to project' })
  @ApiResponse({ status: 201, description: 'Video clip added' })
  async addVideoClip(@Param('id') projectId: string, @Req() req, @Body() dto: AddVideoClipDto): Promise<any> {
    return this.videoEditorService.addVideoClip(projectId, req.user.id, dto);
  }

  @Put('clips/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update video clip' })
  @ApiResponse({ status: 200, description: 'Video clip updated' })
  async updateVideoClip(@Param('id') clipId: string, @Req() req, @Body() dto: Partial<AddVideoClipDto>): Promise<any> {
    return this.videoEditorService.updateVideoClip(clipId, req.user.id, dto);
  }

  @Delete('clips/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete video clip' })
  @ApiResponse({ status: 200, description: 'Video clip deleted' })
  async deleteVideoClip(@Param('id') clipId: string, @Req() req): Promise<void> {
    return this.videoEditorService.deleteVideoClip(clipId, req.user.id);
  }

  // Audio Tracks
  @Post('projects/:id/audio')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add audio track to project' })
  @ApiResponse({ status: 201, description: 'Audio track added' })
  async addAudioTrack(@Param('id') projectId: string, @Req() req, @Body() dto: AddAudioTrackDto): Promise<any> {
    return this.videoEditorService.addAudioTrack(projectId, req.user.id, dto);
  }

  @Put('audio/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update audio track' })
  @ApiResponse({ status: 200, description: 'Audio track updated' })
  async updateAudioTrack(@Param('id') trackId: string, @Req() req, @Body() dto: Partial<AddAudioTrackDto>): Promise<any> {
    return this.videoEditorService.updateAudioTrack(trackId, req.user.id, dto);
  }

  @Delete('audio/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete audio track' })
  @ApiResponse({ status: 200, description: 'Audio track deleted' })
  async deleteAudioTrack(@Param('id') trackId: string, @Req() req): Promise<void> {
    return this.videoEditorService.deleteAudioTrack(trackId, req.user.id);
  }

  // Text Overlays
  @Post('projects/:id/text')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add text overlay to project' })
  @ApiResponse({ status: 201, description: 'Text overlay added' })
  async addTextOverlay(@Param('id') projectId: string, @Req() req, @Body() dto: AddTextOverlayDto): Promise<any> {
    return this.videoEditorService.addTextOverlay(projectId, req.user.id, dto);
  }

  @Put('text/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update text overlay' })
  @ApiResponse({ status: 200, description: 'Text overlay updated' })
  async updateTextOverlay(@Param('id') overlayId: string, @Req() req, @Body() dto: Partial<AddTextOverlayDto>): Promise<any> {
    return this.videoEditorService.updateTextOverlay(overlayId, req.user.id, dto);
  }

  @Delete('text/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete text overlay' })
  @ApiResponse({ status: 200, description: 'Text overlay deleted' })
  async deleteTextOverlay(@Param('id') overlayId: string, @Req() req): Promise<void> {
    return this.videoEditorService.deleteTextOverlay(overlayId, req.user.id);
  }

  // Transitions
  @Post('projects/:id/transitions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add transition to project' })
  @ApiResponse({ status: 201, description: 'Transition added' })
  async addTransition(@Param('id') projectId: string, @Req() req, @Body() dto: AddTransitionDto): Promise<any> {
    return this.videoEditorService.addTransition(projectId, req.user.id, dto);
  }

  @Put('transitions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update transition' })
  @ApiResponse({ status: 200, description: 'Transition updated' })
  async updateTransition(@Param('id') transitionId: string, @Req() req, @Body() dto: Partial<AddTransitionDto>): Promise<any> {
    return this.videoEditorService.updateTransition(transitionId, req.user.id, dto);
  }

  @Delete('transitions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete transition' })
  @ApiResponse({ status: 200, description: 'Transition deleted' })
  async deleteTransition(@Param('id') transitionId: string, @Req() req): Promise<void> {
    return this.videoEditorService.deleteTransition(transitionId, req.user.id);
  }

  // Video Export
  @Post('export')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export video project' })
  @ApiResponse({ status: 201, description: 'Export job created' })
  async exportVideo(@Req() req, @Body() dto: ExportVideoDto): Promise<any> {
    return this.videoEditorService.exportVideo(req.user.id, dto);
  }

  @Get('export/:jobId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get export status' })
  @ApiResponse({ status: 200, description: 'Export status retrieved' })
  async getExportStatus(@Param('jobId') jobId: string, @Req() req): Promise<any> {
    return this.videoEditorService.getExportStatus(jobId, req.user.id);
  }

  // Video Templates
  @Get('templates')
  @ApiOperation({ summary: 'Get video templates' })
  @ApiResponse({ status: 200, description: 'Video templates retrieved' })
  async getVideoTemplates(@Query('category') category?: string): Promise<VideoTemplateDto[]> {
    return this.videoEditorService.getVideoTemplates(category);
  }

  @Post('templates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create video template' })
  @ApiResponse({ status: 201, description: 'Video template created' })
  async createVideoTemplate(@Req() req, @Body() dto: CreateVideoTemplateDto): Promise<VideoTemplateDto> {
    return this.videoEditorService.createVideoTemplate(req.user.id, dto);
  }

  @Post('projects/:id/apply-template/:templateId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply template to project' })
  @ApiResponse({ status: 200, description: 'Template applied to project' })
  async applyTemplate(@Param('id') projectId: string, @Param('templateId') templateId: string, @Req() req): Promise<VideoProjectResponseDto> {
    return this.videoEditorService.applyTemplate(projectId, req.user.id, templateId);
  }

  // Effects and Filters
  @Get('effects')
  @ApiOperation({ summary: 'Get available effects' })
  @ApiResponse({ status: 200, description: 'Available effects retrieved' })
  async getAvailableEffects(): Promise<any[]> {
    return this.videoEditorService.getAvailableEffects();
  }

  @Get('transitions')
  @ApiOperation({ summary: 'Get available transitions' })
  @ApiResponse({ status: 200, description: 'Available transitions retrieved' })
  async getAvailableTransitions(): Promise<any[]> {
    return this.videoEditorService.getAvailableTransitions();
  }

  // Censored/Uncensored Content Management
  @Post('projects/:id/toggle-censored')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle censored status of video project' })
  @ApiResponse({ status: 200, description: 'Censored status toggled' })
  async toggleCensoredStatus(@Param('id') projectId: string, @Req() req): Promise<VideoProjectResponseDto> {
    return this.videoEditorService.toggleCensoredStatus(projectId, req.user.id);
  }

  @Get('projects/censored')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get censored video projects' })
  @ApiResponse({ status: 200, description: 'Censored projects retrieved' })
  async getCensoredProjects(@Req() req): Promise<VideoProjectResponseDto[]> {
    return this.videoEditorService.getCensoredProjects(req.user.id);
  }

  @Get('projects/uncensored')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get uncensored video projects (KidZone restricted)' })
  @ApiResponse({ status: 200, description: 'Uncensored projects retrieved' })
  async getUncensoredProjects(@Req() req): Promise<VideoProjectResponseDto[]> {
    return this.videoEditorService.getUncensoredProjects(req.user.id);
  }

  @Post('projects/:id/mark-inappropriate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark video project as inappropriate' })
  @ApiResponse({ status: 200, description: 'Project marked as inappropriate' })
  async markAsInappropriate(@Param('id') projectId: string, @Req() req, @Body() dto: { reason: string }): Promise<VideoProjectResponseDto> {
    return this.videoEditorService.markAsInappropriate(projectId, req.user.id, dto.reason);
  }

  @Get('content-filter')
  @ApiOperation({ summary: 'Get content filter settings' })
  @ApiResponse({ status: 200, description: 'Content filter settings retrieved' })
  async getContentFilterSettings(): Promise<any> {
    return this.videoEditorService.getContentFilterSettings();
  }
}
