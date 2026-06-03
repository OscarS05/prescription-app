import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../../src/shared/infrastructure/prisma/prisma.service';
import { UserRepositoryPrismaAdapter } from '../../../src/modules/identity/infrastructure/db/user.repository';
import { UserRole } from '../../../src/shared/domain/enums/roles.enum';

describe('UserRepositoryPrismaAdapter Integration', () => {
  let repository: UserRepositoryPrismaAdapter;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UserRepositoryPrismaAdapter],
    }).compile();

    repository = module.get(UserRepositoryPrismaAdapter);
    prisma = module.get(PrismaService);
  });

  afterEach(async () => {
    if (!prisma) return;

    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@integration.test',
        },
      },
    });
  });

  afterAll(async () => {
    if (!prisma) return;
    await prisma.$disconnect();
  });

  describe('.create()', () => {
    it('should create user successfully', async () => {
      const user = await repository.create({
        email: 'create@integration.test',
        password: '123456',
        role: UserRole.ADMIN,
        documentType: 'cc',
        documentNumber: '123',
      });

      expect(user.email).toBe('create@integration.test');
    });
  });

  describe('.findById()', () => {
    it('should find user by id', async () => {
      const createdUser = await prisma.user.create({
        data: {
          email: 'find@integration.test',
          password: '123456',
          role: UserRole.ADMIN,
          documentType: 'cc',
          documentNumber: '456',
        },
      });

      const user = await repository.findById(createdUser.id);

      expect(user).not.toBeNull();
      expect(user?.id).toBe(createdUser.id);
    });
  });

  describe('.findByEmail()', () => {
    it('should find user by email', async () => {
      await prisma.user.create({
        data: {
          email: 'find@integration.test',
          password: '123456',
          role: UserRole.ADMIN,
          documentType: 'cc',
          documentNumber: '456',
        },
      });

      const user = await repository.findByEmail('find@integration.test');

      expect(user).not.toBeNull();
    });

    it('should return null if user does not exist', async () => {
      const user = await repository.findByEmail('not-found@test.com');

      expect(user).toBeNull();
    });
  });

  describe('.getMetrics()', () => {
    it('should return null if user does not exist', async () => {
      const { doctors, newPatients, patients } = await repository.getMetrics({
        from: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        to: new Date(),
      });

      expect(doctors).toBe(1);
      expect(patients).toBe(1);
      expect(newPatients).toBe(1);
    });
  });
});
