import * as bcrypt from 'bcrypt';
import { UserRole, DocumentType } from '@prisma/client';
import { passwordSaltRounds, prisma } from '../main.seed';

export const doctorEmailSeed = 'dr@test.com';
export const doctorPassSeed = 'dr123';

export async function seedDoctor() {
  const doctorPassword = await bcrypt.hash(doctorPassSeed, passwordSaltRounds);
  const existingDoctorUser = await prisma.user.findFirst({
    where: {
      email: doctorEmailSeed,
    },
  });

  const user =
    existingDoctorUser ??
    (await prisma.user.create({
      data: {
        email: doctorEmailSeed,
        password: doctorPassword,
        role: UserRole.doctor,
        documentType: DocumentType.cc,
        refreshTokenHash: null,
        documentNumber: '100000002',
      },
    }));

  const existingDoctorProfile = await prisma.doctor.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!existingDoctorProfile) {
    await prisma.doctor.create({
      data: {
        userId: user.id,
        specialty: 'Cardiology',
      },
    });
  }

  return user.id;
}
