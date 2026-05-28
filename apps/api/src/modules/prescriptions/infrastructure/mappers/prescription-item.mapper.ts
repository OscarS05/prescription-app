import { PrescriptionItem as PrescriptionItemORM } from '@prisma/client';
import { PrescriptionItem } from '../../domain/types/prescription-items.type';

export class PrescriptionItemMapper {
  static toDomain(data: PrescriptionItemORM): PrescriptionItem {
    return {
      id: data.id,
      prescriptionId: data.prescriptionId,
      name: data.name,
      dosage: data.dosage,
      instructions: data.instructions,
      quantity: data.quantity,
    };
  }
}
