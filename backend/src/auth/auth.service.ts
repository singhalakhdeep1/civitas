import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: UserRole;
    }) {
        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 12);

        // Create user and profile
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                role: dto.role,
                profile: {
                    create: {
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                        displayName: `${dto.firstName} ${dto.lastName}`,
                    },
                },
            },
            include: {
                profile: true,
            },
        });

        // Generate verification token
        const token = randomBytes(32).toString('hex');
        await this.prisma.verificationToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            },
        });

        // TODO: Send verification email

        return {
            message: 'Registration successful. Please check your email to verify your account.',
            user: this.sanitizeUser(user),
        };
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                profile: true,
                nonprofitAdmin: {
                    include: {
                        nonprofit: true,
                    },
                },
            },
        });

        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.status === 'SUSPENDED') {
            throw new UnauthorizedException('Account suspended');
        }

        if (!user.emailVerified) {
            throw new UnauthorizedException('Please verify your email first');
        }

        // Update last login
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                lastLoginAt: new Date(),
            },
        });

        const tokens = await this.generateTokens(user);

        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }

    async verifyEmail(token: string) {
        const verificationToken = await this.prisma.verificationToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!verificationToken || verificationToken.used) {
            throw new BadRequestException('Invalid or expired token');
        }

        if (verificationToken.expiresAt < new Date()) {
            throw new BadRequestException('Token expired');
        }

        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: verificationToken.userId },
                data: {
                    emailVerified: true,
                    emailVerifiedAt: new Date(),
                    status: 'ACTIVE',
                },
            }),
            this.prisma.verificationToken.update({
                where: { id: verificationToken.id },
                data: { used: true },
            }),
        ]);

        return { message: 'Email verified successfully' };
    }

    async requestPasswordReset(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Don't reveal if user exists
            return { message: 'If the email exists, a reset link has been sent' };
        }

        const token = randomBytes(32).toString('hex');
        await this.prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            },
        });

        // TODO: Send password reset email

        return { message: 'If the email exists, a reset link has been sent' };
    }

    async resetPassword(token: string, newPassword: string) {
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { token },
        });

        if (!resetToken || resetToken.used) {
            throw new BadRequestException('Invalid or expired token');
        }

        if (resetToken.expiresAt < new Date()) {
            throw new BadRequestException('Token expired');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword },
            }),
            this.prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { used: true },
            }),
        ]);

        return { message: 'Password reset successful' };
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                include: { profile: true },
            });

            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            return this.generateTokens(user);
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                nonprofitAdmin: {
                    include: {
                        nonprofit: true,
                    },
                },
            },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        return this.sanitizeUser(user);
    }

    async updateProfile(userId: string, dto: any) {
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: {
                profile: {
                    update: dto,
                },
            },
            include: {
                profile: true,
            },
        });

        return this.sanitizeUser(updated);
    }

    private async generateTokens(user: User) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            }),
        ]);

        // Store refresh token
        await this.prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        return { accessToken, refreshToken };
    }

    private sanitizeUser(user: any) {
        const { password, ...sanitized } = user;
        return sanitized;
    }

    // OAuth methods
    async validateGoogleUser(profile: any) {
        let user = await this.prisma.user.findUnique({
            where: { googleId: profile.id },
            include: { profile: true },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    emailVerified: true,
                    status: 'ACTIVE',
                    role: 'DONOR',
                    profile: {
                        create: {
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            displayName: profile.displayName,
                            avatar: profile.photos[0]?.value,
                        },
                    },
                },
                include: { profile: true },
            });
        }

        return user;
    }

    async validateFacebookUser(profile: any) {
        let user = await this.prisma.user.findUnique({
            where: { facebookId: profile.id },
            include: { profile: true },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: profile.emails[0].value,
                    facebookId: profile.id,
                    emailVerified: true,
                    status: 'ACTIVE',
                    role: 'DONOR',
                    profile: {
                        create: {
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            displayName: profile.displayName,
                            avatar: profile.photos[0]?.value,
                        },
                    },
                },
                include: { profile: true },
            });
        }

        return user;
    }
}
