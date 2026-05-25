import { PrescriptionStatus } from '@prisma/client';
import { prisma } from '../main.seed';

type UserIds = {
  adminId: string | null;
  doctorId: string | null;
  patientId: string | null;
};

export async function seedPrescriptions(ids: UserIds) {
  const currentYear = new Date().getFullYear().toString();

  const prescriptions = [
    {
      code: currentYear + '-001',
      status: PrescriptionStatus.pending,
    },
    {
      code: currentYear + '-002',
      status: PrescriptionStatus.pending,
    },
    {
      code: currentYear + '-003',
      status: PrescriptionStatus.consumed,
    },
    {
      code: currentYear + '-004',
      status: PrescriptionStatus.pending,
    },
    {
      code: currentYear + '-005',
      status: PrescriptionStatus.consumed,
    },
    {
      code: currentYear + '-006',
      status: PrescriptionStatus.pending,
    },
    {
      code: currentYear + '-007',
      status: PrescriptionStatus.consumed,
    },
    {
      code: currentYear + '-008',
      status: PrescriptionStatus.pending,
    },
  ];

  for (const prescriptionData of prescriptions) {
    const existPrescription = await prisma.prescription.findFirst({
      where: {
        code: prescriptionData.code,
      },
    });

    if (existPrescription) {
      continue;
    }

    await prisma.prescription.create({
      data: {
        code: prescriptionData.code,
        status: prescriptionData.status,
        notes: 'Take medication after meals.',
        doctorId: ids.doctorId || '',
        patientId: ids.patientId || '',
        consumedAt:
          prescriptionData.status === PrescriptionStatus.consumed ? new Date() : null,
        updatedAt: new Date(),
        items: {
          create: [
            {
              name: 'Ibuprofen',
              dosage: '400mg',
              quantity: 10,
              instructions: 'Take one tablet every 8 hours',
            },
            {
              name: 'Paracetamol',
              dosage: '500mg',
              quantity: 6,
              instructions: 'Take only if pain persists',
            },
          ],
        },
      },
    });
  }
}
