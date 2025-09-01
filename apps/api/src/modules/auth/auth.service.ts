import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto, RegisterDto, AuthResponse } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<{ id: string; email: string; username: string; handle: string; displayName: string; avatar?: string; role: string } | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;
    
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        handle: user.handle,
        displayName: user.displayName,
        avatar: user.avatar,
        role: user.role,
      },
      accessToken,
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, username, handle, displayName, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
          { handle },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists with this email, username, or handle');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        handle,
        displayName,
        password: hashedPassword,
      },
    });

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        handle: user.handle,
        displayName: user.displayName,
        avatar: user.avatar,
        role: user.role,
      },
      accessToken,
    };
  }

  async refreshToken(userId: string): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async verifyToken(token: string): Promise<{ email: string; sub: string; iat: number; exp: number }> {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (_error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
