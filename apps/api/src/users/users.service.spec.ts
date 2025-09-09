import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStatusDto } from './dto/update-status.dto';

describe('UsersService - Status Update', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateStatus', () => {
    it('should update user status successfully', async () => {
      const userId = 'test-user-id';
      const statusDto: UpdateStatusDto = {
        status: 'Currently working on AYINEL features! 🚀',
      };

      const mockUpdatedUser = {
        id: userId,
        username: 'testuser',
        displayName: 'Test User',
        status: statusDto.status,
        avatarUrl: null,
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'update').mockResolvedValue(mockUpdatedUser);

      const result = await service.updateStatus(userId, statusDto);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { status: statusDto.status },
        select: {
          id: true,
          username: true,
          displayName: true,
          status: true,
          avatarUrl: true,
          updatedAt: true,
        },
      });

      expect(result).toEqual(mockUpdatedUser);
      expect(result.status).toBe(statusDto.status);
    });

    it('should handle empty status (clearing status)', async () => {
      const userId = 'test-user-id';
      const statusDto: UpdateStatusDto = {
        status: '',
      };

      const mockUpdatedUser = {
        id: userId,
        username: 'testuser',
        displayName: 'Test User',
        status: '',
        avatarUrl: null,
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'update').mockResolvedValue(mockUpdatedUser);

      const result = await service.updateStatus(userId, statusDto);

      expect(result.status).toBe('');
    });
  });
});