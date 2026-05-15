import { CreateDoctor, Doctor } from '../types/doctor.types';

export abstract class DoctorRepository {
  abstract findById(id: string): Promise<Doctor | null>;
  abstract create(data: CreateDoctor): Promise<Doctor>;
}
