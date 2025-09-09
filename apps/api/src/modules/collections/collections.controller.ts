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
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateCollectionDto,
  UpdateCollectionDto,
  AddVideoToCollectionDto,
  RemoveVideoFromCollectionDto,
} from './dto/collections.dto';

@Controller('api/v1/collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() dto: CreateCollectionDto) {
    return this.collectionsService.create(req.user.id, dto);
  }

  @Get()
  async findAll(
    @Query('visibility') visibility?: string,
    @Request() req?: any
  ) {
    const userId = req?.user?.id;
    return this.collectionsService.findAll(userId, visibility);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req?: any) {
    const userId = req?.user?.id;
    return this.collectionsService.findOne(id, userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateCollectionDto
  ) {
    return this.collectionsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req) {
    return this.collectionsService.remove(id, req.user.id);
  }

  @Post(':id/videos')
  @UseGuards(JwtAuthGuard)
  async addVideo(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: AddVideoToCollectionDto
  ) {
    return this.collectionsService.addVideo(id, req.user.id, dto);
  }

  @Delete(':id/videos/:videoId')
  @UseGuards(JwtAuthGuard)
  async removeVideo(
    @Param('id') id: string,
    @Param('videoId') videoId: string,
    @Request() req
  ) {
    return this.collectionsService.removeVideo(id, req.user.id, { videoId });
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string, @Request() req?: any) {
    const currentUserId = req?.user?.id;
    return this.collectionsService.findByUser(currentUserId, userId);
  }

  @Get('my/collections')
  @UseGuards(JwtAuthGuard)
  async findMyCollections(@Request() req) {
    return this.collectionsService.findByUser(req.user.id);
  }
}
