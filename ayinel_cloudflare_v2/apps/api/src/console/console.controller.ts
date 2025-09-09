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
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ConsoleService } from './console.service';
import {
  ConsoleIntegrationDto,
  ConsoleIntegrationResponseDto,
} from '@ayinel/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Console Integration')
@Controller('console')
export class ConsoleController {
  constructor(private readonly consoleService: ConsoleService) {}

  @Post('integrations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create console integration' })
  @ApiResponse({ status: 201, description: 'Console integration created' })
  async createConsoleIntegration(
    @Req() req,
    @Body() dto: ConsoleIntegrationDto
  ): Promise<ConsoleIntegrationResponseDto> {
    return this.consoleService.createConsoleIntegration(req.user.id, dto);
  }

  @Get('integrations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user console integrations' })
  @ApiResponse({ status: 200, description: 'Console integrations retrieved' })
  async getUserIntegrations(
    @Req() req
  ): Promise<ConsoleIntegrationResponseDto[]> {
    return this.consoleService.getUserIntegrations(req.user.id);
  }

  @Get('integrations/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get console integration by ID' })
  @ApiResponse({ status: 200, description: 'Console integration found' })
  async getConsoleIntegration(
    @Param('id') id: string,
    @Req() req
  ): Promise<ConsoleIntegrationResponseDto> {
    return this.consoleService.getConsoleIntegration(id, req.user.id);
  }

  @Put('integrations/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update console integration' })
  @ApiResponse({ status: 200, description: 'Console integration updated' })
  async updateConsoleIntegration(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: ConsoleIntegrationDto
  ): Promise<ConsoleIntegrationResponseDto> {
    return this.consoleService.updateConsoleIntegration(id, req.user.id, dto);
  }

  @Delete('integrations/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete console integration' })
  @ApiResponse({ status: 200, description: 'Console integration deleted' })
  async deleteConsoleIntegration(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {
    return this.consoleService.deleteConsoleIntegration(id, req.user.id);
  }

  @Put('integrations/:id/toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle console integration status' })
  @ApiResponse({
    status: 200,
    description: 'Console integration status toggled',
  })
  async toggleIntegrationStatus(
    @Param('id') id: string,
    @Req() req
  ): Promise<ConsoleIntegrationResponseDto> {
    return this.consoleService.toggleIntegrationStatus(id, req.user.id);
  }

  @Post('integrations/:id/sync')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync products from platform' })
  @ApiResponse({ status: 200, description: 'Products synced successfully' })
  async syncProducts(
    @Param('id') integrationId: string,
    @Req() req
  ): Promise<any> {
    return this.consoleService.syncProducts(integrationId, req.user.id);
  }

  @Get('platforms')
  @ApiOperation({ summary: 'Get available platforms' })
  @ApiResponse({ status: 200, description: 'Available platforms list' })
  async getAvailablePlatforms(): Promise<any[]> {
    return this.consoleService.getAvailablePlatforms();
  }

  @Get('platforms/:platform/categories')
  @ApiOperation({ summary: 'Get platform categories' })
  @ApiResponse({ status: 200, description: 'Platform categories retrieved' })
  async getPlatformCategories(
    @Param('platform') platform: string
  ): Promise<any[]> {
    return this.consoleService.getPlatformCategories(platform);
  }

  @Get('integrations/:id/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get integration statistics' })
  @ApiResponse({ status: 200, description: 'Integration stats retrieved' })
  async getIntegrationStats(
    @Param('id') integrationId: string,
    @Req() req
  ): Promise<any> {
    return this.consoleService.getIntegrationStats(integrationId, req.user.id);
  }
}
