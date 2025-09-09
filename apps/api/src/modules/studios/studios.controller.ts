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
import { StudiosService } from './studios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateStudioDto, UpdateStudioDto } from './dto';

@Controller('studios')
export class StudiosController {
  constructor(private studiosService: StudiosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createStudio(@Request() req, @Body() createStudioDto: CreateStudioDto) {
    return this.studiosService.create(req.user.id, createStudioDto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.studiosService.findById(id);
  }

  @Get('handle/:handle')
  findByHandle(@Param('handle') handle: string) {
    return this.studiosService.findByHandle(handle);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-studios')
  findByOwner(@Request() req) {
    return this.studiosService.findByOwner(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateStudio(
    @Param('id') id: string,
    @Request() req,
    @Body() updateStudioDto: UpdateStudioDto
  ) {
    return this.studiosService.update(id, req.user.id, updateStudioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteStudio(@Param('id') id: string, @Request() req) {
    return this.studiosService.delete(id, req.user.id);
  }

  @Get('search')
  searchStudios(@Query('q') query: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.studiosService.searchStudios(query, limitNum);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  followStudio(@Param('id') studioId: string, @Request() req) {
    return this.studiosService.followStudio(studioId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/follow')
  unfollowStudio(@Param('id') studioId: string, @Request() req) {
    return this.studiosService.unfollowStudio(studioId, req.user.id);
  }
}
