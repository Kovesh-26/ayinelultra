import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import {
  NotificationResponseDto,
  MarkNotificationReadDto,
} from '@ayinel/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiResponse({ status: 200, description: 'List of notifications' })
  async getUserNotifications(
    @Req() req,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ): Promise<NotificationResponseDto[]> {
    return this.notificationsService.getUserNotifications(
      req.user.id,
      limit,
      offset
    );
  }

  @Get('unread')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unread notifications' })
  @ApiResponse({ status: 200, description: 'List of unread notifications' })
  async getUnreadNotifications(@Req() req): Promise<NotificationResponseDto[]> {
    return this.notificationsService.getUnreadNotifications(req.user.id);
  }

  @Post(':notificationId/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markNotificationAsRead(
    @Req() req,
    @Param('notificationId') notificationId: string
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.markNotificationAsRead(
      req.user.id,
      notificationId
    );
  }

  @Post('read-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllNotificationsAsRead(
    @Req() req,
    @Query('type') type?: string
  ): Promise<void> {
    return this.notificationsService.markAllNotificationsAsRead(
      req.user.id,
      type
    );
  }

  @Delete(':notificationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted' })
  async deleteNotification(
    @Req() req,
    @Param('notificationId') notificationId: string
  ): Promise<void> {
    return this.notificationsService.deleteNotification(
      req.user.id,
      notificationId
    );
  }

  @Get('count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notification count' })
  @ApiResponse({ status: 200, description: 'Notification count' })
  async getNotificationCount(
    @Req() req
  ): Promise<{ total: number; unread: number }> {
    return this.notificationsService.getNotificationCount(req.user.id);
  }
}
