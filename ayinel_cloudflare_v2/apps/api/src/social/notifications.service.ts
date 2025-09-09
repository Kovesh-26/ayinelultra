import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotificationResponseDto,
  MarkNotificationReadDto,
} from '@ayinel/types';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(
    userId: string,
    type: 'TUNE_IN' | 'BOOST' | 'CHAT' | 'BROADCAST' | 'CREW_UPDATE' | 'SYSTEM',
    title: string,
    message: string,
    data?: any
  ): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data,
      },
    });

    return this.mapToNotificationResponse(notification);
  }

  async getUserNotifications(
    userId: string,
    limit = 50,
    offset = 0
  ): Promise<NotificationResponseDto[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return notifications.map((notification) =>
      this.mapToNotificationResponse(notification)
    );
  }

  async getUnreadNotifications(
    userId: string
  ): Promise<NotificationResponseDto[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
    });

    return notifications.map((notification) =>
      this.mapToNotificationResponse(notification)
    );
  }

  async markNotificationAsRead(
    userId: string,
    notificationId: string
  ): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const updatedNotification = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return this.mapToNotificationResponse(updatedNotification);
  }

  async markAllNotificationsAsRead(
    userId: string,
    type?: string
  ): Promise<void> {
    const where: any = { userId, isRead: false };
    if (type) {
      where.type = type;
    }

    await this.prisma.notification.updateMany({
      where,
      data: { isRead: true },
    });
  }

  async deleteNotification(
    userId: string,
    notificationId: string
  ): Promise<void> {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  async getNotificationCount(
    userId: string
  ): Promise<{ total: number; unread: number }> {
    const [total, unread] = await Promise.all([
      this.prisma.notification.count({
        where: { userId },
      }),
      this.prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    return { total, unread };
  }

  // Helper methods for creating specific types of notifications
  async createTuneInNotification(
    followerId: string,
    followedId: string
  ): Promise<void> {
    const follower = await this.prisma.user.findUnique({
      where: { id: followerId },
      select: { displayName: true },
    });

    const followed = await this.prisma.user.findUnique({
      where: { id: followedId },
      select: { displayName: true },
    });

    if (follower && followed) {
      await this.createNotification(
        followedId,
        'TUNE_IN',
        'New Crew Member!',
        `${follower.displayName} tuned in to your studio`,
        { followerId, followerName: follower.displayName }
      );
    }
  }

  async createBoostNotification(
    userId: string,
    videoId: string,
    boosterId: string
  ): Promise<void> {
    const booster = await this.prisma.user.findUnique({
      where: { id: boosterId },
      select: { displayName: true },
    });

    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
      select: { title: true },
    });

    if (booster && video) {
      await this.createNotification(
        userId,
        'BOOST',
        'Video Boosted!',
        `${booster.displayName} boosted your video "${video.title}"`,
        { videoId, boosterId, boosterName: booster.displayName }
      );
    }
  }

  async createChatNotification(
    userId: string,
    videoId: string,
    chatterId: string
  ): Promise<void> {
    const chatter = await this.prisma.user.findUnique({
      where: { id: chatterId },
      select: { displayName: true },
    });

    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
      select: { title: true },
    });

    if (chatter && video) {
      await this.createNotification(
        userId,
        'CHAT',
        'New Video Chat!',
        `${chatter.displayName} chatted on your video "${video.title}"`,
        { videoId, chatterId, chatterName: chatter.displayName }
      );
    }
  }

  async createBroadcastNotification(
    userId: string,
    studioId: string
  ): Promise<void> {
    const studio = await this.prisma.studio.findUnique({
      where: { id: studioId },
      select: { name: true },
    });

    if (studio) {
      await this.createNotification(
        userId,
        'BROADCAST',
        'Live Broadcast!',
        `${studio.name} is now broadcasting live`,
        { studioId, studioName: studio.name }
      );
    }
  }

  private mapToNotificationResponse(
    notification: any
  ): NotificationResponseDto {
    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    };
  }
}
