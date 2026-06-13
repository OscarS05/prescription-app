import { DoctorSignature as DoctorSignatureORM } from '@prisma/client';
import { DoctorSignature as DoctorSignatureEntity } from '../../domain/types/signatures.types';

export class DoctorSignatureMapper {
  static toDomain(orm: DoctorSignatureORM): DoctorSignatureEntity {
    return {
      id: orm.id,
      doctorId: orm.doctorId,
      imageUrl: orm.imageUrl,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
  }
}
