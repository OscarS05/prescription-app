import * as bcrypt from 'bcrypt';
import { UserRole, DocumentType } from '@prisma/client';
import { passwordSaltRounds, prisma } from '../main.seed';

export const adminEmailSeed = 'admin@test.com';
export const adminPassSeed = 'admin123';

export async function seedAdmin() {
  const adminPassword = await bcrypt.hash(adminPassSeed, passwordSaltRounds);
  const existingAdminUser = await prisma.user.findFirst({
    where: {
      email: adminEmailSeed,
    },
  });

  const user =
    existingAdminUser ||
    (await prisma.user.create({
      data: {
        email: adminEmailSeed,
        password: adminPassword,
        role: UserRole.admin,
        refreshTokenHash: null,
        documentType: DocumentType.cc,
        documentNumber: '100000001',
      },
    }));

  return user.id;
}
