import { CreateSignature, DoctorSignature } from '../types/signatures.types';

export abstract class DoctorSignatureRepository {
  abstract findByDoctorId(id: string, isActive: boolean): Promise<DoctorSignature | null>;
  abstract create(data: CreateSignature): Promise<DoctorSignature>;
  abstract deactivateAll(userId: string): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
