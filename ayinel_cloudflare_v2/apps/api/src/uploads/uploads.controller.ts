import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Body,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadsService } from './uploads.service';
import { 
  UploadResponseDto, 
  UploadStatusResponseDto,
  CreateUploadDto 
} from '@ayinel/types';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Body() dto: CreateUploadDto,
  ): Promise<UploadResponseDto> {
    return this.uploadsService.uploadVideo(file, req.user.id, dto);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Body() dto: { type: 'AVATAR' | 'BANNER' | 'STUDIO_BANNER' },
  ): Promise<UploadResponseDto> {
    return this.uploadsService.uploadImage(file, req.user.id, dto.type);
  }

  @Post('thumbnail')
  @UseInterceptors(FileInterceptor('file'))
  async uploadThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Body() dto: { videoId: string },
  ): Promise<UploadResponseDto> {
    return this.uploadsService.uploadThumbnail(file, req.user.id, dto.videoId);
  }

  @Get('status/:id')
  async getUploadStatus(@Param('id') id: string): Promise<UploadStatusResponseDto> {
    return this.uploadsService.getUploadStatus(id);
  }

  @Get('user')
  async getUserUploads(@Request() req): Promise<UploadResponseDto[]> {
    return this.uploadsService.getUserUploads(req.user.id);
  }

  @Delete(':id')
  async deleteUpload(@Param('id') id: string, @Request() req): Promise<void> {
    return this.uploadsService.deleteUpload(id, req.user.id);
  }

  @Post('presign')
  async getPresignedUrl(
    @Request() req,
    @Body() dto: { fileName: string; fileType: string; fileSize: number },
  ) {
    return this.uploadsService.getPresignedUrl(req.user.id, dto);
  }

  @Post('webhook/transcode-complete')
  async handleTranscodeWebhook(@Body() payload: any) {
    return this.uploadsService.handleTranscodeWebhook(payload);
  }

  @Get('progress/:uploadId')
  async getUploadProgress(@Param('uploadId') uploadId: string) {
    return this.uploadsService.getUploadProgress(uploadId);
  }

  @Post('retry/:id')
  async retryUpload(@Param('id') id: string, @Request() req): Promise<UploadResponseDto> {
    return this.uploadsService.retryUpload(id, req.user.id);
  }
}
