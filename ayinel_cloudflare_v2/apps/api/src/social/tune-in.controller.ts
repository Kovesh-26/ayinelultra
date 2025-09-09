import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TuneInService } from './tune-in.service';
import { TuneInDto, TuneInResponseDto } from '@ayinel/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tune-In')
@Controller('tune-in')
export class TuneInController {
  constructor(private readonly tuneInService: TuneInService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tune in to a user' })
  @ApiResponse({ status: 201, description: 'Successfully tuned in to user' })
  async tuneInToUser(
    @Req() req,
    @Body() dto: TuneInDto
  ): Promise<TuneInResponseDto> {
    return this.tuneInService.tuneInToUser(req.user.id, dto);
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Untune from a user' })
  @ApiResponse({ status: 200, description: 'Successfully untuned from user' })
  async untuneFromUser(
    @Req() req,
    @Param('userId') userId: string
  ): Promise<void> {
    return this.tuneInService.untuneFromUser(req.user.id, userId);
  }

  @Get('following')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get users you are tuned in to' })
  @ApiResponse({
    status: 200,
    description: 'List of users you are tuned in to',
  })
  async getTuneInsByUser(@Req() req): Promise<TuneInResponseDto[]> {
    return this.tuneInService.getTuneInsByUser(req.user.id);
  }

  @Get('crew')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get your crew (users tuned in to you)' })
  @ApiResponse({ status: 200, description: 'List of users in your crew' })
  async getTuneInCrew(@Req() req): Promise<TuneInResponseDto[]> {
    return this.tuneInService.getTuneInCrew(req.user.id);
  }

  @Get('check/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if you are tuned in to a user' })
  @ApiResponse({ status: 200, description: 'Tune-in status' })
  async isTunedIn(
    @Req() req,
    @Param('userId') userId: string
  ): Promise<{ isTunedIn: boolean }> {
    const isTunedIn = await this.tuneInService.isTunedIn(req.user.id, userId);
    return { isTunedIn };
  }

  @Get('count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tune-in counts' })
  @ApiResponse({ status: 200, description: 'Tune-in counts' })
  async getTuneInCount(
    @Req() req
  ): Promise<{ following: number; crew: number }> {
    return this.tuneInService.getTuneInCount(req.user.id);
  }
}
