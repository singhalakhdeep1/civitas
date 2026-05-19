import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getDonorAnalytics(userId: string) {
        const totalDonated = await this.prisma.donation.aggregate({
            where: { userId, status: 'COMPLETED' },
            _sum: { amount: true },
            _count: true,
        });

        const nonprofitsSupported = await this.prisma.donation.groupBy({
            by: ['nonprofitId'],
            where: { userId, status: 'COMPLETED' },
        });

        const recentDonations = await this.prisma.donation.findMany({
            where: { userId, status: 'COMPLETED' },
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                nonprofit: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                    },
                },
            },
        });

        return {
            totalDonated: totalDonated._sum.amount || 0,
            totalDonations: totalDonated._count,
            nonprofitsSupported: nonprofitsSupported.length,
            recentDonations,
        };
    }

    async getCampaignAnalytics(campaignId: string) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id: campaignId },
            include: {
                donations: {
                    where: { status: 'COMPLETED' },
                },
            },
        });

        if (!campaign) return null;

        const donationsByDay = await this.prisma.$queryRaw`
      SELECT DATE(created_at) as date, SUM(amount) as amount, COUNT(*) as count
      FROM "Donation"
      WHERE campaign_id = ${campaignId} AND status = 'COMPLETED'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `;

        const topDonors = await this.prisma.donation.groupBy({
            by: ['userId'],
            where: { campaignId, status: 'COMPLETED', anonymous: false },
            _sum: { amount: true },
            orderBy: { _sum: { amount: 'desc' } },
            take: 10,
        });

        return {
            totalRaised: campaign.currentAmount,
            goalPercentage: (campaign.currentAmount / campaign.goalAmount) * 100,
            totalDonors: campaign.donorCount,
            averageDonation: campaign.donations.length > 0
                ? campaign.currentAmount / campaign.donations.length
                : 0,
            donationsByDay,
            topDonors,
        };
    }

    async getNonprofitAnalytics(nonprofitId: string) {
        const nonprofit = await this.prisma.nonprofit.findUnique({
            where: { id: nonprofitId },
        });

        if (!nonprofit) return null;

        const campaignStats = await this.prisma.campaign.aggregate({
            where: { nonprofitId },
            _count: true,
            _sum: { currentAmount: true },
        });

        const volunteerStats = await this.prisma.volunteerHours.aggregate({
            where: {
                application: {
                    opportunity: { nonprofitId },
                },
                verified: true,
            },
            _sum: { hours: true },
            _count: true,
        });

        const eventStats = await this.prisma.eventRegistration.aggregate({
            where: {
                event: { nonprofitId },
            },
            _count: true,
        });

        const monthlyDonations = await this.prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(amount) as amount,
        COUNT(*) as count
      FROM "Donation"
      WHERE nonprofit_id = ${nonprofitId} AND status = 'COMPLETED'
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `;

        return {
            totalDonations: nonprofit.totalDonations,
            totalDonors: nonprofit.donorCount,
            activeCampaigns: campaignStats._count,
            totalRaised: campaignStats._sum.currentAmount || 0,
            volunteerHours: volunteerStats._sum.hours || 0,
            totalVolunteers: volunteerStats._count,
            eventAttendees: eventStats._count,
            monthlyDonations,
        };
    }

    async getPlatformStats() {
        const nonprofits = await this.prisma.nonprofit.count();
        const verifiedNonprofits = await this.prisma.nonprofit.count({
            where: { verified: true },
        });

        const campaigns = await this.prisma.campaign.count();
        const activeCampaigns = await this.prisma.campaign.count({
            where: { status: 'ACTIVE' },
        });

        const totalDonations = await this.prisma.donation.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true },
            _count: true,
        });

        const volunteers = await this.prisma.volunteerProfile.count();
        const volunteerHours = await this.prisma.volunteerHours.aggregate({
            where: { verified: true },
            _sum: { hours: true },
        });

        const petitions = await this.prisma.petition.count();
        const petitionSignatures = await this.prisma.petitionSignature.count();

        return {
            nonprofits,
            verifiedNonprofits,
            campaigns,
            activeCampaigns,
            totalDonations: totalDonations._sum.amount || 0,
            donationCount: totalDonations._count,
            volunteers,
            volunteerHours: volunteerHours._sum.hours || 0,
            petitions,
            petitionSignatures,
        };
    }
}
