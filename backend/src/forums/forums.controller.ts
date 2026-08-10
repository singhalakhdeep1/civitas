import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ForumsService } from './forums.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('forums')
@Controller('forums')
export class ForumsController {
    constructor(private forumsService: ForumsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create forum' })
    createForum(@Body() dto: any) {
        return this.forumsService.createForum(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all forums' })
    getForums() {
        return this.forumsService.getForums();
    }

    @Post(':forumId/threads')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create thread' })
    createThread(@Param('forumId') forumId: string, @Request() req: { user: { userId: string } }, @Body() dto: any) {
        return this.forumsService.createThread(forumId, req.user.userId, dto);
    }

    @Get(':forumId/threads')
    @ApiOperation({ summary: 'Get threads' })
    getThreads(@Param('forumId') forumId: string, @Query() filters: any) {
        return this.forumsService.getThreads(forumId, filters);
    }

    @Get('threads/:id')
    @ApiOperation({ summary: 'Get thread' })
    getThread(@Param('id') id: string) {
        return this.forumsService.getThread(id);
    }

    @Post('threads/:threadId/posts')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create post' })
    createPost(@Param('threadId') threadId: string, @Request() req: { user: { userId: string } }, @Body() dto: any) {
        return this.forumsService.createPost(threadId, req.user.userId, dto);
    }

    @Post('posts/:postId/comments')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create comment' })
    createComment(@Param('postId') postId: string, @Request() req: { user: { userId: string } }, @Body() dto: any) {
        return this.forumsService.createComment(postId, req.user.userId, dto);
    }
}
