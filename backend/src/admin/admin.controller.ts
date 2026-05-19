import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Get('users')
    @ApiOperation({ summary: 'Get all users' })
    getAllUsers(@Request() req, @Query() filters: any) {
        return this.adminService.getAllUsers(req.user.userId, filters);
    }

    @Patch('users/:id/role')
    @ApiOperation({ summary: 'Update user role' })
    updateUserRole(@Request() req, @Param('id') id: string, @Body() dto: any) {
        return this.adminService.updateUserRole(req.user.userId, id, dto.role);
    }

    @Get('verifications/pending')
    @ApiOperation({ summary: 'Get pending verifications' })
    getPendingVerifications(@Request() req) {
        return this.adminService.getPendingVerifications(req.user.userId);
    }

    @Patch('nonprofits/:id/verify')
    @ApiOperation({ summary: 'Verify nonprofit' })
    verifyNonprofit(@Request() req, @Param('id') id: string, @Body() dto: any) {
        return this.adminService.verifyNonprofit(req.user.userId, id, dto);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get platform stats' })
    getPlatformStats(@Request() req) {
        return this.adminService.getPlatformStats(req.user.userId);
    }

    @Post('moderate')
    @ApiOperation({ summary: 'Moderate content' })
    moderateContent(@Request() req, @Body() dto: any) {
        return this.adminService.moderateContent(
            req.user.userId,
            dto.contentType,
            dto.contentId,
            dto.action,
        );
    }
}
