import { Prescription, UpdatePrescription } from '../types/prescription.types';

export abstract class PrescriptionRepository {
  abstract create(data: Prescription): Promise<Prescription>;
  abstract update(id: string, data: UpdatePrescription): Promise<Prescription>;
  abstract delete(id: string): Promise<void>;

  abstract findAllByDoctorId(doctorId: string): Promise<Prescription[]>;
  abstract findAllByPatientId(patientId: string): Promise<Prescription[]>;
  abstract findOne(id: string): Promise<Prescription | null>;
}
