import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ForumsService {
    constructor(private prisma: PrismaService) { }

    async createForum(dto: any) {
        return this.prisma.forum.create({
            data: {
                ...dto,
                slug: this.generateSlug(dto.name),
            },
        });
    }

    async getForums() {
        return this.prisma.forum.findMany({
            where: { active: true },
            include: {
                _count: {
                    select: {
                        threads: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
    }

    async createThread(forumId: string, userId: string, dto: any) {
        return this.prisma.forumThread.create({
            data: {
                forumId,
                authorId: userId,
                ...dto,
            },
        });
    }

    async getThreads(forumId: string, filters?: any) {
        const where: any = { forumId };

        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { content: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.forumThread.findMany({
            where,
            include: {
                author: {
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
                _count: {
                    select: { posts: true },
                },
            },
            orderBy: filters?.sort === 'popular'
                ? { viewCount: 'desc' }
                : { createdAt: 'desc' },
        });
    }

    async getThread(id: string) {
        const thread = await this.prisma.forumThread.findUnique({
            where: { id },
            include: {
                author: {
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
                posts: {
                    include: {
                        author: {
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
                        comments: {
                            include: {
                                author: {
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
                            orderBy: { createdAt: 'asc' },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!thread) {
            throw new NotFoundException('Thread not found');
        }

        // Increment view count
        await this.prisma.forumThread.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });

        return thread;
    }

    async createPost(threadId: string, userId: string, dto: any) {
        return this.prisma.forumPost.create({
            data: {
                threadId,
                authorId: userId,
                ...dto,
            },
        });
    }

    async createComment(postId: string, userId: string, dto: any) {
        return this.prisma.forumComment.create({
            data: {
                postId,
                authorId: userId,
                ...dto,
            },
        });
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
}
