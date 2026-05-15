import { Patient as PatientORM } from '@prisma/client';
import { Patient as PatientEntity } from '../../domain/types/patient.types';

export class PatientMapper {
  static toDomain(orm: PatientORM): PatientEntity {
    return {
      userId: orm.userId,
      birthDate: orm.birthDate,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
  }
}
