import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VolunteeringService {
    constructor(private prisma: PrismaService) { }

    async createProfile(userId: string, dto: any) {
        return this.prisma.volunteerProfile.upsert({
            where: { userId },
            update: dto,
            create: { userId, ...dto },
        });
    }

    async createOpportunity(nonprofitId: string, dto: any) {
        return this.prisma.volunteerOpportunity.create({
            data: {
                nonprofitId,
                ...dto,
            },
        });
    }

    async findOpportunities(filters?: any) {
        const where: any = { published: true };

        if (filters?.skills) {
            where.requiredSkills = {
                hasSome: Array.isArray(filters.skills) ? filters.skills : [filters.skills],
            };
        }

        if (filters?.remote !== undefined) {
            where.remote = filters.remote === 'true';
        }

        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.volunteerOpportunity.findMany({
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
                    select: { applications: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async apply(opportunityId: string, userId: string, dto: any) {
        const existing = await this.prisma.volunteerApplication.findFirst({
            where: { opportunityId, userId },
        });

        if (existing) {
            throw new BadRequestException('Already applied');
        }

        return this.prisma.volunteerApplication.create({
            data: {
                opportunityId,
                userId,
                ...dto,
            },
        });
    }

    async updateApplicationStatus(id: string, status: string, dto?: any) {
        return this.prisma.volunteerApplication.update({
            where: { id },
            data: {
                status,
                ...dto,
            },
        });
    }

    async logHours(applicationId: string, dto: any) {
        const application = await this.prisma.volunteerApplication.findUnique({
            where: { id: applicationId },
        });

        if (!application || application.status !== 'APPROVED') {
            throw new BadRequestException('Invalid application');
        }

        return this.prisma.volunteerHours.create({
            data: {
                applicationId,
                ...dto,
            },
        });
    }

    async generateCertificate(userId: string, nonprofitId: string) {
        const totalHours = await this.prisma.volunteerHours.aggregate({
            where: {
                application: {
                    userId,
                    opportunity: { nonprofitId },
                },
                verified: true,
            },
            _sum: { hours: true },
        });

        if (!totalHours._sum.hours || totalHours._sum.hours < 10) {
            throw new BadRequestException('Minimum 10 hours required');
        }

        return this.prisma.volunteerCertificate.create({
            data: {
                userId,
                nonprofitId,
                totalHours: totalHours._sum.hours,
                certificateNumber: `CERT-${Date.now()}-${userId.slice(0, 8)}`,
            },
        });
    }

    async getMyApplications(userId: string) {
        return this.prisma.volunteerApplication.findMany({
            where: { userId },
            include: {
                opportunity: {
                    include: {
                        nonprofit: {
                            select: {
                                id: true,
                                name: true,
                                logo: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getMyHours(userId: string) {
        const hours = await this.prisma.volunteerHours.findMany({
            where: {
                application: { userId },
                verified: true,
            },
            include: {
                application: {
                    include: {
                        opportunity: {
                            include: {
                                nonprofit: {
                                    select: {
                                        id: true,
                                        name: true,
                                        logo: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { date: 'desc' },
        });

        const total = await this.prisma.volunteerHours.aggregate({
            where: {
                application: { userId },
                verified: true,
            },
            _sum: { hours: true },
        });

        return {
            hours,
            totalHours: total._sum.hours || 0,
        };
    }
}
