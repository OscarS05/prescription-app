import { PrescriptionStatus } from '@prisma/client';
import { prisma } from '../seed';

type UserIds = {
  adminId: string | null;
  doctorId: string | null;
  patientId: string | null;
};

export async function seedPrescriptions(ids: UserIds) {
  const prescriptions = [
    {
      code: 'RX-001',
      status: PrescriptionStatus.pending,
    },
    {
      code: 'RX-002',
      status: PrescriptionStatus.pending,
    },
    {
      code: 'RX-003',
      status: PrescriptionStatus.consumed,
    },
    {
      code: 'RX-004',
      status: PrescriptionStatus.pending,
    },
    {
      code: 'RX-005',
      status: PrescriptionStatus.consumed,
    },
    {
      code: 'RX-006',
      status: PrescriptionStatus.pending,
    },
    {
      code: 'RX-007',
      status: PrescriptionStatus.consumed,
    },
    {
      code: 'RX-008',
      status: PrescriptionStatus.pending,
    },
  ];

  for (const prescriptionData of prescriptions) {
    const existPrescription = await prisma.prescription.findFirst({
      where: {
        code: prescriptionData.code,
        deletedAt: null,
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
