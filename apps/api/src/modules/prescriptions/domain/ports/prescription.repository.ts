import {
  CreatePrescription,
  Prescription,
  UpdatePrescription,
} from '../types/prescription.types';

export abstract class PrescriptionRepository {
  abstract create(data: CreatePrescription): Promise<Prescription>;
  abstract update(id: string, data: UpdatePrescription): Promise<Prescription>;
  abstract delete(id: string): Promise<void>;

  abstract findTheLastCode(): Promise<string>;
  abstract findAllByDoctorId(doctorId: string): Promise<Prescription[]>;
  abstract findAllByPatientId(patientId: string): Promise<Prescription[]>;
  abstract findOne(key: string): Promise<Prescription | null>;
  abstract findOneOrFail(key: string): Promise<Prescription>;
}
