import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampaignsService {
    constructor(private prisma: PrismaService) { }

    async create(nonprofitId: string, userId: string, dto: any) {
        // Verify user is admin of nonprofit
        const admin = await this.prisma.nonprofitAdmin.findFirst({
            where: { nonprofitId, userId },
        });

        if (!admin) {
            throw new ForbiddenException('Not authorized');
        }

        return this.prisma.campaign.create({
            data: {
                nonprofitId,
                ...dto,
                slug: this.generateSlug(dto.title),
            },
        });
    }

    async findAll(filters?: any) {
        const where: any = {};

        if (filters?.status) where.status = filters.status;
        if (filters?.category) where.category = filters.category;
        if (filters?.featured) where.featured = true;
        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.campaign.findMany({
            where,
            include: {
                nonprofit: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        verified: true,
                    },
                },
                _count: {
                    select: { donations: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id },
            include: {
                nonprofit: true,
                milestones: { orderBy: { amount: 'asc' } },
                updates: { orderBy: { createdAt: 'desc' } },
                donations: {
                    where: { status: 'COMPLETED', anonymous: false },
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: {
                                profile: {
                                    select: {
                                        firstName: true,
                                        displayName: true,
                                        avatar: true,
                                    },
                                },
                            },
                        },
                    },
                },
                _count: {
                    select: { donations: true },
                },
            },
        });

        if (!campaign) {
            throw new NotFoundException('Campaign not found');
        }

        // Increment view count
        await this.prisma.campaign.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });

        return campaign;
    }

    async update(id: string, userId: string, dto: any) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id },
        });

        if (!campaign) {
            throw new NotFoundException('Campaign not found');
        }

        const admin = await this.prisma.nonprofitAdmin.findFirst({
            where: { nonprofitId: campaign.nonprofitId, userId },
        });

        if (!admin) {
            throw new ForbiddenException('Not authorized');
        }

        return this.prisma.campaign.update({
            where: { id },
            data: dto,
        });
    }

    async addMilestone(campaignId: string, dto: any) {
        return this.prisma.campaignMilestone.create({
            data: {
                campaignId,
                ...dto,
            },
        });
    }

    async addUpdate(campaignId: string, dto: any) {
        return this.prisma.campaignUpdate.create({
            data: {
                campaignId,
                ...dto,
            },
        });
    }

    async getTrending() {
        return this.prisma.campaign.findMany({
            where: { status: 'ACTIVE' },
            orderBy: [
                { donorCount: 'desc' },
                { currentAmount: 'desc' },
            ],
            take: 10,
            include: {
                nonprofit: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        verified: true,
                    },
                },
            },
        });
    }

    async checkMilestones(campaignId: string) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id: campaignId },
            include: { milestones: true },
        });

        if (!campaign) return;

        for (const milestone of campaign.milestones) {
            if (!milestone.reached && campaign.currentAmount >= milestone.amount) {
                await this.prisma.campaignMilestone.update({
                    where: { id: milestone.id },
                    data: {
                        reached: true,
                        reachedAt: new Date(),
                    },
                });
            }
        }
    }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') + '-' + Date.now();
    }
}
