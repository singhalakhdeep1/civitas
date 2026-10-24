import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    private async checkAdminRole(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || user.role !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Admin access required');
        }
    }

    async verifyNonprofit(userId: string, nonprofitId: string, dto: any) {
        await this.checkAdminRole(userId);

        return this.prisma.nonprofit.update({
            where: { id: nonprofitId },
            data: {
                verified: dto.verified,
                verifiedAt: dto.verified ? new Date() : null,
            },
        });
    }

    async getAllUsers(userId: string, filters?: any) {
        await this.checkAdminRole(userId);

        const where: any = {};
        if (filters?.role) where.role = filters.role;
        if (filters?.search) {
            where.OR = [
                { email: { contains: filters.search, mode: 'insensitive' } },
                { profile: { firstName: { contains: filters.search, mode: 'insensitive' } } },
                { profile: { lastName: { contains: filters.search, mode: 'insensitive' } } },
            ];
        }

        return this.prisma.user.findMany({
            where,
            include: { profile: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateUserRole(userId: string, targetUserId: string, role: string) {
        await this.checkAdminRole(userId);

        return this.prisma.user.update({
            where: { id: targetUserId },
            data: { role: role as any },
        });
    }

    async getPendingVerifications(userId: string) {
        await this.checkAdminRole(userId);

        return this.prisma.nonprofit.findMany({
            where: {
                verified: false,
                taxExemptDoc: { not: null },
            },
            include: {
                admins: {
                    include: {
                        user: {
                            include: { profile: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getPlatformStats(userId: string) {
        await this.checkAdminRole(userId);

        const users = await this.prisma.user.count();
        const nonprofits = await this.prisma.nonprofit.count();
        const campaigns = await this.prisma.campaign.count();

        const donations = await this.prisma.donation.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true, platformFee: true },
            _count: true,
        });

        const recentActivity = await this.prisma.donation.findMany({
            where: { status: 'COMPLETED' },
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
                campaign: {
                    select: {
                        title: true,
                    },
                },
            },
        });

        return {
            users,
            nonprofits,
            campaigns,
            totalDonations: donations._sum.amount || 0,
            donationCount: donations._count,
            platformRevenue: donations._sum.platformFee || 0,
            recentActivity,
        };
    }

    async moderateContent(userId: string, contentType: string, contentId: string, action: string) {
        await this.checkAdminRole(userId);

        switch (contentType) {
            case 'petition':
                return this.prisma.petition.update({
                    where: { id: contentId },
                    data: { status: action === 'approve' ? 'ACTIVE' : 'CLOSED' },
                });
            case 'thread':
                if (action === 'delete') {
                    return this.prisma.forumThread.delete({ where: { id: contentId } });
                }
                return this.prisma.forumThread.update({
                    where: { id: contentId },
                    data: { locked: true },
                });
            case 'post':
                if (action === 'delete') {
                    return this.prisma.forumPost.delete({ where: { id: contentId } });
                }
                return this.prisma.forumPost.update({
                    where: { id: contentId },
                    data: { edited: true },
                });
            default:
                throw new ForbiddenException('Invalid content type');
        }
    }
}
