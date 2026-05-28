import {
  CreatePrescription,
  PrescriptionQuery,
  Prescription,
  UpdatePrescription,
} from '../types/prescription.types';

export abstract class PrescriptionRepository {
  abstract create(data: CreatePrescription): Promise<Prescription>;
  abstract update(id: string, data: UpdatePrescription): Promise<Prescription>;
  abstract markAsConsumed(id: string): Promise<void>;
  abstract delete(id: string): Promise<void>;

  abstract findTheLastCode(): Promise<string>;
  abstract findAll(
    profileId: string,
    filters: PrescriptionQuery,
  ): Promise<[Prescription[], number]>;
  abstract findOneOrFail(key: string, includeItems: boolean): Promise<Prescription>;
}
