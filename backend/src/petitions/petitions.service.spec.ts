import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PetitionsService } from './petitions.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Unit tests for PetitionsService using a mocked PrismaService.
 * Covers:
 *  - sign(): happy path, duplicate signature rejection, inactive petition
 *  - generateSlug(): URL-safe slug generation
 *  - Goal-reached status transition when signature count hits signatureGoal
 */

const mockPrisma = () => ({
  petition: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  petitionSignature: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  petitionUpdate: {
    create: jest.fn(),
  },
});

describe('PetitionsService', () => {
  let service: PetitionsService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    prisma = mockPrisma();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetitionsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PetitionsService>(PetitionsService);
  });

  afterEach(() => jest.clearAllMocks());

  // ──────────────────────────────────────────────────────────────────────────
  // sign()
  // ──────────────────────────────────────────────────────────────────────────

  describe('sign()', () => {
    const activePetition = {
      id: 'pet-1',
      status: 'ACTIVE',
      signatureGoal: 1000,
      currentSignatures: 499,
      creatorId: 'creator-1',
    };

    it('creates a signature for an active petition', async () => {
      prisma.petition.findUnique.mockResolvedValue(activePetition);
      prisma.petitionSignature.findFirst.mockResolvedValue(null); // no existing sig
      prisma.petitionSignature.create.mockResolvedValue({ id: 'sig-1' });
      prisma.petition.update.mockResolvedValue({});

      const result = await service.sign('pet-1', 'user-1', { showPublicly: true });

      expect(result).toEqual({ id: 'sig-1' });
      expect(prisma.petitionSignature.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ petitionId: 'pet-1', userId: 'user-1' }),
        }),
      );
    });

    it('increments currentSignatures after a successful sign', async () => {
      prisma.petition.findUnique.mockResolvedValue(activePetition);
      prisma.petitionSignature.findFirst.mockResolvedValue(null);
      prisma.petitionSignature.create.mockResolvedValue({ id: 'sig-2' });
      prisma.petition.update.mockResolvedValue({});

      await service.sign('pet-1', 'user-2', {});

      expect(prisma.petition.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ currentSignatures: { increment: 1 } }),
        }),
      );
    });

    it('rejects duplicate signatures from the same user', async () => {
      prisma.petition.findUnique.mockResolvedValue(activePetition);
      prisma.petitionSignature.findFirst.mockResolvedValue({ id: 'existing-sig' });

      await expect(service.sign('pet-1', 'user-1', {})).rejects.toThrow(
        BadRequestException,
      );
      expect(prisma.petitionSignature.create).not.toHaveBeenCalled();
    });

    it('rejects signing a CLOSED petition', async () => {
      prisma.petition.findUnique.mockResolvedValue({ ...activePetition, status: 'CLOSED' });

      await expect(service.sign('pet-1', 'user-1', {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects signing a non-existent petition', async () => {
      prisma.petition.findUnique.mockResolvedValue(null);

      await expect(service.sign('nonexistent', 'user-1', {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('marks petition as SUCCESSFUL when signatureGoal is reached', async () => {
      const nearGoal = { ...activePetition, currentSignatures: 999, signatureGoal: 1000 };
      prisma.petition.findUnique.mockResolvedValue(nearGoal);
      prisma.petitionSignature.findFirst.mockResolvedValue(null);
      prisma.petitionSignature.create.mockResolvedValue({ id: 'sig-goal' });
      prisma.petition.update.mockResolvedValue({});

      await service.sign('pet-1', 'user-99', {});

      // Should be called twice: once for increment, once for SUCCESSFUL
      const calls = prisma.petition.update.mock.calls;
      const successCall = calls.find((c: any[]) =>
        JSON.stringify(c[0]).includes('SUCCESSFUL'),
      );
      expect(successCall).toBeDefined();
    });

    it('does NOT mark SUCCESSFUL if goal not reached yet', async () => {
      prisma.petition.findUnique.mockResolvedValue(activePetition); // 499 of 1000
      prisma.petitionSignature.findFirst.mockResolvedValue(null);
      prisma.petitionSignature.create.mockResolvedValue({ id: 'sig-3' });
      prisma.petition.update.mockResolvedValue({});

      await service.sign('pet-1', 'user-3', {});

      const calls = prisma.petition.update.mock.calls;
      const successCall = calls.find((c: any[]) =>
        JSON.stringify(c[0]).includes('SUCCESSFUL'),
      );
      expect(successCall).toBeUndefined();
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // addUpdate() — only creator can add updates
  // ──────────────────────────────────────────────────────────────────────────

  describe('addUpdate()', () => {
    it('allows creator to post an update', async () => {
      prisma.petition.findUnique.mockResolvedValue({ id: 'pet-1', creatorId: 'creator-1' });
      prisma.petitionUpdate.create.mockResolvedValue({ id: 'upd-1' });

      const result = await service.addUpdate('pet-1', 'creator-1', { content: 'Progress update!' });
      expect(result).toEqual({ id: 'upd-1' });
    });

    it('rejects update from non-creator', async () => {
      prisma.petition.findUnique.mockResolvedValue({ id: 'pet-1', creatorId: 'creator-1' });

      await expect(
        service.addUpdate('pet-1', 'different-user', { content: 'Sneaky update' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects update when petition does not exist', async () => {
      prisma.petition.findUnique.mockResolvedValue(null);

      await expect(
        service.addUpdate('nonexistent', 'user-1', { content: 'Update' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Slug generation (private, tested via create())
  // ──────────────────────────────────────────────────────────────────────────

  describe('create()', () => {
    it('generates a URL-safe slug from title', async () => {
      let capturedData: any;
      prisma.petition.create.mockImplementation((args: any) => {
        capturedData = args.data;
        return Promise.resolve({ id: 'pet-new', ...args.data });
      });

      await service.create('user-1', {
        title: 'Save Our Local Park!',
        description: 'A petition to save the park.',
      });

      expect(capturedData.slug).toMatch(/^save-our-local-park-\d+$/);
    });

    it('slug handles special characters and uppercasing', async () => {
      let capturedData: any;
      prisma.petition.create.mockImplementation((args: any) => {
        capturedData = args.data;
        return Promise.resolve(args.data);
      });

      await service.create('user-1', { title: 'Héllo WORLD! @#$', description: 'test' });

      // Accented chars are caught by [^a-z0-9]+ replacement
      expect(capturedData.slug).not.toMatch(/[A-Z!@#$]/);
    });
  });
});
