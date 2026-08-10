import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('events')
@Controller('events')
export class EventsController {
    constructor(private eventsService: EventsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create event' })
    create(@Body() dto: any) {
        return this.eventsService.create(dto.nonprofitId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all events' })
    findAll(@Query() filters: any) {
        return this.eventsService.findAll(filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event by ID' })
    findOne(@Param('id') id: string) {
        return this.eventsService.findOne(id);
    }

    @Post(':id/register')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Register for event' })
    register(@Param('id') id: string, @Request() req: { user: { userId: string } }, @Body() dto: any) {
        return this.eventsService.register(id, req.user.userId, dto);
    }

    @Post(':id/check-in/:registrationId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Check in attendee' })
    checkIn(@Param('registrationId') registrationId: string) {
        return this.eventsService.checkIn(registrationId);
    }

    @Get('my/registrations')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get my events' })
    getMyEvents(@Request() req: { user: { userId: string } }) {
        return this.eventsService.getMyEvents(req.user.userId);
    }

    @Post(':id/tickets')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add tickets' })
    addTickets(@Param('id') id: string, @Body() dto: any) {
        return this.eventsService.addTickets(id, dto.tickets);
    }
}
