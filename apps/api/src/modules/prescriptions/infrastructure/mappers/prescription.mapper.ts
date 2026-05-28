import { Prescription as PrescriptionORM } from '@prisma/client';
import { Prescription } from '../../domain/types/prescription.types';
import { PrescriptionStatus } from '../../domain/enums/prescription-status.enum';

export class PrescriptionMapper {
  static toDomain(data: PrescriptionORM): Prescription {
    return {
      id: data.id,
      code: data.code,
      doctorId: data.doctorId,
      patientId: data.patientId,
      status: data.status as PrescriptionStatus,
      notes: data.notes,
      consumedAt: data.consumedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    };
  }
}
