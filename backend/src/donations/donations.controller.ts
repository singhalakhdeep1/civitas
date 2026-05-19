import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DonationsService } from './donations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('donations')
@Controller('donations')
export class DonationsController {
    constructor(private donationsService: DonationsService) { }

    @Post('one-time')
    @ApiOperation({ summary: 'Create one-time donation' })
    async createOneTime(@Body() dto: any, @Request() req) {
        const userId = req.user?.userId || null;
        return this.donationsService.createOneTimeDonation(userId, dto);
    }

    @Post('recurring')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create recurring donation' })
    createRecurring(@Body() dto: any, @Request() req) {
        return this.donationsService.createRecurringDonation(req.user.userId, dto);
    }

    @Post('complete/:paymentIntentId')
    @ApiOperation({ summary: 'Complete donation after payment' })
    completeDonation(@Param('paymentIntentId') paymentIntentId: string) {
        return this.donationsService.completeDonation(paymentIntentId);
    }

    @Get('my-donations')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get my donations' })
    getMyDonations(@Request() req) {
        return this.donationsService.getMyDonations(req.user.userId);
    }

    @Get('my-recurring')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get my recurring donations' })
    getMyRecurring(@Request() req) {
        return this.donationsService.getMyRecurringDonations(req.user.userId);
    }

    @Patch('recurring/:id/cancel')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cancel recurring donation' })
    cancelRecurring(@Param('id') id: string, @Request() req) {
        return this.donationsService.cancelRecurring(id, req.user.userId);
    }

    @Get('receipt/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get donation receipt' })
    getReceipt(@Param('id') id: string) {
        return this.donationsService.generateReceipt(id);
    }
}
