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
            where: where as any,
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
                tickets: true,
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

        if (dto.ticketId) {
            const ticket = event.tickets.find((t: any) => t.id === dto.ticketId);
            if (!ticket) {
                throw new BadRequestException('Ticket not available');
            }
        }

        return this.prisma.eventRegistration.create({
            data: {
                eventId,
                userId,
                ticketId: dto.ticketId,
                firstName: dto.firstName || 'Guest',
                lastName: dto.lastName || 'Guest',
                email: dto.email || 'guest@example.com',
                phone: dto.phone,
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
            },
            orderBy: { event: { startDate: 'desc' } },
        });
    }

    async addTickets(eventId: string, tickets: any[]) {
        return this.prisma.eventTicket.createMany({
            data: tickets.map((ticket: any) => ({
                eventId,
                ...ticket,
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
