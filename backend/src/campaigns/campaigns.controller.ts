import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
    constructor(private campaignsService: CampaignsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create campaign' })
    create(@Body() dto: any, @Request() req) {
        return this.campaignsService.create(dto.nonprofitId, req.user.userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all campaigns' })
    findAll(@Query() filters: any) {
        return this.campaignsService.findAll(filters);
    }

    @Get('trending')
    @ApiOperation({ summary: 'Get trending campaigns' })
    getTrending() {
        return this.campaignsService.getTrending();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get campaign by ID' })
    findOne(@Param('id') id: string) {
        return this.campaignsService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update campaign' })
    update(@Param('id') id: string, @Request() req: any, @Body() dto: any) {
        return this.campaignsService.update(id, req.user.userId, dto);
    }

    @Post(':id/milestones')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add milestone' })
    addMilestone(@Param('id') id: string, @Body() dto: any) {
        return this.campaignsService.addMilestone(id, dto);
    }

    @Post(':id/updates')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add update' })
    addUpdate(@Param('id') id: string, @Body() dto: any) {
        return this.campaignsService.addUpdate(id, dto);
    }
}
