// user-repository-prisma.adapter.int.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/shared/infrastructure/prisma/prisma.service';
import { UserRepositoryPrismaAdapter } from '../../../src/modules/auth/infrastructure/db/user.repository';
import { UserRole } from '../../../src/modules/auth/domain/enums/roles.enum';

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
