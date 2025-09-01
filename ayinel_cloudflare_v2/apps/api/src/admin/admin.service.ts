import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  BanUserDto, 
  UpdateUserRoleDto, 
  ModerationActionDto,
  SystemStatsResponseDto 
} from '@ayinel/types';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getSystemStats(): Promise<SystemStatsResponseDto> {
    const [
      totalUsers,
      totalStudios,
      totalVideos,
      totalCollections,
      activeUsers,
      pendingStudios,
      reportedContent,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.studio.count(),
      this.prisma.video.count(),
      this.prisma.collection.count(),
      this.prisma.user.count({ where: { status: 'ACTIVE' } }),
      this.prisma.studio.count({ where: { status: 'PENDING' } }),
      this.prisma.contentReport.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      totalUsers,
      totalStudios,
      totalVideos,
      totalCollections,
      activeUsers,
      pendingStudios,
      reportedContent,
      systemHealth: 'HEALTHY',
      uptime: process.uptime(),
    };
  }

  async getUsers(page: number, limit: number, search?: string, status?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) {
      where.status = status;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        studio: true,
        videos: true,
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async banUser(id: string, dto: BanUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const bannedUser = await this.prisma.user.update({
      where: { id },
      data: {
        status: 'BANNED',
        bannedAt: new Date(),
        banReason: dto.reason,
      },
    });

    // Log the action
    await this.prisma.adminLog.create({
      data: {
        action: 'BAN_USER',
        targetId: id,
        targetType: 'USER',
        details: dto.reason,
      },
    });

    return bannedUser;
  }

  async unbanUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const unbannedUser = await this.prisma.user.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        bannedAt: null,
        banReason: null,
      },
    });

    // Log the action
    await this.prisma.adminLog.create({
      data: {
        action: 'UNBAN_USER',
        targetId: id,
        targetType: 'USER',
        details: 'User unbanned',
      },
    });

    return unbannedUser;
  }

  async updateUserRole(id: string, dto: UpdateUserRoleDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { role: dto.role },
    });

    // Log the action
    await this.prisma.adminLog.create({
      data: {
        action: 'UPDATE_USER_ROLE',
        targetId: id,
        targetType: 'USER',
        details: `Role updated to ${dto.role}`,
      },
    });

    return updatedUser;
  }

  async getReportedContent(page: number, limit: number, type?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = { status: 'PENDING' };
    if (type) {
      where.contentType = type;
    }

    const [reports, total] = await Promise.all([
      this.prisma.contentReport.findMany({
        where,
        include: {
          reporter: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contentReport.count({ where }),
    ]);

    return {
      reports,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async moderateContent(id: string, dto: ModerationActionDto) {
    const report = await this.prisma.contentReport.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    // Update report status
    await this.prisma.contentReport.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        moderatorAction: dto.action,
        moderatorNotes: dto.notes,
      },
    });

    // Take action on the content if necessary
    if (dto.action === 'REMOVE') {
      if (report.contentType === 'VIDEO') {
        await this.prisma.video.update({
          where: { id: report.contentId },
          data: { status: 'REMOVED' },
        });
      } else if (report.contentType === 'STUDIO') {
        await this.prisma.studio.update({
          where: { id: report.contentId },
          data: { status: 'SUSPENDED' },
        });
      }
    }

    // Log the action
    await this.prisma.adminLog.create({
      data: {
        action: 'MODERATE_CONTENT',
        targetId: report.contentId,
        targetType: report.contentType,
        details: `${dto.action}: ${dto.notes}`,
      },
    });

    return { message: 'Content moderated successfully' };
  }

  async getStudios(page: number, limit: number, status?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [studios, total] = await Promise.all([
      this.prisma.studio.findMany({
        where,
        include: {
          owner: true,
          videos: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.studio.count({ where }),
    ]);

    return {
      studios,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approveStudio(id: string) {
    const studio = await this.prisma.studio.findUnique({ where: { id } });
    if (!studio) {
      throw new NotFoundException('Studio not found');
    }

    const approvedStudio = await this.prisma.studio.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    // Log the action
    await this.prisma.adminLog.create({
      data: {
        action: 'APPROVE_STUDIO',
        targetId: id,
        targetType: 'STUDIO',
        details: 'Studio approved',
      },
    });

    return approvedStudio;
  }

  async rejectStudio(id: string, reason: string) {
    const studio = await this.prisma.studio.findUnique({ where: { id } });
    if (!studio) {
      throw new NotFoundException('Studio not found');
    }

    const rejectedStudio = await this.prisma.studio.update({
      where: { id },
      data: { 
        status: 'REJECTED',
        rejectionReason: reason,
      },
    });

    // Log the action
    await this.prisma.adminLog.create({
      data: {
        action: 'REJECT_STUDIO',
        targetId: id,
        targetType: 'STUDIO',
        details: reason,
      },
    });

    return rejectedStudio;
  }

  async getAnalytics(period: string) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const [
      newUsers,
      newStudios,
      newVideos,
      newCollections,
      userActivity,
      videoViews,
    ] = await Promise.all([
      this.prisma.user.count({
        where: { createdAt: { gte: startDate } },
      }),
      this.prisma.studio.count({
        where: { createdAt: { gte: startDate } },
      }),
      this.prisma.video.count({
        where: { createdAt: { gte: startDate } },
      }),
      this.prisma.collection.count({
        where: { createdAt: { gte: startDate } },
      }),
      this.prisma.userActivity.count({
        where: { createdAt: { gte: startDate } },
      }),
      this.prisma.videoView.count({
        where: { createdAt: { gte: startDate } },
      }),
    ]);

    return {
      period,
      newUsers,
      newStudios,
      newVideos,
      newCollections,
      userActivity,
      videoViews,
    };
  }

  async getSystemLogs(page: number, limit: number, level?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (level) {
      where.level = level;
    }

    const [logs, total] = await Promise.all([
      this.prisma.systemLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.systemLog.count({ where }),
    ]);

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async startMaintenance(dto: { duration: number; message: string }) {
    const maintenance = await this.prisma.maintenanceMode.create({
      data: {
        isActive: true,
        message: dto.message,
        startedAt: new Date(),
        duration: dto.duration,
      },
    });

    // Log the action
    await this.prisma.adminLog.create({
      data: {
        action: 'START_MAINTENANCE',
        details: `Started maintenance: ${dto.message} (${dto.duration} minutes)`,
      },
    });

    return maintenance;
  }

  async endMaintenance() {
    await this.prisma.maintenanceMode.updateMany({
      where: { isActive: true },
      data: { 
        isActive: false,
        endedAt: new Date(),
      },
    });

    // Log the action
    await this.prisma.adminLog.create({
      data: {
        action: 'END_MAINTENANCE',
        details: 'Maintenance ended',
      },
    });

    return { message: 'Maintenance mode ended' };
  }
}
