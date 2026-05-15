import { Doctor as DoctorORM } from '@prisma/client';
import { Doctor as DoctorEntity } from '../../domain/types/doctor.types';

export class DoctorMapper {
  static toDomain(orm: DoctorORM): DoctorEntity {
    return {
      userId: orm.userId,
      specialty: orm.specialty,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
  }
}
