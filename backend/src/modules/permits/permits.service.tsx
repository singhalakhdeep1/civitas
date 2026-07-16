import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class PermitsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('permits') private permitsQueue: Queue,
  ) {}

  async createPermitApplication(data: any) {
    const permit = await this.prisma.permit.create({
      data: {
        type: data.type,
        applicantId: data.applicantId,
        status: 'PENDING_REVIEW',
        documents: data.documents,
        fee: this.calculateFee(data.type),
        propertyAddress: data.propertyAddress,
        description: data.description,
      },
    });

    // Trigger review workflow
    await this.permitsQueue.add('permit-review', { permitId: permit.id });
    
    return permit;
  }

  async getPermitById(id: string) {
    const permit = await this.prisma.permit.findUnique({
      where: { id },
      include: {
        applicant: true,
        reviews: true,
        inspections: true,
      },
    });

    if (!permit) {
      throw new NotFoundException('Permit not found');
    }

    return permit;
  }

  async updatePermitStatus(id: string, status: string, reviewerId: string) {
    const permit = await this.prisma.permit.update({
      where: { id },
      data: {
        status,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    });

    // Send notification to applicant
    await this.notifyApplicant(permit.applicantId, status);

    return permit;
  }

  async scheduleInspection(permitId: string, scheduledDate: Date) {
    const inspection = await this.prisma.inspection.create({
      data: {
        permitId,
        scheduledDate,
        status: 'SCHEDULED',
      },
    });

    return inspection;
  }

  private calculateFee(type: string): number {
    const feeStructure: Record<string, number> = {
      BUILDING: 500,
      BUSINESS: 250,
      EVENT: 100,
      ZONING: 300,
      ENVIRONMENTAL: 400,
      HEALTH: 150,
      CONSTRUCTION: 600,
    };

    return feeStructure[type] || 100;
  }

  private async notifyApplicant(applicantId: string, status: string) {
    // Implementation for notification service
    console.log(`Notifying applicant ${applicantId} about status: ${status}`);
  }

  async getPermitsByApplicant(applicantId: string) {
    return this.prisma.permit.findMany({
      where: { applicantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async renewPermit(permitId: string) {
    const existingPermit = await this.getPermitById(permitId);
    
    if (existingPermit.status !== 'APPROVED') {
      throw new BadRequestException('Can only renew approved permits');
    }

    const renewedPermit = await this.prisma.permit.create({
      data: {
        type: existingPermit.type,
        applicantId: existingPermit.applicantId,
        status: 'PENDING_REVIEW',
        documents: existingPermit.documents,
        fee: this.calculateFee(existingPermit.type),
        propertyAddress: existingPermit.propertyAddress,
        description: existingPermit.description,
        parentPermitId: permitId,
      },
    });

    return renewedPermit;
  }
}
