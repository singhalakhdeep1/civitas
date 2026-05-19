import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImpactService {
    constructor(private prisma: PrismaService) { }

    async createMetric(nonprofitId: string, dto: any) {
        return this.prisma.impactMetric.create({
            data: {
                nonprofitId,
                ...dto,
            },
        });
    }

    async createStory(nonprofitId: string, dto: any) {
        return this.prisma.impactStory.create({
            data: {
                nonprofitId,
                ...dto,
            },
        });
    }

    async getNonprofitImpact(nonprofitId: string) {
        const metrics = await this.prisma.impactMetric.findMany({
            where: { nonprofitId },
            orderBy: { createdAt: 'desc' },
        });

        const stories = await this.prisma.impactStory.findMany({
            where: { nonprofitId, published: true },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });

        const financials = await this.prisma.financialReport.findMany({
            where: { nonprofitId },
            orderBy: { year: 'desc' },
        });

        return { metrics, stories, financials };
    }

    async getStories(filters?: any) {
        const where: any = { published: true };

        if (filters?.category) where.category = filters.category;

        return this.prisma.impactStory.findMany({
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
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async createFinancialReport(nonprofitId: string, dto: any) {
        return this.prisma.financialReport.create({
            data: {
                nonprofitId,
                ...dto,
            },
        });
    }
}
