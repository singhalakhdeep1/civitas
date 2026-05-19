import { Controller, Post, Body, Get, UseGuards, Request, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    async register(@Body() dto: any) {
        return this.authService.register(dto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    async login(@Body() dto: { email: string; password: string }) {
        return this.authService.login(dto.email, dto.password);
    }

    @Post('verify-email')
    @ApiOperation({ summary: 'Verify email with token' })
    async verifyEmail(@Body() dto: { token: string }) {
        return this.authService.verifyEmail(dto.token);
    }

    @Post('forgot-password')
    @ApiOperation({ summary: 'Request password reset' })
    async forgotPassword(@Body() dto: { email: string }) {
        return this.authService.requestPasswordReset(dto.email);
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Reset password with token' })
    async resetPassword(@Body() dto: { token: string; newPassword: string }) {
        return this.authService.resetPassword(dto.token, dto.newPassword);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    async refresh(@Body() dto: { refreshToken: string }) {
        return this.authService.refreshTokens(dto.refreshToken);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    async getProfile(@Request() req) {
        return this.authService.getProfile(req.user.userId);
    }

    @Patch('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user profile' })
    async updateProfile(@Request() req, @Body() dto: any) {
        return this.authService.updateProfile(req.user.userId, dto);
    }
}
