import { Doctor, Patient, User as UserORM } from '@prisma/client';
import { User as UserEntity } from '../../domain/types/auth.types';
import { UserRole } from '../../domain/enums/roles.enum';

type UserORMWithRelations = UserORM & {
  doctor?: Doctor | null;
  patient?: Patient | null;
};

export class UserMapper {
  static toDomain(orm: UserORMWithRelations): UserEntity {
    return {
      id: orm.id,
      role: orm.role as UserRole,
      email: orm.email,
      password: orm.password,
      documentType: orm.documentType as UserEntity['documentType'],
      documentNumber: orm.documentNumber,
      refreshTokenHash: orm.refreshTokenHash || null,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt || null,
      doctor: orm.doctor
        ? {
            userId: orm.doctor.userId,
            specialty: orm.doctor.specialty,
            createdAt: orm.doctor.createdAt,
            updatedAt: orm.doctor.updatedAt,
          }
        : undefined,
      patient: orm.patient
        ? {
            userId: orm.patient.userId,
            birthDate: orm.patient.birthDate,
            createdAt: orm.patient.createdAt,
            updatedAt: orm.patient.updatedAt,
          }
        : undefined,
    };
  }
}
