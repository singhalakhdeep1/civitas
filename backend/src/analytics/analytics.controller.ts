import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) { }

    @Get('donor')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get donor analytics' })
    getDonorAnalytics(@Request() req) {
        return this.analyticsService.getDonorAnalytics(req.user.userId);
    }

    @Get('campaign/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get campaign analytics' })
    getCampaignAnalytics(@Param('id') id: string) {
        return this.analyticsService.getCampaignAnalytics(id);
    }

    @Get('nonprofit/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get nonprofit analytics' })
    getNonprofitAnalytics(@Param('id') id: string) {
        return this.analyticsService.getNonprofitAnalytics(id);
    }

    @Get('platform')
    @ApiOperation({ summary: 'Get platform stats' })
    getPlatformStats() {
        return this.analyticsService.getPlatformStats();
    }
}
