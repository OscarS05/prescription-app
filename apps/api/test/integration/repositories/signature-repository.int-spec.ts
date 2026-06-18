import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../../src/shared/infrastructure/prisma/prisma.service';
import { SignatureRepositoryPrismaAdapter } from '../../../src/modules/identity/infrastructure/db/signature.repository';
import { seedDoctor } from '../../../prisma/seeders/doctor.seed';
import { PrismaTransactionContext } from '../../../src/shared/infrastructure/prisma/transaction-context';

describe('SignatureRepositoryPrismaAdapter Integration', () => {
  let repository: SignatureRepositoryPrismaAdapter;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, PrismaTransactionContext, SignatureRepositoryPrismaAdapter],
    }).compile();

    repository = module.get(SignatureRepositoryPrismaAdapter);
    prisma = module.get(PrismaService);

    await seedDoctor();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();

    await prisma.$disconnect();
  });

  describe('.findById()', () => {
    it('should find user by id', async () => {
      const signatureDb = await prisma.doctorSignature.findFirst();
      const signature = await repository.findByDoctorId(signatureDb?.doctorId ?? '', true);

      expect(signature?.imageUrl).toBe('/uploads/signatures');
    });
  });

  describe('.deactivateAll()', () => {
    it(`should deactivate all doctor's signatures`, async () => {
      const signatureDb = await prisma.doctorSignature.findFirst();
      await prisma.doctorSignature.updateMany({
        where: { doctorId: signatureDb?.doctorId },
        data: { isActive: true },
      });

      const signature = await repository.deactivateAll(signatureDb?.doctorId ?? '');
      const updatedSignatures = await prisma.doctorSignature.findMany({
        where: { doctorId: signatureDb?.doctorId },
      });

      expect(signature).toBeUndefined();
      expect(updatedSignatures.every((s) => s.isActive === false)).toBeTruthy();
    });
  });

  describe('.create()', () => {
    it(`should deactivate all doctor's signatures`, async () => {
      const signatureDb = await prisma.doctorSignature.findFirst();

      const newSignature = {
        doctorId: signatureDb?.doctorId ?? '',
        isActive: true,
        imageUrl: '/uploads/signatures/test.png',
      };

      const signature = await repository.create(newSignature);

      expect(signature.id).toBeDefined();
      expect(signature.createdAt).toBeDefined();
      expect(signature.updatedAt).toBeDefined();

      expect(signature.doctorId).toBe(signatureDb?.doctorId);
      expect(signature.imageUrl).toBe(newSignature?.imageUrl);
      expect(signature.isActive).toBeTruthy();
    });
  });

  describe('.delete()', () => {
    it(`should deactivate all doctor's signatures`, async () => {
      const signatureDb = await prisma.doctorSignature.findFirst();

      const signature = await repository.delete(signatureDb?.id ?? '');
      const signatureDeleted = await prisma.doctorSignature.findFirst({
        where: { id: signatureDb?.id ?? '' },
      });

      expect(signatureDeleted).toBeNull();
      expect(signature).toBeUndefined();
    });
  });
});
