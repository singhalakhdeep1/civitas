import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class FOIAService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('foia') private foiaQueue: Queue,
  ) {}

  async submitFOIARequest(data: any) {
    const request = await this.prisma.fOIARequest.create({
      data: {
        requesterId: data.requesterId,
        description: data.description,
        status: 'RECEIVED',
        deadline: this.calculateDeadline(),
        fee: this.estimateFee(data.description),
      },
    });

    // Notify review team
    await this.foiaQueue.add('foia-review', { requestId: request.id });
    
    return request;
  }

  async getFOIARequestById(id: string) {
    const request = await this.prisma.fOIARequest.findUnique({
      where: { id },
      include: {
        requester: true,
        documents: true,
        responses: true,
      },
    });

    if (!request) {
      throw new NotFoundException('FOIA request not found');
    }

    return request;
  }

  async updateFOIAStatus(id: string, status: string, reviewerId: string) {
    const request = await this.prisma.fOIARequest.update({
      where: { id },
      data: {
        status.toUpperCase(),
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    });

    // Send notification to requester
    await this.notifyRequester(request.requesterId, status);

    return request;
  }

  async addDocumentToRequest(requestId: string, documentData: any) {
    const document = await this.prisma.fOIADocument.create({
      data: {
        requestId,
        url: documentData.url,
        name: documentData.name,
        isRedacted: documentData.isRedacted || false,
      },
    });

    return document;
  }

  async submitResponse(requestId: string, responseData: any) {
    const response = await this.prisma.fOIAResponse.create({
      data: {
        requestId,
        content: responseData.content,
        exemptions: responseData.exemptions || [],
        redactedDocuments: responseData.redactedDocuments || [],
        submittedBy: responseData.submittedBy,
      },
    });

    // Update request status
    await this.prisma.fOIARequest.update({
      where: { id: requestId },
      data: { status: 'COMPLETED' },
    });

    return response;
  }

  async submitAppeal(requestId: string, appealData: any) {
    const appeal = await this.prisma.fOIAAppeal.create({
      data: {
        requestId,
        reason: appealData.reason,
        submittedBy: appealData.submittedBy,
        status: 'PENDING',
      },
    });

    // Update request status
    await this.prisma.fOIARequest.update({
      where: { id: requestId },
      data: { status: 'APPEALED' },
    });

    return appeal;
  }

  private calculateDeadline(): Date {
    // FOIA requests typically have 20 business days to respond
    const deadline = new Date();
    let businessDays = 0;
    let days = 0;

    while (businessDays < 20) {
      deadline.setDate(deadline.getDate() + 1);
      const day = deadline.getDay();
      if (day !== 0 && day !== 6) {
        businessDays++;
      }
      days++;
    }

    return deadline;
  }

  private estimateFee(description: string): number {
    // Simple fee estimation based on description length
    const wordCount = description.split(' ').length;
    if (wordCount < 100) return 0;
    if (wordCount < 500) return 25;
    if (wordCount < 1000) return 50;
    return 100;
  }

  private async notifyRequester(requesterId: string, status: string) {
    console.log(`Notifying requester ${requesterId} about status: ${status}`);
  }

  async getPublicFOIALog() {
    return this.prisma.fOIARequest.findMany({
      where: {
        status: 'COMPLETED',
      },
      select: {
        id: true,
        description: true,
        status: true,
        submittedAt: true,
        completedAt: true,
      },
      orderBy: { submittedAt: 'desc' },
    });
  }
}
