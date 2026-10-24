import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommunicationsService } from './communications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('communications')
@Controller('communications')
export class CommunicationsController {
    constructor(private communicationsService: CommunicationsService) { }

    @Post('email')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Send email' })
    sendEmail(@Body() dto: any) {
        return this.communicationsService.sendEmail(dto);
    }

    @Post('sms')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Send SMS' })
    sendSMS(@Body() dto: any) {
        return this.communicationsService.sendSMS(dto);
    }

    @Post('campaigns')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create email campaign' })
    createCampaign(@Body() dto: any) {
        return this.communicationsService.createEmailCampaign(dto.nonprofitId, dto);
    }

    @Get('notifications')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get notifications' })
    getNotifications(@Request() req: any, @Query() filters: any) {
        return this.communicationsService.getNotifications(req.user.userId, filters);
    }

    @Patch('notifications/:id/read')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Mark as read' })
    markAsRead(@Request() req: any, @Param('id') id: string) {
        return this.communicationsService.markAsRead(req.user.userId, id);
    }

    @Get('preferences')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get preferences' })
    getPreferences(@Request() req: any) {
        return this.communicationsService.getPreferences(req.user.userId);
    }

    @Post('preferences')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update preferences' })
    updatePreferences(@Request() req: any, @Body() dto: any) {
        return this.communicationsService.updatePreferences(req.user.userId, dto);
    }
}
