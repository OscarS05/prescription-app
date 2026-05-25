import { PrescriptionItem, UpdatePrescriptionItem } from '../types/prescription-items.type';

export abstract class PrescriptionItemRepository {
  abstract create(data: PrescriptionItem[]): Promise<PrescriptionItem[]>;
  abstract update(id: string, data: UpdatePrescriptionItem): Promise<PrescriptionItem>;
}
