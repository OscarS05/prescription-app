import { PrismaService } from '../../../src/shared/infrastructure/prisma/prisma.service';

export async function clearDB(prismaService: PrismaService): Promise<void> {
  await prismaService.prescriptionItem.deleteMany();
  await prismaService.prescription.deleteMany();
  await prismaService.doctor.deleteMany();
  await prismaService.patient.deleteMany();
  await prismaService.user.deleteMany();
}
