import { CreatePatient, Patient } from '../types/patient.types';

export abstract class PatientRepository {
  abstract findById(id: string): Promise<Patient | null>;
  abstract create(data: CreatePatient): Promise<Patient>;
}
