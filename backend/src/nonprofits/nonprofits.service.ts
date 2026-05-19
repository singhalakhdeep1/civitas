import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NonprofitsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: any) {
        const nonprofit = await this.prisma.nonprofit.create({
            data: {
                ...dto,
                slug: this.generateSlug(dto.name),
                admins: {
                    create: {
                        userId,
                        isOwner: true,
                        permissions: ['ALL'],
                    },
                },
            },
            include: {
                admins: { include: { user: { include: { profile: true } } } },
            },
        });

        return nonprofit;
    }

    async findAll(filters?: any) {
        const where: any = { status: 'ACTIVE' };

        if (filters?.verified) where.verified = true;
        if (filters?.type) where.type = filters.type;
        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.nonprofit.findMany({
            where,
            include: {
                _count: {
                    select: {
                        campaigns: true,
                        events: true,
                        volunteerOpps: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const nonprofit = await this.prisma.nonprofit.findUnique({
            where: { id },
            include: {
                admins: { include: { user: { include: { profile: true } } } },
                teamMembers: true,
                categories: true,
                socialMedia: true,
                campaigns: { take: 5, where: { status: 'ACTIVE' } },
                events: { take: 5, where: { status: 'PUBLISHED' } },
                reviews: { take: 10, orderBy: { createdAt: 'desc' } },
                _count: {
                    select: {
                        campaigns: true,
                        events: true,
                        volunteerOpps: true,
                    },
                },
            },
        });

        if (!nonprofit) {
            throw new NotFoundException('Nonprofit not found');
        }

        return nonprofit;
    }

    async update(id: string, userId: string, dto: any) {
        await this.checkPermission(id, userId);

        return this.prisma.nonprofit.update({
            where: { id },
            data: dto,
        });
    }

    async delete(id: string, userId: string) {
        await this.checkPermission(id, userId);

        return this.prisma.nonprofit.update({
            where: { id },
            data: { status: 'DELETED' },
        });
    }

    async requestVerification(id: string, userId: string, documents: any) {
        await this.checkPermission(id, userId);

        return this.prisma.nonprofit.update({
            where: { id },
            data: {
                verificationStatus: 'PENDING',
                taxExemptDoc: documents.taxExemptDoc,
            },
        });
    }

    async addTeamMember(nonprofitId: string, userId: string, dto: any) {
        await this.checkPermission(nonprofitId, userId);

        return this.prisma.teamMember.create({
            data: {
                nonprofitId,
                ...dto,
            },
        });
    }

    async getCampaigns(id: string) {
        return this.prisma.campaign.findMany({
            where: { nonprofitId: id },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getEvents(id: string) {
        return this.prisma.event.findMany({
            where: { nonprofitId: id },
            orderBy: { startDate: 'desc' },
        });
    }

    async addReview(nonprofitId: string, userId: string, dto: any) {
        const review = await this.prisma.nonprofitReview.create({
            data: {
                nonprofitId,
                userId,
                ...dto,
            },
        });

        // Update average rating
        const reviews = await this.prisma.nonprofitReview.findMany({
            where: { nonprofitId },
        });

        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await this.prisma.nonprofit.update({
            where: { id: nonprofitId },
            data: {
                avgRating,
                reviewCount: reviews.length,
            },
        });

        return review;
    }

    private async checkPermission(nonprofitId: string, userId: string) {
        const admin = await this.prisma.nonprofitAdmin.findFirst({
            where: { nonprofitId, userId },
        });

        if (!admin) {
            throw new ForbiddenException('You do not have permission to manage this nonprofit');
        }

        return admin;
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') + '-' + Date.now();
    }
}
