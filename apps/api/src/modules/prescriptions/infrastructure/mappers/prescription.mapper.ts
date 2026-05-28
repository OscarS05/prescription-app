import { PrescriptionItem, Prescription as PrescriptionORM } from '@prisma/client';
import { Prescription } from '../../domain/types/prescription.types';
import { PrescriptionStatus } from '../../domain/enums/prescription-status.enum';
import { PrescriptionItemMapper } from './prescription-item.mapper';

type PrescriptionWithItems = PrescriptionORM & {
  items?: PrescriptionItem[];
};

export class PrescriptionMapper {
  static toDomain(data: PrescriptionWithItems): Prescription {
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

      items: data.items?.map((item) => PrescriptionItemMapper.toDomain(item)),
    };
  }
}
