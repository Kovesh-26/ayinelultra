import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  UploadResponseDto, 
  UploadStatusResponseDto,
  CreateUploadDto 
} from '@ayinel/types';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadsService {
  constructor(private prisma: PrismaService) {}

  async uploadVideo(
    file: Express.Multer.File,
    userId: string,
    dto: CreateUploadDto,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedVideoTypes = [
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/flv',
      'video/webm',
    ];

    if (!allowedVideoTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid video file type');
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 500MB');
    }

    // Generate unique filename
    const fileId = crypto.randomUUID();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${fileId}${fileExtension}`;

    // Create upload record
    const upload = await this.prisma.upload.create({
      data: {
        userId,
        fileName,
        originalName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        status: 'UPLOADING',
        type: 'VIDEO',
        metadata: {
          title: dto.title,
          description: dto.description,
          tags: dto.tags || [],
          visibility: dto.visibility || 'PRIVATE',
        },
      },
    });

    try {
      // Save file to disk (in production, this would be cloud storage)
      const uploadDir = path.join(process.cwd(), 'uploads', 'videos');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);

      // Update upload status
      await this.prisma.upload.update({
        where: { id: upload.id },
        data: {
          status: 'PROCESSING',
          filePath,
        },
      });

      // Start video processing (transcoding, thumbnail generation, etc.)
      await this.processVideo(upload.id, filePath);

      return this.mapToUploadResponse(upload);
    } catch (error) {
      // Update status to failed
      await this.prisma.upload.update({
        where: { id: upload.id },
        data: { status: 'FAILED' },
      });

      throw new BadRequestException('Failed to process video upload');
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    userId: string,
    type: 'AVATAR' | 'BANNER' | 'STUDIO_BANNER',
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedImageTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid image file type');
    }

    // Validate file size (max 10MB for images)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 10MB');
    }

    // Generate unique filename
    const fileId = crypto.randomUUID();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${fileId}${fileExtension}`;

    // Create upload record
    const upload = await this.prisma.upload.create({
      data: {
        userId,
        fileName,
        originalName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        status: 'UPLOADING',
        type: 'IMAGE',
        metadata: { imageType: type },
      },
    });

    try {
      // Save file to disk
      const uploadDir = path.join(process.cwd(), 'uploads', 'images', type.toLowerCase());
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);

      // Update upload status
      await this.prisma.upload.update({
        where: { id: upload.id },
        data: {
          status: 'COMPLETED',
          filePath,
        },
      });

      return this.mapToUploadResponse(upload);
    } catch (error) {
      await this.prisma.upload.update({
        where: { id: upload.id },
        data: { status: 'FAILED' },
      });

      throw new BadRequestException('Failed to process image upload');
    }
  }

  async uploadThumbnail(
    file: Express.Multer.File,
    userId: string,
    videoId: string,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate that user owns the video
    const video = await this.prisma.video.findFirst({
      where: { id: videoId, studio: { ownerId: userId } },
    });

    if (!video) {
      throw new ForbiddenException('You do not have permission to upload thumbnails for this video');
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedImageTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid image file type');
    }

    // Generate unique filename
    const fileId = crypto.randomUUID();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${fileId}${fileExtension}`;

    // Create upload record
    const upload = await this.prisma.upload.create({
      data: {
        userId,
        fileName,
        originalName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        status: 'UPLOADING',
        type: 'THUMBNAIL',
        metadata: { videoId },
      },
    });

    try {
      // Save file to disk
      const uploadDir = path.join(process.cwd(), 'uploads', 'thumbnails');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);

      // Update video thumbnail
      await this.prisma.video.update({
        where: { id: videoId },
        data: { thumbnailUrl: filePath },
      });

      // Update upload status
      await this.prisma.upload.update({
        where: { id: upload.id },
        data: {
          status: 'COMPLETED',
          filePath,
        },
      });

      return this.mapToUploadResponse(upload);
    } catch (error) {
      await this.prisma.upload.update({
        where: { id: upload.id },
        data: { status: 'FAILED' },
      });

      throw new BadRequestException('Failed to process thumbnail upload');
    }
  }

  async getUploadStatus(id: string): Promise<UploadStatusResponseDto> {
    const upload = await this.prisma.upload.findUnique({
      where: { id },
    });

    if (!upload) {
      throw new NotFoundException('Upload not found');
    }

    return {
      id: upload.id,
      status: upload.status,
      progress: upload.progress || 0,
      message: upload.statusMessage,
    };
  }

  async getUserUploads(userId: string): Promise<UploadResponseDto[]> {
    const uploads = await this.prisma.upload.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return uploads.map(upload => this.mapToUploadResponse(upload));
  }

  async deleteUpload(id: string, userId: string): Promise<void> {
    const upload = await this.prisma.upload.findFirst({
      where: { id, userId },
    });

    if (!upload) {
      throw new NotFoundException('Upload not found or you do not have permission to delete it');
    }

    // Delete file from disk
    if (upload.filePath && fs.existsSync(upload.filePath)) {
      fs.unlinkSync(upload.filePath);
    }

    // Delete from database
    await this.prisma.upload.delete({
      where: { id },
    });
  }

  async getPresignedUrl(
    userId: string,
    dto: { fileName: string; fileType: string; fileSize: number },
  ) {
    // In a real implementation, this would generate a presigned URL for cloud storage
    const fileId = crypto.randomUUID();
    const uploadUrl = `${process.env.API_URL}/uploads/direct/${fileId}`;

    return {
      uploadUrl,
      fileId,
      expiresIn: 3600, // 1 hour
    };
  }

  async handleTranscodeWebhook(payload: any) {
    const { uploadId, status, outputUrl, thumbnailUrl, duration } = payload;

    const upload = await this.prisma.upload.findUnique({
      where: { id: uploadId },
    });

    if (!upload) {
      throw new NotFoundException('Upload not found');
    }

    if (status === 'COMPLETED') {
      await this.prisma.upload.update({
        where: { id: uploadId },
        data: {
          status: 'COMPLETED',
          outputUrl,
          thumbnailUrl,
          metadata: {
            ...upload.metadata,
            duration,
          },
        },
      });
    } else if (status === 'FAILED') {
      await this.prisma.upload.update({
        where: { id: uploadId },
        data: { status: 'FAILED' },
      });
    }

    return { message: 'Webhook processed successfully' };
  }

  async getUploadProgress(uploadId: string) {
    const upload = await this.prisma.upload.findUnique({
      where: { id: uploadId },
    });

    if (!upload) {
      throw new NotFoundException('Upload not found');
    }

    return {
      id: upload.id,
      status: upload.status,
      progress: upload.progress || 0,
      message: upload.statusMessage,
    };
  }

  async retryUpload(id: string, userId: string): Promise<UploadResponseDto> {
    const upload = await this.prisma.upload.findFirst({
      where: { id, userId },
    });

    if (!upload) {
      throw new NotFoundException('Upload not found or you do not have permission to retry it');
    }

    if (upload.status !== 'FAILED') {
      throw new BadRequestException('Only failed uploads can be retried');
    }

    // Reset upload status
    const updatedUpload = await this.prisma.upload.update({
      where: { id },
      data: {
        status: 'UPLOADING',
        progress: 0,
        statusMessage: null,
      },
    });

    // Retry processing based on type
    if (upload.type === 'VIDEO') {
      await this.processVideo(id, upload.filePath);
    }

    return this.mapToUploadResponse(updatedUpload);
  }

  private async processVideo(uploadId: string, filePath: string): Promise<void> {
    // Update status to processing
    await this.prisma.upload.update({
      where: { id: uploadId },
      data: {
        status: 'PROCESSING',
        progress: 10,
        statusMessage: 'Starting video processing...',
      },
    });

    // Simulate video processing steps
    const processingSteps = [
      { progress: 20, message: 'Analyzing video...' },
      { progress: 40, message: 'Generating thumbnails...' },
      { progress: 60, message: 'Transcoding video...' },
      { progress: 80, message: 'Optimizing for web...' },
      { progress: 90, message: 'Finalizing...' },
    ];

    for (const step of processingSteps) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      
      await this.prisma.upload.update({
        where: { id: uploadId },
        data: {
          progress: step.progress,
          statusMessage: step.message,
        },
      });
    }

    // Complete processing
    await this.prisma.upload.update({
      where: { id: uploadId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        statusMessage: 'Video processing completed',
      },
    });
  }

  private mapToUploadResponse(upload: any): UploadResponseDto {
    return {
      id: upload.id,
      userId: upload.userId,
      fileName: upload.fileName,
      originalName: upload.originalName,
      fileType: upload.fileType,
      fileSize: upload.fileSize,
      status: upload.status,
      type: upload.type,
      filePath: upload.filePath,
      outputUrl: upload.outputUrl,
      thumbnailUrl: upload.thumbnailUrl,
      metadata: upload.metadata,
      progress: upload.progress,
      statusMessage: upload.statusMessage,
      createdAt: upload.createdAt,
      updatedAt: upload.updatedAt,
    };
  }
}
