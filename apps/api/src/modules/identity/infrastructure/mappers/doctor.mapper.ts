import { Doctor as DoctorORM, DoctorSignature } from '@prisma/client';
import { Doctor as DoctorEntity } from '../../domain/types/doctor.types';

type DoctorWithRelations = DoctorORM & {
  signatures?: DoctorSignature[];
};

export class DoctorMapper {
  static toDomain(orm: DoctorWithRelations): DoctorEntity {
    return {
      userId: orm.userId,
      specialty: orm.specialty,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,

      signatures: orm.signatures,
    };
  }
}
