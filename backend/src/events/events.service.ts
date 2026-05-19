import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) { }

    async create(nonprofitId: string, dto: any) {
        return this.prisma.event.create({
            data: {
                nonprofitId,
                ...dto,
                slug: this.generateSlug(dto.title),
            },
        });
    }

    async findAll(filters?: any) {
        const where: any = { published: true };

        if (filters?.type) where.type = filters.type;
        if (filters?.upcoming) {
            where.startDate = { gte: new Date() };
        }
        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.event.findMany({
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
                    select: {
                        registrations: true,
                        tickets: true,
                    },
                },
            },
            orderBy: { startDate: 'asc' },
        });
    }

    async findOne(id: string) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                nonprofit: true,
                tickets: { where: { available: { gt: 0 } } },
                _count: {
                    select: { registrations: true },
                },
            },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        return event;
    }

    async register(eventId: string, userId: string, dto: any) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: { tickets: true },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        if (event.maxAttendees) {
            const count = await this.prisma.eventRegistration.count({
                where: { eventId },
            });
            if (count >= event.maxAttendees) {
                throw new BadRequestException('Event is full');
            }
        }

        // Handle ticket purchase if applicable
        if (dto.ticketId) {
            const ticket = event.tickets.find(t => t.id === dto.ticketId);
            if (!ticket || ticket.available <= 0) {
                throw new BadRequestException('Ticket not available');
            }

            await this.prisma.eventTicket.update({
                where: { id: dto.ticketId },
                data: { available: { decrement: 1 } },
            });
        }

        return this.prisma.eventRegistration.create({
            data: {
                eventId,
                userId,
                ticketId: dto.ticketId,
                attendeeInfo: dto.attendeeInfo,
                status: 'REGISTERED',
            },
        });
    }

    async checkIn(registrationId: string) {
        return this.prisma.eventRegistration.update({
            where: { id: registrationId },
            data: {
                status: 'CHECKED_IN',
                checkedInAt: new Date(),
            },
        });
    }

    async getMyEvents(userId: string) {
        return this.prisma.eventRegistration.findMany({
            where: { userId },
            include: {
                event: {
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
                ticket: true,
            },
            orderBy: { event: { startDate: 'desc' } },
        });
    }

    async addTickets(eventId: string, tickets: any[]) {
        return this.prisma.eventTicket.createMany({
            data: tickets.map(ticket => ({
                eventId,
                ...ticket,
                available: ticket.quantity,
            })),
        });
    }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') + '-' + Date.now();
    }
}
