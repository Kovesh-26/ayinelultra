import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { KidzoneService } from './kidzone.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateKidProfileDto,
  UpdateKidSettingsDto,
  GuardianConsentDto,
  AgeVerificationDto,
} from './dto/kidzone.dto';
import { KidAgeGroup } from '@prisma/client';

@Controller('api/v1/kidzone')
export class KidzoneController {
  constructor(private readonly kidzoneService: KidzoneService) {}

  // Get KidZone feed
  @Get('feed')
  async getKidZoneFeed(
    @Query('ageGroup') ageGroup?: KidAgeGroup,
    @Request() req?: any
  ) {
    const userId = req?.user?.id;
    return this.kidzoneService.getKidZoneFeed(userId, ageGroup);
  }

  // Get family-friendly studios
  @Get('studios')
  async getFamilyFriendlyStudios() {
    return this.kidzoneService.getFamilyFriendlyStudios();
  }

  // Create kid profile (guardian only)
  @Post('profiles')
  @UseGuards(JwtAuthGuard)
  async createKidProfile(@Request() req, @Body() dto: CreateKidProfileDto) {
    return this.kidzoneService.createKidProfile(req.user.id, dto);
  }

  // Get kid profiles for guardian
  @Get('profiles')
  @UseGuards(JwtAuthGuard)
  async getKidProfiles(@Request() req) {
    return this.kidzoneService.getKidProfiles(req.user.id);
  }

  // Update kid settings
  @Put('settings')
  @UseGuards(JwtAuthGuard)
  async updateKidSettings(@Request() req, @Body() dto: UpdateKidSettingsDto) {
    return this.kidzoneService.updateKidSettings(req.user.id, dto);
  }

  // Get kid settings
  @Get('settings')
  @UseGuards(JwtAuthGuard)
  async getKidSettings(@Request() req) {
    return this.kidzoneService.getKidSettings(req.user.id);
  }

  // Age verification
  @Post('verify-age')
  @UseGuards(JwtAuthGuard)
  async verifyAge(@Request() req, @Body() dto: AgeVerificationDto) {
    return this.kidzoneService.verifyAge(req.user.id, dto);
  }

  // Request guardian consent
  @Post('guardian-consent')
  @UseGuards(JwtAuthGuard)
  async requestGuardianConsent(
    @Request() req,
    @Body() dto: GuardianConsentDto
  ) {
    return this.kidzoneService.requestGuardianConsent(req.user.id, dto);
  }

  // Verify guardian consent
  @Post('verify-guardian-consent')
  @UseGuards(JwtAuthGuard)
  async verifyGuardianConsent(@Request() req, @Body() body: { token: string }) {
    return this.kidzoneService.verifyGuardianConsent(req.user.id, body.token);
  }

  // Check if content is safe for kid
  @Get('content/:videoId/safe')
  async isContentSafe(@Param('videoId') videoId: string, @Request() req?: any) {
    const userId = req?.user?.id;
    const isSafe = await this.kidzoneService.isContentSafeForKid(
      videoId,
      userId
    );
    return { isSafe };
  }
}
