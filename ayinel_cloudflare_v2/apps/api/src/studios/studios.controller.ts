import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StudiosService } from './studios.service';
import { CreateStudioDto, UpdateStudioDto, StudioResponseDto } from '@ayinel/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Studios')
@Controller('studios')
export class StudiosController {
  constructor(private readonly studiosService: StudiosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new studio' })
  @ApiResponse({ status: 201, description: 'Studio created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createStudio(
    @Req() req,
    @Body() dto: CreateStudioDto,
  ): Promise<StudioResponseDto> {
    return this.studiosService.createStudio(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all creator studios' })
  @ApiResponse({ status: 200, description: 'Studios retrieved successfully' })
  async findAll(): Promise<StudioResponseDto[]> {
    return this.studiosService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search studios' })
  @ApiResponse({ status: 200, description: 'Studios found' })
  async searchStudios(@Query('q') query: string): Promise<StudioResponseDto[]> {
    return this.studiosService.searchStudios(query);
  }

  @Get('my-studio')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user studio' })
  @ApiResponse({ status: 200, description: 'Studio found' })
  @ApiResponse({ status: 404, description: 'Studio not found' })
  async getMyStudio(@Req() req): Promise<StudioResponseDto> {
    return this.studiosService.findByOwnerId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get studio by ID' })
  @ApiResponse({ status: 200, description: 'Studio found' })
  @ApiResponse({ status: 404, description: 'Studio not found' })
  async findById(@Param('id') id: string): Promise<StudioResponseDto> {
    return this.studiosService.findById(id);
  }

  @Get('handle/:handle')
  @ApiOperation({ summary: 'Get studio by handle' })
  @ApiResponse({ status: 200, description: 'Studio found' })
  @ApiResponse({ status: 404, description: 'Studio not found' })
  async findByHandle(@Param('handle') handle: string): Promise<StudioResponseDto> {
    return this.studiosService.findByHandle(handle);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update studio' })
  @ApiResponse({ status: 200, description: 'Studio updated successfully' })
  @ApiResponse({ status: 404, description: 'Studio not found' })
  async updateStudio(
    @Param('id') id: string,
    @Body() dto: UpdateStudioDto,
  ): Promise<StudioResponseDto> {
    return this.studiosService.updateStudio(id, dto);
  }

  @Put(':id/upgrade')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upgrade studio to creator' })
  @ApiResponse({ status: 200, description: 'Studio upgraded successfully' })
  @ApiResponse({ status: 404, description: 'Studio not found' })
  async upgradeToCreator(@Param('id') id: string): Promise<StudioResponseDto> {
    return this.studiosService.upgradeToCreator(id);
  }
}
