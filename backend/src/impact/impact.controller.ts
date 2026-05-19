import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ImpactService } from './impact.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('impact')
@Controller('impact')
export class ImpactController {
    constructor(private impactService: ImpactService) { }

    @Post('metrics')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create impact metric' })
    createMetric(@Body() dto: any) {
        return this.impactService.createMetric(dto.nonprofitId, dto);
    }

    @Post('stories')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create impact story' })
    createStory(@Body() dto: any) {
        return this.impactService.createStory(dto.nonprofitId, dto);
    }

    @Get('stories')
    @ApiOperation({ summary: 'Get impact stories' })
    getStories(@Query() filters: any) {
        return this.impactService.getStories(filters);
    }

    @Get('nonprofit/:id')
    @ApiOperation({ summary: 'Get nonprofit impact' })
    getNonprofitImpact(@Param('id') id: string) {
        return this.impactService.getNonprofitImpact(id);
    }

    @Post('financial-reports')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create financial report' })
    createFinancialReport(@Body() dto: any) {
        return this.impactService.createFinancialReport(dto.nonprofitId, dto);
    }
}
