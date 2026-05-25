import { PrescriptionItem, UpdatePrescriptionItem } from '../types/prescription-items.type';

export abstract class PrescriptionItemRepository {
  abstract create(data: PrescriptionItem[]): Promise<PrescriptionItem[]>;
  abstract update(data: UpdatePrescriptionItem[]): Promise<PrescriptionItem[]>;
}
