import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private _prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this._prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        handle: true,
        displayName: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this._prisma.user.findUnique({
      where: { email },
    });
  }

  async findByHandle(handle: string) {
    return this._prisma.user.findUnique({
      where: { username: handle },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this._prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        username: true,
        handle: true,
        displayName: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async delete(id: string) {
    await this._prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }

  async searchUsers(query: string, limit = 10) {
    return this._prisma.user.findMany({
      where: {
        OR: [
          { displayName: { contains: query, mode: 'insensitive' } },
          { username: { contains: query, mode: 'insensitive' } },
          { handle: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        handle: true,
        displayName: true,
        avatar: true,
        bio: true,
      },
      take: limit,
    });
  }
}
