import * as bcrypt from 'bcrypt';
import { UserRole, DocumentType } from '@prisma/client';
import { passwordSaltRounds, prisma } from '../seed';

export async function seedPatient() {
  const patientPassword = await bcrypt.hash('patient123', passwordSaltRounds);

  const patientUser = await prisma.user.findFirst({
    where: {
      email: 'patient@test.com',
      deletedAt: null,
    },
  });

  const user =
    patientUser ??
    (await prisma.user.create({
      data: {
        email: 'patient@test.com',
        password: patientPassword,
        role: UserRole.patient,
        documentType: DocumentType.cc,
        refreshTokenHash: null,
        documentNumber: '100000003',
      },
    }));

  const existingPatientProfile = await prisma.patient.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!existingPatientProfile) {
    await prisma.patient.create({
      data: {
        userId: user.id,
        birthDate: new Date('2000-01-15'),
      },
    });
  }

  return user.id;
}
