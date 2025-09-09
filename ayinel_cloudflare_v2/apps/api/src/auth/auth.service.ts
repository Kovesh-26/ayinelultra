import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../notifications/email.service';
import {
  MagicLinkDto,
  GoogleAuthDto,
  VerifyTokenDto,
  RefreshTokenDto,
} from '@ayinel/types';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}

  async sendMagicLink(dto: MagicLinkDto) {
    const { email, redirectUrl } = dto;

    // Check if user exists
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Create user if doesn't exist
    if (!user) {
      const username = await this.generateUniqueUsername(email);
      user = await this.prisma.user.create({
        data: {
          email,
          username,
          displayName: email.split('@')[0],
        },
      });
    }

    // Generate magic link token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store token in database
    await this.prisma.magicLinkToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
        redirectUrl,
      },
    });

    // Send email
    const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;
    await this.emailService.sendMagicLink(email, magicLink);

    return { message: 'Magic link sent to your email' };
  }

  async verifyMagicLink(dto: VerifyTokenDto) {
    const { token } = dto;

    const magicLinkToken = await this.prisma.magicLinkToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!magicLinkToken || magicLinkToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Delete used token
    await this.prisma.magicLinkToken.delete({
      where: { token },
    });

    // Generate JWT tokens
    const accessToken = this.generateAccessToken(magicLinkToken.user);
    const refreshToken = this.generateRefreshToken(magicLinkToken.user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: magicLinkToken.user.id,
        email: magicLinkToken.user.email,
        username: magicLinkToken.user.username,
        displayName: magicLinkToken.user.displayName,
        role: magicLinkToken.user.role,
        isKid: magicLinkToken.user.isKid,
      },
    };
  }

  async googleAuth(dto: GoogleAuthDto) {
    // In a real implementation, you would verify the Google token
    // For now, we'll create a mock implementation
    const { token } = dto;

    // Mock Google user data (replace with actual Google token verification)
    const googleUser = {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/avatar.jpg',
    };

    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      const username = await this.generateUniqueUsername(googleUser.email);
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          username,
          displayName: googleUser.name,
        },
      });
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        isKid: user.isKid,
      },
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const { refreshToken } = dto;

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    // In a real implementation, you might want to blacklist the refresh token
    // For now, we'll just return a success message
    return { message: 'Logged out successfully' };
  }

  private generateAccessToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(user: any) {
    const payload = {
      sub: user.id,
      type: 'refresh',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  private async generateUniqueUsername(email: string): Promise<string> {
    const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    let username = baseUsername;
    let counter = 1;

    while (true) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username },
      });

      if (!existingUser) {
        return username;
      }

      username = `${baseUsername}${counter}`;
      counter++;
    }
  }
}
