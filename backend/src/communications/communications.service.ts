import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as sgMail from '@sendgrid/mail';
import twilio from 'twilio';

@Injectable()
export class CommunicationsService {
    private twilioClient: any;

    constructor(private prisma: PrismaService) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            this.twilioClient = (twilio as any)(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );
        }
    }

    async sendEmail(dto: any) {
        try {
            const msg = {
                to: dto.to,
                from: process.env.SENDGRID_FROM_EMAIL || 'noreply@civicplatform.org',
                subject: dto.subject,
                text: dto.text,
                html: dto.html,
            };

            await sgMail.send(msg);

            // Create notification record
            await this.prisma.notification.create({
                data: {
                    userId: dto.userId,
                    type: 'EMAIL',
                    title: dto.subject,
                    message: dto.text,
                    read: false,
                },
            });

            return { success: true };
        } catch (error) {
            console.error('Email send error:', error);
            return { success: false, error };
        }
    }

    async sendSMS(dto: any) {
        if (!this.twilioClient) {
            return { success: false, error: 'Twilio not configured' };
        }

        try {
            await this.twilioClient.messages.create({
                body: dto.message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: dto.to,
            });

            // Create notification record
            await this.prisma.notification.create({
                data: {
                    userId: dto.userId,
                    type: 'SMS',
                    title: 'SMS Notification',
                    message: dto.message,
                    read: false,
                },
            });

            return { success: true };
        } catch (error) {
            console.error('SMS send error:', error);
            return { success: false, error };
        }
    }

    async createEmailCampaign(nonprofitId: string, dto: any) {
        return this.prisma.emailCampaign.create({
            data: {
                nonprofitId,
                ...dto,
            },
        });
    }

    async getNotifications(userId: string, filters?: any) {
        const where: any = { userId };

        if (filters?.unread) {
            where.read = false;
        }

        return this.prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async markAsRead(userId: string, notificationId: string) {
        return this.prisma.notification.updateMany({
            where: { id: notificationId, userId },
            data: { read: true },
        });
    }

    async updatePreferences(userId: string, dto: any) {
        return this.prisma.communicationPreference.upsert({
            where: { userId },
            update: dto,
            create: { userId, ...dto },
        });
    }

    async getPreferences(userId: string) {
        return this.prisma.communicationPreference.findUnique({
            where: { userId },
        });
    }
}
