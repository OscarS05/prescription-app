import * as bcrypt from 'bcrypt';
import { UserRole, DocumentType } from '@prisma/client';
import { passwordSaltRounds, prisma } from '../main.seed';

export const patientEmailSeed = 'patient@test.com';
export const patientPassSeed = 'patient123';

export async function seedPatient() {
  const patientPassword = await bcrypt.hash(patientPassSeed, passwordSaltRounds);

  const patientUser = await prisma.user.findFirst({
    where: {
      email: patientEmailSeed,
    },
  });

  const user =
    patientUser ??
    (await prisma.user.create({
      data: {
        email: patientEmailSeed,
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
