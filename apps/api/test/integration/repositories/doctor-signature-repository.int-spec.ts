import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../../src/shared/infrastructure/prisma/prisma.service';
import { DoctorSignatureRepositoryPrismaAdapter } from '../../../src/modules/identity/infrastructure/db/doctor-signature.repository';
import { seedDoctor } from '../../../prisma/seeders/doctor.seed';
import { PrismaTransactionContext } from '../../../src/shared/infrastructure/prisma/transaction-context';

describe('DoctorSignatureRepositoryPrismaAdapter Integration', () => {
  let repository: DoctorSignatureRepositoryPrismaAdapter;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        PrismaTransactionContext,
        DoctorSignatureRepositoryPrismaAdapter,
      ],
    }).compile();

    repository = module.get(DoctorSignatureRepositoryPrismaAdapter);
    prisma = module.get(PrismaService);

    await seedDoctor();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('.findById()', () => {
    it('should find user by id', async () => {
      const signatureDb = await prisma.doctorSignature.findFirst();
      const signature = await repository.findByDoctorId(signatureDb?.doctorId ?? '', true);

      expect(signature?.imageUrl).toBe('/uploads/signatures');
    });
  });
});
