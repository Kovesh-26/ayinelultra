import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto, UpdateCollectionDto, AddToCollectionDto, CollectionResponseDto } from '@ayinel/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new collection' })
  @ApiResponse({ status: 201, description: 'Collection created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createCollection(
    @Req() req,
    @Body() dto: CreateCollectionDto,
  ): Promise<CollectionResponseDto> {
    return this.collectionsService.createCollection(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all public collections' })
  @ApiResponse({ status: 200, description: 'Collections retrieved successfully' })
  async findAll(@Query('ownerId') ownerId?: string): Promise<CollectionResponseDto[]> {
    return this.collectionsService.findAll(ownerId);
  }

  @Get('my-collections')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user collections' })
  @ApiResponse({ status: 200, description: 'User collections retrieved' })
  async getMyCollections(@Req() req): Promise<CollectionResponseDto[]> {
    return this.collectionsService.findAll(req.user.id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search collections' })
  @ApiResponse({ status: 200, description: 'Collections found' })
  async searchCollections(@Query('q') query: string): Promise<CollectionResponseDto[]> {
    return this.collectionsService.searchCollections(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get collection by ID' })
  @ApiResponse({ status: 200, description: 'Collection found' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  async findById(@Param('id') id: string): Promise<CollectionResponseDto> {
    return this.collectionsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update collection' })
  @ApiResponse({ status: 200, description: 'Collection updated successfully' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  async updateCollection(
    @Param('id') id: string,
    @Body() dto: UpdateCollectionDto,
  ): Promise<CollectionResponseDto> {
    return this.collectionsService.updateCollection(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete collection' })
  @ApiResponse({ status: 200, description: 'Collection deleted successfully' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  async deleteCollection(@Param('id') id: string): Promise<void> {
    return this.collectionsService.deleteCollection(id);
  }

  @Post(':id/add')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add video to collection' })
  @ApiResponse({ status: 200, description: 'Video added to collection' })
  @ApiResponse({ status: 404, description: 'Collection or video not found' })
  async addToCollection(
    @Param('id') collectionId: string,
    @Body() dto: AddToCollectionDto,
  ): Promise<void> {
    return this.collectionsService.addToCollection(collectionId, dto);
  }

  @Delete(':id/remove/:videoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove video from collection' })
  @ApiResponse({ status: 200, description: 'Video removed from collection' })
  @ApiResponse({ status: 404, description: 'Collection or video not found' })
  async removeFromCollection(
    @Param('id') collectionId: string,
    @Param('videoId') videoId: string,
  ): Promise<void> {
    return this.collectionsService.removeFromCollection(collectionId, videoId);
  }
}
