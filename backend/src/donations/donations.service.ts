import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { CampaignsService } from '../campaigns/campaigns.service';

@Injectable()
export class DonationsService {
    private stripe: Stripe;

    constructor(
        private prisma: PrismaService,
        private campaignsService: CampaignsService,
    ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2023-10-16',
        });
    }

    async createOneTimeDonation(userId: string | null, dto: any) {
        try {
            // Create Stripe payment intent
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(dto.amount * 100), // Convert to cents
                currency: dto.currency || 'usd',
                metadata: {
                    campaignId: dto.campaignId || '',
                    nonprofitId: dto.nonprofitId,
                    userId: userId || 'anonymous',
                },
            });

            // Calculate fees
            const platformFee = dto.amount * 0.02; // 2% platform fee
            const processingFee = dto.amount * 0.029 + 0.30; // Stripe fees
            const netAmount = dto.amount - platformFee - processingFee;

            // Create donation record
            const donation = await this.prisma.donation.create({
                data: {
                    userId,
                    campaignId: dto.campaignId,
                    nonprofitId: dto.nonprofitId,
                    amount: dto.amount,
                    currency: dto.currency || 'USD',
                    frequency: 'ONE_TIME',
                    stripePaymentId: paymentIntent.id,
                    paymentMethod: dto.paymentMethod,
                    status: 'PENDING',
                    anonymous: dto.anonymous || false,
                    dedicatedTo: dto.dedicatedTo,
                    dedicationMessage: dto.dedicationMessage,
                    message: dto.message,
                    platformFee,
                    processingFee,
                    netAmount,
                },
            });

            return {
                donation,
                clientSecret: paymentIntent.client_secret,
            };
        } catch (error) {
            throw new BadRequestException('Failed to create donation');
        }
    }

    async createRecurringDonation(userId: string, dto: any) {
        try {
            // Create Stripe customer
            const customer = await this.stripe.customers.create({
                email: dto.email,
                metadata: {
                    userId,
                },
            });

            // Create Stripe subscription
            const subscription = await this.stripe.subscriptions.create({
                customer: customer.id,
                items: [{
                    price_data: {
                        currency: dto.currency || 'usd',
                        unit_amount: Math.round(dto.amount * 100),
                        recurring: {
                            interval: dto.frequency === 'MONTHLY' ? 'month' :
                                dto.frequency === 'QUARTERLY' ? 'month' : 'year',
                            interval_count: dto.frequency === 'QUARTERLY' ? 3 : 1,
                        },
                        product_data: {
                            name: `Recurring donation to ${dto.nonprofitId}`,
                        },
                    },
                }],
                metadata: {
                    userId,
                    nonprofitId: dto.nonprofitId,
                    campaignId: dto.campaignId || '',
                },
            });

            // Create recurring donation record
            const recurring = await this.prisma.recurringDonation.create({
                data: {
                    userId,
                    nonprofitId: dto.nonprofitId,
                    campaignId: dto.campaignId,
                    amount: dto.amount,
                    currency: dto.currency || 'USD',
                    frequency: dto.frequency,
                    stripeSubscriptionId: subscription.id,
                    stripeCustomerId: customer.id,
                    active: true,
                    nextBillingDate: new Date(subscription.current_period_end * 1000),
                },
            });

            return recurring;
        } catch (error) {
            throw new BadRequestException('Failed to create recurring donation');
        }
    }

    async completeDonation(paymentIntentId: string) {
        const donation = await this.prisma.donation.findFirst({
            where: { stripePaymentId: paymentIntentId },
        });

        if (!donation) {
            throw new BadRequestException('Donation not found');
        }

        // Update donation status
        await this.prisma.donation.update({
            where: { id: donation.id },
            data: { status: 'COMPLETED' },
        });

        // Update campaign totals
        if (donation.campaignId) {
            await this.prisma.campaign.update({
                where: { id: donation.campaignId },
                data: {
                    currentAmount: { increment: donation.amount },
                    donorCount: { increment: 1 },
                },
            });

            // Check milestones
            await this.campaignsService.checkMilestones(donation.campaignId);
        }

        // Update nonprofit totals
        await this.prisma.nonprofit.update({
            where: { id: donation.nonprofitId },
            data: {
                totalDonations: { increment: donation.amount },
                donorCount: { increment: 1 },
            },
        });

        // Generate receipt
        await this.generateReceipt(donation.id);

        return donation;
    }

    async generateReceipt(donationId: string) {
        const donation = await this.prisma.donation.findUnique({
            where: { id: donationId },
            include: {
                user: { include: { profile: true } },
                nonprofit: true,
                campaign: true,
            },
        });

        if (!donation) return;

        const receiptNumber = `R-${Date.now()}-${donationId.slice(0, 8)}`;

        await this.prisma.donation.update({
            where: { id: donationId },
            data: {
                taxReceiptIssued: true,
                receiptNumber,
            },
        });

        // TODO: Send receipt email

        return { receiptNumber };
    }

    async getMyDonations(userId: string) {
        return this.prisma.donation.findMany({
            where: { userId, status: 'COMPLETED' },
            include: {
                nonprofit: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                    },
                },
                campaign: {
                    select: {
                        id: true,
                        title: true,
                        coverImage: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getMyRecurringDonations(userId: string) {
        return this.prisma.recurringDonation.findMany({
            where: { userId, active: true },
            include: {
                nonprofit: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async cancelRecurring(id: string, userId: string) {
        const recurring = await this.prisma.recurringDonation.findUnique({
            where: { id },
        });

        if (!recurring || recurring.userId !== userId) {
            throw new BadRequestException('Recurring donation not found');
        }

        // Cancel Stripe subscription
        if (recurring.stripeSubscriptionId) {
            await this.stripe.subscriptions.cancel(recurring.stripeSubscriptionId);
        }

        // Update record
        return this.prisma.recurringDonation.update({
            where: { id },
            data: {
                active: false,
                cancelledAt: new Date(),
            },
        });
    }
}
