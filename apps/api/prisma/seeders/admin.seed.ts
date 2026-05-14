import * as bcrypt from 'bcrypt';
import { UserRole, DocumentType } from '@prisma/client';
import { passwordSaltRounds, prisma } from '../seed';

export async function seedAdmin() {
  let id: string | null = null;

  const adminPassword = await bcrypt.hash('admin123', passwordSaltRounds);
  const existingAdminUser = await prisma.user.findFirst({
    where: {
      email: 'admin@test.com',
      deletedAt: null,
    },
  });

  if (!existingAdminUser) {
    const user = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: adminPassword,
        role: UserRole.admin,
        documentType: DocumentType.cc,
        documentNumber: '100000001',
      },
    });

    id = user.id;
  }

  return id || existingAdminUser?.id || null;
}
