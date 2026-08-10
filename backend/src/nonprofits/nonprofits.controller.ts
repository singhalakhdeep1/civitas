import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NonprofitsService } from './nonprofits.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('nonprofits')
@Controller('nonprofits')
export class NonprofitsController {
    constructor(private nonprofitsService: NonprofitsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create nonprofit organization' })
    create(@Request() req: { user: { userId: string } }, @Body() dto: any) {
        return this.nonprofitsService.create(req.user.userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all nonprofits' })
    findAll(@Query() filters: any) {
        return this.nonprofitsService.findAll(filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get nonprofit by ID' })
    findOne(@Param('id') id: string) {
        return this.nonprofitsService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update nonprofit' })
    update(@Param('id') id: string, @Request() req: { user: { userId: string } }, @Body() dto: any) {
        return this.nonprofitsService.update(id, req.user.userId, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete nonprofit' })
    delete(@Param('id') id: string, @Request() req: { user: { userId: string } }) {
        return this.nonprofitsService.delete(id, req.user.userId);
    }

    @Post(':id/verify')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Request verification' })
    requestVerification(@Param('id') id: string, @Request() req: { user: { userId: string } }, @Body() documents: any) {
        return this.nonprofitsService.requestVerification(id, req.user.userId, documents);
    }

    @Post(':id/team-members')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add team member' })
    addTeamMember(@Param('id') id: string, @Request() req: { user: { userId: string } }, @Body() dto: any) {
        return this.nonprofitsService.addTeamMember(id, req.user.userId, dto);
    }

    @Get(':id/campaigns')
    @ApiOperation({ summary: 'Get nonprofit campaigns' })
    getCampaigns(@Param('id') id: string) {
        return this.nonprofitsService.getCampaigns(id);
    }

    @Get(':id/events')
    @ApiOperation({ summary: 'Get nonprofit events' })
    getEvents(@Param('id') id: string) {
        return this.nonprofitsService.getEvents(id);
    }

    @Post(':id/reviews')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add review' })
    addReview(@Param('id') id: string, @Request() req: { user: { userId: string } }, @Body() dto: any) {
        return this.nonprofitsService.addReview(id, req.user.userId, dto);
    }
}
