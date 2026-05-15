import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { seedAdmin } from './seeders/admin.seed';
import { seedDoctor } from './seeders/doctor.seed';
import { seedPatient } from './seeders/patient.seed';
import { seedPrescriptions } from './seeders/prescription.seed';

export const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL']! });
export const prisma = new PrismaClient({ adapter });

export const passwordSaltRounds = 10;

export async function runSeeds() {
  const adminId = await seedAdmin();
  const doctorId = await seedDoctor();
  const patientId = await seedPatient();
  await seedPrescriptions({ adminId, doctorId, patientId });

  console.log('Seed executed successfully.');
}
