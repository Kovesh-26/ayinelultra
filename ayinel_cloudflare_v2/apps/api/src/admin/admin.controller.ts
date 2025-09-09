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
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';
import {
  BanUserDto,
  UpdateUserRoleDto,
  ModerationActionDto,
  SystemStatsResponseDto,
} from '@ayinel/types';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getSystemStats(): Promise<SystemStatsResponseDto> {
    return this.adminService.getSystemStats();
  }

  @Get('users')
  async getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('status') status?: string
  ) {
    return this.adminService.getUsers(page, limit, search, status);
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Put('users/:id/ban')
  async banUser(@Param('id') id: string, @Body() dto: BanUserDto) {
    return this.adminService.banUser(id, dto);
  }

  @Put('users/:id/unban')
  async unbanUser(@Param('id') id: string) {
    return this.adminService.unbanUser(id);
  }

  @Put('users/:id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto
  ) {
    return this.adminService.updateUserRole(id, dto);
  }

  @Get('content/reported')
  async getReportedContent(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('type') type?: string
  ) {
    return this.adminService.getReportedContent(page, limit, type);
  }

  @Post('content/:id/moderate')
  async moderateContent(
    @Param('id') id: string,
    @Body() dto: ModerationActionDto
  ) {
    return this.adminService.moderateContent(id, dto);
  }

  @Get('studios')
  async getStudios(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string
  ) {
    return this.adminService.getStudios(page, limit, status);
  }

  @Put('studios/:id/approve')
  async approveStudio(@Param('id') id: string) {
    return this.adminService.approveStudio(id);
  }

  @Put('studios/:id/reject')
  async rejectStudio(@Param('id') id: string, @Body() dto: { reason: string }) {
    return this.adminService.rejectStudio(id, dto.reason);
  }

  @Get('analytics')
  async getAnalytics(@Query('period') period: string = '7d') {
    return this.adminService.getAnalytics(period);
  }

  @Get('logs')
  async getSystemLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('level') level?: string
  ) {
    return this.adminService.getSystemLogs(page, limit, level);
  }

  @Post('maintenance')
  async startMaintenance(@Body() dto: { duration: number; message: string }) {
    return this.adminService.startMaintenance(dto);
  }

  @Delete('maintenance')
  async endMaintenance() {
    return this.adminService.endMaintenance();
  }
}
