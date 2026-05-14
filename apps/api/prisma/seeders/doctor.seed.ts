import * as bcrypt from 'bcrypt';
import { UserRole, DocumentType } from '@prisma/client';
import { passwordSaltRounds, prisma } from '../seed';

export async function seedDoctor() {
  const doctorPassword = await bcrypt.hash('dr123', passwordSaltRounds);
  const existingDoctorUser = await prisma.user.findFirst({
    where: {
      email: 'dr@test.com',
      deletedAt: null,
    },
  });

  const user =
    existingDoctorUser ??
    (await prisma.user.create({
      data: {
        email: 'dr@test.com',
        password: doctorPassword,
        role: UserRole.doctor,
        documentType: DocumentType.cc,
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
