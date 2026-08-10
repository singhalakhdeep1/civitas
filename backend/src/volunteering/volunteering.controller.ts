import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VolunteeringService } from './volunteering.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('volunteering')
@Controller('volunteering')
export class VolunteeringController {
    constructor(private volunteeringService: VolunteeringService) { }

    @Post('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create/update volunteer profile' })
    createProfile(@Request() req: { user: { userId: string } }, @Body() dto: any) {
        return this.volunteeringService.createProfile(req.user.userId, dto);
    }

    @Post('opportunities')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create opportunity' })
    createOpportunity(@Body() dto: any) {
        return this.volunteeringService.createOpportunity(dto.nonprofitId, dto);
    }

    @Get('opportunities')
    @ApiOperation({ summary: 'Get opportunities' })
    findOpportunities(@Query() filters: any) {
        return this.volunteeringService.findOpportunities(filters);
    }

    @Post('opportunities/:id/apply')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Apply for opportunity' })
    apply(@Param('id') id: string, @Request() req: { user: { userId: string } }, @Body() dto: any) {
        return this.volunteeringService.apply(id, req.user.userId, dto);
    }

    @Patch('applications/:id/status')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update application status' })
    updateStatus(@Param('id') id: string, @Body() dto: any) {
        return this.volunteeringService.updateApplicationStatus(id, dto.status, dto);
    }

    @Post('hours')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Log volunteer hours' })
    logHours(@Body() dto: any) {
        return this.volunteeringService.logHours(dto.applicationId, dto);
    }

    @Post('certificate')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Generate certificate' })
    generateCertificate(@Request() req: { user: { userId: string } }, @Body() dto: any) {
        return this.volunteeringService.generateCertificate(req.user.userId, dto.nonprofitId);
    }

    @Get('my-applications')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get my applications' })
    getMyApplications(@Request() req: { user: { userId: string } }) {
        return this.volunteeringService.getMyApplications(req.user.userId);
    }

    @Get('my-hours')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get my hours' })
    getMyHours(@Request() req: { user: { userId: string } }) {
        return this.volunteeringService.getMyHours(req.user.userId);
    }
}
