import {
  CreatePrescriptionItem,
  PrescriptionItem,
  UpdatePrescriptionItem,
} from '../types/prescription-items.type';

export abstract class PrescriptionItemRepository {
  abstract create(data: CreatePrescriptionItem[]): Promise<PrescriptionItem[]>;
  abstract update(data: UpdatePrescriptionItem[]): Promise<PrescriptionItem[]>;
  abstract delete(ids: string[]): Promise<void>;
}
