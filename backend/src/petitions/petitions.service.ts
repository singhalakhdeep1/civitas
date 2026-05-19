import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PetitionsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: any) {
        return this.prisma.petition.create({
            data: {
                creatorId: userId,
                ...dto,
                slug: this.generateSlug(dto.title),
            },
        });
    }

    async findAll(filters?: any) {
        const where: any = { status: 'ACTIVE' };

        if (filters?.category) where.category = filters.category;
        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.petition.findMany({
            where,
            include: {
                creator: {
                    select: {
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                                displayName: true,
                                avatar: true,
                            },
                        },
                    },
                },
                _count: {
                    select: { signatures: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const petition = await this.prisma.petition.findUnique({
            where: { id },
            include: {
                creator: {
                    select: {
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                                displayName: true,
                                avatar: true,
                            },
                        },
                    },
                },
                updates: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                signatures: {
                    where: { anonymous: false },
                    orderBy: { createdAt: 'desc' },
                    take: 20,
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
                    select: { signatures: true },
                },
            },
        });

        if (!petition) {
            throw new NotFoundException('Petition not found');
        }

        // Increment view count
        await this.prisma.petition.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });

        return petition;
    }

    async sign(petitionId: string, userId: string, dto: any) {
        const petition = await this.prisma.petition.findUnique({
            where: { id: petitionId },
        });

        if (!petition || petition.status !== 'ACTIVE') {
            throw new BadRequestException('Petition not available for signing');
        }

        const existing = await this.prisma.petitionSignature.findFirst({
            where: { petitionId, userId },
        });

        if (existing) {
            throw new BadRequestException('Already signed');
        }

        const signature = await this.prisma.petitionSignature.create({
            data: {
                petitionId,
                userId,
                ...dto,
            },
        });

        // Update petition signature count
        await this.prisma.petition.update({
            where: { id: petitionId },
            data: {
                currentSignatures: { increment: 1 },
            },
        });

        // Check if target reached
        if (petition.targetSignatures &&
            petition.currentSignatures + 1 >= petition.targetSignatures) {
            await this.prisma.petition.update({
                where: { id: petitionId },
                data: { status: 'SUCCESSFUL' },
            });
        }

        return signature;
    }

    async addUpdate(petitionId: string, userId: string, dto: any) {
        const petition = await this.prisma.petition.findUnique({
            where: { id: petitionId },
        });

        if (!petition || petition.creatorId !== userId) {
            throw new BadRequestException('Not authorized');
        }

        return this.prisma.petitionUpdate.create({
            data: {
                petitionId,
                ...dto,
            },
        });
    }

    async getTrending() {
        return this.prisma.petition.findMany({
            where: { status: 'ACTIVE' },
            orderBy: [
                { currentSignatures: 'desc' },
                { viewCount: 'desc' },
            ],
            take: 10,
            include: {
                creator: {
                    select: {
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                },
                _count: {
                    select: { signatures: true },
                },
            },
        });
    }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') + '-' + Date.now();
    }
}
