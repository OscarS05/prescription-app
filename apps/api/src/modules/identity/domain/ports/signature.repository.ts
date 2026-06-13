import { DoctorSignature } from '../types/signatures.types';

export abstract class DoctorSignatureRepository {
  abstract findByDoctorId(id: string, isActive: boolean): Promise<DoctorSignature>;
}
