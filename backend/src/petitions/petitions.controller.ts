import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PetitionsService } from './petitions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('petitions')
@Controller('petitions')
export class PetitionsController {
    constructor(private petitionsService: PetitionsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create petition' })
    create(@Request() req, @Body() dto: any) {
        return this.petitionsService.create(req.user.userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all petitions' })
    findAll(@Query() filters: any) {
        return this.petitionsService.findAll(filters);
    }

    @Get('trending')
    @ApiOperation({ summary: 'Get trending petitions' })
    getTrending() {
        return this.petitionsService.getTrending();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get petition by ID' })
    findOne(@Param('id') id: string) {
        return this.petitionsService.findOne(id);
    }

    @Post(':id/sign')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Sign petition' })
    sign(@Param('id') id: string, @Request() req, @Body() dto: any) {
        return this.petitionsService.sign(id, req.user.userId, dto);
    }

    @Post(':id/updates')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add petition update' })
    addUpdate(@Param('id') id: string, @Request() req, @Body() dto: any) {
        return this.petitionsService.addUpdate(id, req.user.userId, dto);
    }
}
